import { TNode } from '../common';
import { BackendNodeGroup } from './backend';

// API Request Types
export interface TNodeCreateData {
  name: string;
  type: TNode['type'];
  nodeGroup: string | BackendNodeGroup; // NodeGroup ID or full object
  description?: string;
  version?: string;
  isActive?: boolean; // Optional for creation, defaults to true
  formConfiguration?: Record<string, unknown>;
  tags?: string[];
  logoFile?: File; // Optional logo file
}

export type TNodeUpdateData = Partial<TNodeCreateData>

export interface TNodeFilters {
  type?: string;
  is_active?: boolean;
  tags?: string[];
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// Workflow-specific request types
export interface TWorkflowNodeCreateRequest {
  nodeTemplate: string; // StandaloneNode ID
  position: {
    x: number;
    y: number;
  };
  data?: {
    // Only node-specific configuration data, no redundant fields
    formValues?: Record<string, unknown>;
    customSettings?: Record<string, unknown>;
  };
}

export interface TWorkflowConnectionCreateRequest {
  source: string; // Source node ID
  target: string; // Target node ID
}

export interface TWorkflowNodePositionUpdateRequest {
  nodeId: string;
  position: {
    x: number;
    y: number;
  };
}
