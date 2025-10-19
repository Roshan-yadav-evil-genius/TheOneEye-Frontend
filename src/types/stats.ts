/**
 * TypeScript types for container resource statistics.
 */

export interface ContainerStats {
  id: string;
  cpu_percent: number;
  memory_usage_mb: number;
  memory_percent: number;
  network_in_kb: number;
  network_out_kb: number;
  disk_read_mb: number;
  disk_write_mb: number;
  timestamp: string;
}

export interface WorkflowStatsResponse {
  workflow_id: string;
  workflow_name: string;
  time_range: string;
  stats_count: number;
  stats: ContainerStats[];
}

export type TimeRange = '1h' | '24h' | '7d' | '30d';

export interface StatsQueryParams {
  range?: TimeRange;
}

// Chart data format for the frontend components
export interface ChartDataPoint {
  time: string;
  cpu: number;
  memory: number;
  networkIn: number;
  networkOut: number;
  diskRead: number;
  diskWrite: number;
}

// Current live values for display
export interface CurrentStats {
  cpu: number;
  memory: number;
  networkIn: number;
  networkOut: number;
  diskRead: number;
  diskWrite: number;
}
