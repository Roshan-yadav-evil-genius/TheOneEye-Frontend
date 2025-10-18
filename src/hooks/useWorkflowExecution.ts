import { useState, useEffect, useRef } from "react";
import { ApiService } from "@/lib/api/api-service";

interface UseWorkflowExecutionProps {
  workflowId?: string;
}

export const useWorkflowExecution = ({ workflowId }: UseWorkflowExecutionProps) => {
  // Workflow execution state
  const [isRunning, setIsRunning] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Polling functions
  const startPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    pollingIntervalRef.current = setInterval(async () => {
      if (!workflowId || !taskId) return;
      
      try {
        const response = await ApiService.getWorkflowTaskStatus(workflowId);
        setTaskStatus(response.status);
        
        // Update isRunning based on status
        const runningStates = ['PENDING', 'STARTED', 'RETRY'];
        const terminalStates = ['SUCCESS', 'FAILURE', 'REVOKED'];
        
        if (runningStates.includes(response.status)) {
          setIsRunning(true);
        } else if (terminalStates.includes(response.status)) {
          setIsRunning(false);
          setTaskId(null);
          setTaskStatus(null);
          stopPolling();
        }
        
        // Stop polling when execution starts (STARTED state)
        if (response.status === 'STARTED') {
          stopPolling();
        }
      } catch (error) {
        // Don't break UI if polling fails
      }
    }, 2000);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  // Execution control functions
  const startExecution = async () => {
    if (!workflowId) {
      return;
    }

    try {
      const response = await ApiService.startWorkflowExecution(workflowId);
      setTaskId(response.task_id);
      setTaskStatus(response.status);
      setIsRunning(true);
      startPolling();
    } catch (error) {
      // TODO: Show toast notification for error
    }
  };

  const stopExecution = async () => {
    if (!workflowId) {
      return;
    }

    try {
      await ApiService.stopWorkflowExecution(workflowId);
      setTaskId(null);
      setTaskStatus(null);
      setIsRunning(false);
      stopPolling();
    } catch (error) {
      // TODO: Show toast notification for error
    }
  };

  // Fetch workflow state on mount to restore execution state
  useEffect(() => {
    const fetchWorkflowState = async () => {
      if (!workflowId) return;
      
      try {
        // Fetch workflow to get task_id
        const workflows = await ApiService.getWorkflows();
        const workflow = workflows.find(w => w.id === workflowId);
        
        if (workflow?.task_id) {
          setTaskId(workflow.task_id);
          // Check current status
          const statusResponse = await ApiService.getWorkflowTaskStatus(workflowId);
          setTaskStatus(statusResponse.status);
          
          const runningStates = ['PENDING', 'STARTED', 'RETRY'];
          if (runningStates.includes(statusResponse.status)) {
            setIsRunning(true);
            // Only start polling if still in PENDING state
            if (statusResponse.status === 'PENDING') {
              startPolling();
            }
          }
        }
      } catch (error) {
        // Silently handle error - workflow state will be restored on next interaction
      }
    };
    
    fetchWorkflowState();
  }, [workflowId]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  return {
    // State
    isRunning,
    taskId,
    taskStatus,
    
    // Actions
    startExecution,
    stopExecution,
  };
};
