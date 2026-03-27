// API Response Types
import { TWorkflowNode, TWorkflowConnection } from '../common/entities';
import { BackendWorkflowNode, BackendWorkflowConnection } from './backend';

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
  nodes: BackendWorkflowNode[];
  edges: BackendWorkflowConnection[];
  workflow: {
    id: string;
    name: string;
    description: string;
    status: string;
    workflow_type?: string;
    runs_count: number;
    last_run?: string | null;
  };
}

// Workflow Node Creation Response
export type TWorkflowNodeCreateResponse = BackendWorkflowNode;
