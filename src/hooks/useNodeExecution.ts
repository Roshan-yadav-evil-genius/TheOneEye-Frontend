import { useCallback, useEffect } from 'react';
import { ApiService } from '@/lib/api/api-service';
import { useTaskStatus } from './useTaskStatus';
import { toast } from 'sonner';
import { useNodeExecutionStore } from '@/stores/node-execution-store';

export interface UseNodeExecutionOptions {
  workflowId: string;
  nodeId: string;
  nodeName?: string;
  onSuccess?: (result: unknown) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
}

export interface UseNodeExecutionReturn {
  isExecuting: boolean;
  isPolling: boolean;
  lastExecutionResult: unknown;
  executeNode: () => Promise<void>;
  stopExecution: () => void;
  status: unknown;
}

export function useNodeExecution(options: UseNodeExecutionOptions): UseNodeExecutionReturn {
  const { workflowId, nodeId, nodeName = 'Unknown Node', onSuccess, onError, onComplete } = options;
  
  // Get state and actions from store
  const executionState = useNodeExecutionStore((state) => state.getExecutionState(nodeId));
  const setExecuting = useNodeExecutionStore((state) => state.setExecuting);
  const setPolling = useNodeExecutionStore((state) => state.setPolling);
  const setResult = useNodeExecutionStore((state) => state.setResult);

  const { isExecuting, isPolling, lastExecutionResult } = executionState;

  const { startPolling, stopPolling, isPolling: taskIsPolling, status } = useTaskStatus({
    onSuccess: (result) => {
      // Extract just the result field
      const executionResponse = result as { result?: unknown };
      const actualResult = executionResponse.result || result;
      
      setResult(nodeId, actualResult);
      toast.success(`${nodeName} executed successfully!`);
      onSuccess?.(actualResult);
    },
    onError: (error) => {
      setExecuting(nodeId, false);
      setPolling(nodeId, false);
      toast.error(`${nodeName} execution failed`, { description: error });
      onError?.(error);
    },
    onComplete: () => {
      setExecuting(nodeId, false);
      setPolling(nodeId, false);
      onComplete?.();
    }
  });

  // Sync store polling state with task polling state
  useEffect(() => {
    setPolling(nodeId, taskIsPolling);
  }, [taskIsPolling, nodeId, setPolling]);

  const executeNode = useCallback(async () => {
    if (!workflowId) {
      toast.error("Workflow ID not available");
      return;
    }
    
    if (isExecuting || isPolling) {
      return; // Prevent multiple executions
    }
    
    try {
      setExecuting(nodeId, true);
      toast.info(`Starting execution of ${nodeName}...`);
      
      const result = await ApiService.executeSingleNode(workflowId, nodeId);
      
      if (result.task_id) {
        setPolling(nodeId, true, result.task_id);
        startPolling(result.task_id);
      } else {
        throw new Error('No task ID returned from server');
      }
    } catch (error) {
      setExecuting(nodeId, false);
      toast.error(`Failed to execute ${nodeName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [workflowId, nodeId, nodeName, isExecuting, isPolling, startPolling, setExecuting, setPolling]);

  const stopExecution = useCallback(() => {
    stopPolling();
    setExecuting(nodeId, false);
    setPolling(nodeId, false);
    toast.info("Stopped polling for task results");
  }, [stopPolling, nodeId, setExecuting, setPolling]);

  return {
    isExecuting,
    isPolling,
    lastExecutionResult,
    executeNode,
    stopExecution,
    status
  };
}
