import { useState, useEffect, useRef } from "react";
import { ApiService } from "@/lib/api/api-service";
import { 
  workflowWsManager, 
  type NodeCompletedData, 
  type StateSyncData,
  type WorkflowCompletedData,
  type WorkflowFailedData,
  type NodeStartedData,
} from "@/lib/websocket";
import { useWorkflowCanvasStore } from "@/stores";
import { useWorkflowExecutionStore } from "@/stores/workflow/workflow-execution-store";

interface UseWorkflowExecutionProps {
  workflowId?: string;
}

export const useWorkflowExecution = ({ workflowId }: UseWorkflowExecutionProps) => {
  // Workflow execution state
  const [isRunning, setIsRunning] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Store refs to avoid re-render loops - get store directly, not via hook
  const canvasStoreRef = useRef(useWorkflowCanvasStore.getState());
  const executionStoreRef = useRef(useWorkflowExecutionStore.getState());
  
  // Subscribe to store changes (but don't cause re-renders)
  useEffect(() => {
    const unsubCanvas = useWorkflowCanvasStore.subscribe(
      (state) => { canvasStoreRef.current = state; }
    );
    const unsubExecution = useWorkflowExecutionStore.subscribe(
      (state) => { executionStoreRef.current = state; }
    );
    return () => {
      unsubCanvas();
      unsubExecution();
    };
  }, []);

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
      } catch {
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
      // Connect WebSocket via singleton manager
      workflowWsManager.connect(workflowId);
      
      const response = await ApiService.startWorkflowExecution(workflowId);
      setTaskId(response.task_id);
      setTaskStatus(response.status);
      setIsRunning(true);
      startPolling();
      
      console.log('🚀 [Execution] Workflow started, WebSocket connected');
    } catch {
      workflowWsManager.disconnect();
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
      workflowWsManager.disconnect();
      console.log('🛑 [Execution] Workflow stopped, WebSocket disconnected');
    } catch {
      // Error handling
    }
  };

  // WebSocket event handlers - defined once and stable
  useEffect(() => {
    // Handler: Connected
    const handleConnected = () => {
      console.log('✅ [Execution] WebSocket connected');
      setWsConnected(true);
    };
    
    // Handler: Disconnected
    const handleDisconnected = () => {
      console.log('🔌 [Execution] WebSocket disconnected');
      setWsConnected(false);
    };
    
    // Handler: State sync (on initial connect or reconnect)
    const handleStateSync = (data: StateSyncData) => {
      console.log('🔄 [Execution] State sync received:', data);
      
      const store = executionStoreRef.current;
      store.setExecutingNodes(data.executing_nodes || {});
      
      if (data.status === 'running') {
        store.setStatus('running');
        setIsRunning(true);
      } else if (data.status === 'completed') {
        store.setStatus('completed');
        setIsRunning(false);
      } else if (data.status === 'failed') {
        store.setStatus('failed');
        setIsRunning(false);
      }
    };
    
    // Handler: Node started
    const handleNodeStarted = (data: NodeStartedData) => {
      console.log('▶️ [Execution] Node started:', data.node_id);
      
      const store = executionStoreRef.current;
      store.addExecutingNode(data.node_id, {
        node_id: data.node_id,
        node_type: data.node_type,
        started_at: data.started_at,
        duration_seconds: 0,
      });
    };
    
    // Handler: Node completed - update store and highlight edges
    const handleNodeCompleted = (data: NodeCompletedData) => {
      console.log('✅ [Execution] Node completed:', data.node_id, 'route:', data.route);
      
      // Update execution store
      const execStore = executionStoreRef.current;
      execStore.removeExecutingNode(data.node_id);
      
      // Highlight edges
      const canvasStore = canvasStoreRef.current;
      const connections = canvasStore.connections;
      const highlightEdge = canvasStore.highlightEdge;
      
      const outgoingEdges = connections.filter(conn => conn.source_node_id === data.node_id);
      
      outgoingEdges.forEach(edge => {
        // For conditional nodes, only highlight the matching route
        if (data.route && edge.source_handle !== data.route) {
          return;
        }
        highlightEdge(edge.id, '#22c55e', 1500);
      });
    };
    
    // Handler: Node failed
    const handleNodeFailed = (data: { node_id: string }) => {
      console.log('❌ [Execution] Node failed:', data.node_id);
      
      const store = executionStoreRef.current;
      store.removeExecutingNode(data.node_id);
    };
    
    // Handler: Workflow completed
    const handleWorkflowCompleted = (data: WorkflowCompletedData) => {
      console.log('🎉 [Execution] Workflow completed:', data.status);
      
      setIsRunning(false);
      setTaskId(null);
      setTaskStatus(null);
      
      const store = executionStoreRef.current;
      store.setStatus('completed');
      store.setExecutingNodes({});
      
      workflowWsManager.disconnect();
    };
    
    // Handler: Workflow failed
    const handleWorkflowFailed = (data: WorkflowFailedData) => {
      console.log('💥 [Execution] Workflow failed:', data.error);
      
      setIsRunning(false);
      
      const store = executionStoreRef.current;
      store.setStatus('failed');
      store.setExecutingNodes({});
      
      workflowWsManager.disconnect();
    };
    
    // Subscribe to all events
    workflowWsManager.on('connected', handleConnected);
    workflowWsManager.on('disconnected', handleDisconnected);
    workflowWsManager.on('state_sync', handleStateSync);
    workflowWsManager.on('node_started', handleNodeStarted);
    workflowWsManager.on('node_completed', handleNodeCompleted);
    workflowWsManager.on('node_failed', handleNodeFailed);
    workflowWsManager.on('workflow_completed', handleWorkflowCompleted);
    workflowWsManager.on('workflow_failed', handleWorkflowFailed);
    
    // Cleanup: unsubscribe from all events
    return () => {
      workflowWsManager.off('connected', handleConnected);
      workflowWsManager.off('disconnected', handleDisconnected);
      workflowWsManager.off('state_sync', handleStateSync);
      workflowWsManager.off('node_started', handleNodeStarted);
      workflowWsManager.off('node_completed', handleNodeCompleted);
      workflowWsManager.off('node_failed', handleNodeFailed);
      workflowWsManager.off('workflow_completed', handleWorkflowCompleted);
      workflowWsManager.off('workflow_failed', handleWorkflowFailed);
    };
  }, []); // Empty deps - handlers are stable via refs

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
            // Connect WebSocket for real-time updates
            workflowWsManager.connect(workflowId);
            console.log('🔄 [Execution] Workflow is running, connecting WebSocket');
            
            // Only start polling if still in PENDING state
            if (statusResponse.status === 'PENDING') {
              startPolling();
            }
          }
        }
      } catch {
        // Silently handle error - workflow state will be restored on next interaction
      }
    };
    
    fetchWorkflowState();
  }, [workflowId]);

  // Cleanup polling and WebSocket on unmount
  useEffect(() => {
    return () => {
      stopPolling();
      workflowWsManager.disconnect();
    };
  }, []);

  return {
    // State
    isRunning,
    taskId,
    taskStatus,
    wsConnected,
    
    // Actions
    startExecution,
    stopExecution,
  };
};
