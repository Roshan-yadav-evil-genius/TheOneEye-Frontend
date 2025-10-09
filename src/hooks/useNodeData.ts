import { useState, useEffect } from 'react';
import { ApiService } from '@/lib/api/api-service';

export function useNodeData(workflowId: string, nodeId: string) {
  const [inputData, setInputData] = useState<Record<string, unknown> | null>(null);
  const [outputData, setOutputData] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
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
    };
    fetchData();
  }, [workflowId, nodeId]);

  return { inputData, outputData, isLoading, error };
}
