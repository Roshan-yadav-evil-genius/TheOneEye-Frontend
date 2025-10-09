// Backend API response types (as they come from the server)
// These interfaces represent the exact structure returned by the Django backend

// Shared interface for node type structure (used in both BackendNode and BackendWorkflowNode.node_type)
// This represents a StandaloneNode from the backend
export interface BackendNodeType {
  id: string;
  name: string;
  type: string;
  node_group: BackendNodeGroup;
  description?: string;
  version?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  form_configuration?: Record<string, unknown>;  // More flexible - backend can return any JSON structure
  tags?: string[];
  logo?: string;
}



export interface TFormConfiguration {
  title: string;
  description?: string;
  elements: Record<string, unknown>[];
}

// Represents NodeGroup from the backend
export interface BackendNodeGroup {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Response from /workflow/{id}/canvas_data/ endpoint
export interface BackendWorkflowCanvasResponse {
  nodes: BackendWorkflowNode[];
  edges: BackendWorkflowConnection[];
  workflow: {
    id: string;
    name: string;
    description: string;
    status: string;
  };
}

// Represents a Node instance within a workflow (from canvas_data response)
export interface BackendWorkflowNode {
  id: string;
  position: {
    x: number;
    y: number;
  };
  form_values?: Record<string, unknown>;
  node_type: BackendNodeType;
}

// Represents a Connection between nodes in a workflow
export interface BackendWorkflowConnection {
  id: string;
  source_node: string;
  target_node: string;
}



export interface BackendUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
}

export interface BackendAuthResponse {
  user: BackendUser;
  token: string;
  refresh_token?: string;
}
