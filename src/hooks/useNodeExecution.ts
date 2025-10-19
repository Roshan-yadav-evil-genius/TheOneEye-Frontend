import { useState, useCallback } from 'react';
import { ApiService } from '@/lib/api/api-service';
import { useTaskStatus } from './useTaskStatus';
import { toast } from 'sonner';

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
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastExecutionResult, setLastExecutionResult] = useState<unknown>(null);

  const { startPolling, stopPolling, isPolling, status } = useTaskStatus({
    onSuccess: (result) => {
      setLastExecutionResult(result);
      toast.success(`${nodeName} executed successfully!`, {
        description: `Result: ${JSON.stringify(result, null, 2).substring(0, 100)}...`,
        duration: 5000,
      });
      onSuccess?.(result);
    },
    onError: (error) => {
      toast.error(`${nodeName} execution failed`, {
        description: error,
        duration: 5000,
      });
      onError?.(error);
    },
    onComplete: () => {
      setIsExecuting(false);
      onComplete?.();
    }
  });

  const executeNode = useCallback(async () => {
    if (!workflowId) {
      toast.error("Workflow ID not available");
      return;
    }
    
    if (isExecuting || isPolling) {
      return; // Prevent multiple executions
    }
    
    try {
      setIsExecuting(true);
      toast.info(`Starting execution of ${nodeName}...`);
      
      const result = await ApiService.executeSingleNode(workflowId, nodeId);
      
      if (result.task_id) {
        toast.info(`Execution started for ${nodeName}. Polling for results...`);
        startPolling(result.task_id);
      } else {
        throw new Error('No task ID returned from server');
      }
    } catch (error) {
      setIsExecuting(false);
      toast.error(`Failed to execute ${nodeName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [workflowId, nodeId, nodeName, isExecuting, isPolling, startPolling]);

  const stopExecution = useCallback(() => {
    stopPolling();
    setIsExecuting(false);
    toast.info("Stopped polling for task results");
  }, [stopPolling]);

  return {
    isExecuting,
    isPolling,
    lastExecutionResult,
    executeNode,
    stopExecution,
    status
  };
}
