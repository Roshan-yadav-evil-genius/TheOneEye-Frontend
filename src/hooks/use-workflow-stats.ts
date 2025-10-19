/**
 * Custom hook for fetching workflow resource statistics.
 */

import { useState, useEffect, useCallback } from 'react';
import { WorkflowStatsResponse, ContainerStats, TimeRange, ChartDataPoint, CurrentStats } from '@/types/stats';
import { axiosApiClient } from '@/lib/api/axios-client';

interface UseWorkflowStatsOptions {
  workflowId: string;
  timeRange?: TimeRange;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseWorkflowStatsReturn {
  stats: ContainerStats[];
  chartData: ChartDataPoint[];
  currentStats: CurrentStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setTimeRange: (range: TimeRange) => void;
}

export function useWorkflowStats({
  workflowId,
  timeRange = '24h',
  autoRefresh = false,
  refreshInterval = 30000, // 30 seconds
}: UseWorkflowStatsOptions): UseWorkflowStatsReturn {
  const [stats, setStats] = useState<ContainerStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTimeRange, setCurrentTimeRange] = useState<TimeRange>(timeRange);

  const fetchStats = useCallback(async () => {
    if (!workflowId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data: WorkflowStatsResponse = await axiosApiClient.get(
        `/workflow/${workflowId}/resource_stats/`,
        {
          params: {
            range: currentTimeRange,
          },
        }
      );
      setStats(data.stats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch workflow stats';
      setError(errorMessage);
      console.error('Error fetching workflow stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [workflowId, currentTimeRange]);

  // Transform stats data for charts
  const chartData: ChartDataPoint[] = stats.map((stat) => ({
    time: new Date(stat.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    cpu: stat.cpu_percent,
    memory: stat.memory_percent,
    networkIn: stat.network_in_kb,
    networkOut: stat.network_out_kb,
    diskRead: stat.disk_read_mb,
    diskWrite: stat.disk_write_mb,
  }));

  // Get current stats (latest entry)
  const currentStats: CurrentStats | null = stats.length > 0 ? {
    cpu: stats[0].cpu_percent,
    memory: stats[0].memory_percent,
    networkIn: stats[0].network_in_kb,
    networkOut: stats[0].network_out_kb,
    diskRead: stats[0].disk_read_mb,
    diskWrite: stats[0].disk_write_mb,
  } : null;

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(fetchStats, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchStats]);

  // Initial fetch and refetch when time range changes
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const setTimeRange = useCallback((range: TimeRange) => {
    setCurrentTimeRange(range);
  }, []);

  return {
    stats,
    chartData,
    currentStats,
    isLoading,
    error,
    refetch: fetchStats,
    setTimeRange,
  };
}
