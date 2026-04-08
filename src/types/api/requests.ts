// API Request Types

export interface TNodeFilters {
  type?: string;
  search?: string;
  category?: string;
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
  /** Optional; used when duplicating nodes (canvas paste). */
  input_data?: Record<string, unknown>;
  output_data?: Record<string, unknown>;
  config?: Record<string, unknown>;
}

export interface TWorkflowConnectionCreateRequest {
  source: string; // Source node ID
  target: string; // Target node ID
  sourceHandle?: string; // The specific output handle (e.g., 'yes', 'no' for conditional nodes)
}

export interface TWorkflowNodePositionUpdateRequest {
  nodeId: string;
  position: {
    x: number;
    y: number;
  };
}
