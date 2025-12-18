// Backend API response types (as they come from the server)
// These interfaces represent the exact structure returned by the Django backend

// Port configuration for node inputs/outputs
export interface NodePort {
  id: string;
  label: string;
}

// Simplified node type structure matching core/views node metadata
export interface BackendNodeType {
  identifier: string;
  name: string;
  type: string;
  label?: string;
  description?: string;
  has_form?: boolean;
  category?: string;
  input_ports?: NodePort[];
  output_ports?: NodePort[];
}

export interface TFormConfiguration {
  title: string;
  description?: string;
  elements: Record<string, unknown>[];
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
  input_data?: Record<string, unknown>;   // Last execution input
  output_data?: Record<string, unknown>;  // Last execution output
  node_type: BackendNodeType;
}

// Response from execute_and_save_node endpoint
export interface WorkflowNodeExecuteResponse {
  success: boolean;
  node_id: string;
  node_type: string;
  input_data?: Record<string, unknown>;
  form_values?: Record<string, unknown>;
  output?: unknown;
  error?: string;
  error_type?: string;
}

// Represents a Connection between nodes in a workflow
export interface BackendWorkflowConnection {
  id: string;
  source_node: string;
  target_node: string;
  source_handle?: string; // The specific output handle (e.g., 'yes', 'no' for conditional nodes)
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
