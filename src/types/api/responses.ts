// API Response Types
import { TWorkflowNode, TWorkflowConnection } from '../common/entities';

export interface TApiResponse<T> {
  data: T;
  message?: string;
}

export interface TPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface TNodeStats {
  total_nodes: number;
  active_nodes: number;
  inactive_nodes: number;
  by_type: Record<string, number>;
  by_category: Record<string, number>;
  recent_created: number;
}

// Workflow Canvas Data Response
export interface TWorkflowCanvasData {
  nodes: TWorkflowNode[];
  edges: TWorkflowConnection[];
  workflow: {
    id: string;
    name: string;
    description: string;
    status: string;
  };
}

// Workflow Node Creation Response
export interface TWorkflowNodeCreateResponse {
  id: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    // Only node-specific configuration data
    formValues?: Record<string, unknown>;
    customSettings?: Record<string, unknown>;
  };
  node_type?: {
    id: string;
    name: string;
    type: string;
    description?: string;
    logo?: string;
    form_configuration: Record<string, unknown>;
    tags: string[];
    node_group: {
      id: string;
      name: string;
      description?: string;
      icon?: string;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
    version: string;
    is_active: boolean;
    created_by?: string;
    created_at: string;
    updated_at: string;
  } | null;
}
