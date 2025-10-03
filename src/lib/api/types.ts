import { Node } from '@/data/nodes';

// Types for API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface NodeCreateData {
  name: string;
  type: Node['type'];
  category: string;
  description?: string;
  version?: string;
  isActive?: boolean; // Optional for creation, defaults to true
  formConfiguration?: Record<string, unknown>;
  tags?: string[];
}

export interface NodeUpdateData extends Partial<NodeCreateData> {}

export interface NodeFilters {
  type?: string;
  category?: string;
  is_active?: boolean;
  tags?: string[];
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface NodeStats {
  total_nodes: number;
  active_nodes: number;
  inactive_nodes: number;
  by_type: Record<string, number>;
  by_category: Record<string, number>;
  recent_created: number;
}

// Custom error class for API errors
export class ApiError extends Error {
  public status?: number;
  public data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}
