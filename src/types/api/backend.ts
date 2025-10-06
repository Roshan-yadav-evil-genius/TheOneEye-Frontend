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
  form_configuration?: Record<string, unknown>;
  tags?: string[];
  logo?: string;
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
  data: {
    // Only node-specific configuration data
    formValues?: Record<string, unknown>;
    customSettings?: Record<string, unknown>;
  };
  node_type?: BackendNodeType | null;
}

// Represents a Connection between nodes in a workflow
export interface BackendWorkflowConnection {
  id: string;
  source: string;
  target: string;
  created_at?: string; // Optional field that might be returned by backend
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
