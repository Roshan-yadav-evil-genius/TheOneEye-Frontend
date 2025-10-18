import { useState, useEffect, useCallback } from 'react';
import { ApiService } from '@/lib/api/api-service';

export interface TaskStatus {
  state: 'PENDING' | 'STARTED' | 'SUCCESS' | 'FAILURE' | 'RETRY' | 'REVOKED';
  result?: any;
  error?: string;
  progress?: number;
}

export interface UseTaskStatusOptions {
  pollInterval?: number;
  maxPollingTime?: number;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  onComplete?: (status: TaskStatus) => void;
}

export interface UseTaskStatusReturn {
  status: TaskStatus | null;
  isLoading: boolean;
  error: string | null;
  startPolling: (taskId: string) => void;
  stopPolling: () => void;
  isPolling: boolean;
}

export function useTaskStatus(options: UseTaskStatusOptions = {}): UseTaskStatusReturn {
  const {
    pollInterval = 2000, // Poll every 2 seconds
    maxPollingTime = 60000, // Stop after 1 minute
    onSuccess,
    onError,
    onComplete
  } = options;

  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingStartTime, setPollingStartTime] = useState<number | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);

  const pollTaskStatus = useCallback(async (taskId: string) => {
    try {
      const data = await ApiService.getTaskStatus(taskId);
      const taskStatus: TaskStatus = {
        state: data.state as TaskStatus['state'],
        result: data.result,
        error: data.error,
        progress: data.progress
      };

      setStatus(taskStatus);
      setError(null);

      // Check if task is complete
      if (taskStatus.state === 'SUCCESS') {
        setIsPolling(false);
        setIsLoading(false);
        onSuccess?.(taskStatus.result);
        onComplete?.(taskStatus);
      } else if (taskStatus.state === 'FAILURE') {
        setIsPolling(false);
        setIsLoading(false);
        const errorMessage = taskStatus.error || 'Task failed';
        setError(errorMessage);
        onError?.(errorMessage);
        onComplete?.(taskStatus);
      } else if (taskStatus.state === 'REVOKED') {
        setIsPolling(false);
        setIsLoading(false);
        const errorMessage = 'Task was cancelled';
        setError(errorMessage);
        onError?.(errorMessage);
        onComplete?.(taskStatus);
      }

      return taskStatus;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setIsPolling(false);
      setIsLoading(false);
      onError?.(errorMessage);
      return null;
    }
  }, [onSuccess, onError, onComplete]);

  const startPolling = useCallback((taskId: string) => {
    setCurrentTaskId(taskId);
    setIsPolling(true);
    setIsLoading(true);
    setError(null);
    setPollingStartTime(Date.now());
    
    // Start polling immediately
    pollTaskStatus(taskId);
  }, [pollTaskStatus]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    setIsLoading(false);
    setCurrentTaskId(null);
    setPollingStartTime(null);
  }, []);

  // Polling effect
  useEffect(() => {
    if (!isPolling || !currentTaskId) return;

    const interval = setInterval(async () => {
      // Check if we've exceeded max polling time
      if (pollingStartTime && Date.now() - pollingStartTime > maxPollingTime) {
        stopPolling();
        setError('Task polling timeout');
        onError?.('Task polling timeout');
        return;
      }

      await pollTaskStatus(currentTaskId);
    }, pollInterval);

    return () => clearInterval(interval);
  }, [isPolling, currentTaskId, pollInterval, maxPollingTime, pollingStartTime, pollTaskStatus, stopPolling, onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    status,
    isLoading,
    error,
    startPolling,
    stopPolling,
    isPolling
  };
}

