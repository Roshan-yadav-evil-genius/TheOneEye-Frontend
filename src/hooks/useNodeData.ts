import { useState, useEffect, useCallback } from 'react';
import { ApiService } from '@/lib/api/api-service';

export function useNodeData(workflowId: string, nodeId: string, shouldFetch: boolean = true) {
  const [inputData, setInputData] = useState<Record<string, unknown> | null>(null);
  const [outputData, setOutputData] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [input, output] = await Promise.all([
        ApiService.getNodeInputData(workflowId, nodeId),
        ApiService.getNodeOutputData(workflowId, nodeId)
      ]);
      setInputData(input);
      setOutputData(output);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [workflowId, nodeId]);

  useEffect(() => {
    if (!shouldFetch) {
      return;
    }
    
    fetchData();
  }, [shouldFetch, fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { inputData, outputData, isLoading, error, refetch };
}
