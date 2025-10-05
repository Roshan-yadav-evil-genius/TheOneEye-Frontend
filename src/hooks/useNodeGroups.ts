import { useState, useEffect } from 'react';
import { TNodeGroup } from '@/types';
import { ApiService } from '@/lib/api/api-service';

export const useNodeGroups = () => {
  const [nodeGroups, setNodeGroups] = useState<TNodeGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNodeGroups = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const groups = await ApiService.getNodeGroups();
        setNodeGroups(groups);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch node groups');
        console.error('Error fetching node groups:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNodeGroups();
  }, []);

  return {
    nodeGroups,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setError(null);
      ApiService.getNodeGroups()
        .then(setNodeGroups)
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to fetch node groups');
          console.error('Error fetching node groups:', err);
        })
        .finally(() => setIsLoading(false));
    }
  };
};
