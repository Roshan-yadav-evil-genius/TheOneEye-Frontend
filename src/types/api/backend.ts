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
  icon?: string;  // Auto-discovered icon path (e.g., "Store/icon.png")
  input_ports?: NodePort[];
  output_ports?: NodePort[];
  supported_workflow_types?: string[];  // List of workflow types this node supports
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
    workflow_type?: string;  // Workflow execution mode ('production' | 'api')
    runs_count: number;
    last_run?: string | null;
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

import { TNodeFormData } from '../node';

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
  message?: string;
  form?: TNodeFormData;
}

// ForEach block: input array, collected results, and current iteration state
export interface ForEachNodeState {
  input: unknown[];
  results: unknown[];
  state: { index: number; item: unknown };
}

// Legacy shape (index/current_item at top level) for backward compatibility
export interface ForEachNodeStateLegacy {
  input: unknown[];
  index?: number;
  current_item?: unknown;
}

// Response from execute_for_each_iteration endpoint
export interface ExecuteForEachIterationResponse {
  success: boolean;
  node_id: string;
  forEachNode?: ForEachNodeState;
  iteration_output?: unknown[];
  output?: { data?: Record<string, unknown> };
  error?: string;
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
