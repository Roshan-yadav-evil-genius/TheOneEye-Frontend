import { BackendNodeType, BackendNodeGroup } from './backend';

// API Request Types
// For CREATE: omit auto-generated fields, allow logo as File
export type TNodeCreateData = Omit<BackendNodeType, 'id' | 'created_at' | 'updated_at' | 'logo'> & {
  logo?: File;  // Allow File upload
  node_group: string | BackendNodeGroup;  // Allow ID string or full object
};

// For UPDATE: all fields optional, allow logo as File
export type TNodeUpdateData = Partial<Omit<BackendNodeType, 'id' | 'created_at' | 'updated_at' | 'logo'>> & {
  logo?: File;
  node_group?: string | BackendNodeGroup;
};

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
  form_values?: Record<string, unknown>;
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
