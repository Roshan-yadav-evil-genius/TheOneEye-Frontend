/**
 * Node type definitions
 * Types for node metadata from the backend API
 */

/**
 * Node metadata returned from the API (flat list)
 */
export interface TNodeMetadata {
  name: string;
  identifier: string;
  type: string;
  label?: string;
  description?: string;
  has_form: boolean;
  form_class?: string;
  file_path?: string;
  category?: string;
  icon?: string;  // Auto-discovered icon path (e.g., "Store/icon.png")
  supported_workflow_types?: string[];  // List of workflow types this node supports
}

/**
 * Node folder structure for hierarchical tree
 */
export interface TNodeFolder {
  nodes: TNodeMetadata[];
  subfolders: Record<string, TNodeFolder>;
}

/**
 * Node tree response from GET /api/nodes/
 */
export type TNodeTree = Record<string, TNodeFolder>;

/**
 * Node count response
 */
export interface TNodeCount {
  count: number;
}

/**
 * Widget information for a form field
 * Contains rendering hints and choices for select fields
 */
export interface TWidgetInfo {
  input_type: string | null;
  attrs?: Record<string, unknown>;
  choices?: Array<[string, string]>;  // [value, label] tuples
  _choices?: Array<[string, string]>; // Runtime choices (after loader)
  is_required?: boolean;
  [key: string]: unknown;
}

/**
 * Node form field from Form Schema Builder
 * Matches the output structure from core/Node/Core/Form/Core/SchemaBuilder.py
 */
export interface TNodeFormField {
  name: string;
  label: string;
  help_text: string | null;
  disabled: boolean;
  initial: unknown;
  value: unknown;
  dependencies: string[];  // List of parent field names this field depends on
  dependency_status: Record<string, boolean>;  // Status of each dependency
  ready: boolean;  // Whether all dependencies are satisfied
  widget: TWidgetInfo;
  field_level_errors: string[];  // Validation errors for this field
}

/**
 * Form data structure with fields and dependencies
 */
export interface TNodeFormData {
  form_name: string;
  fields: TNodeFormField[];
  field_order: string[];
  dependencies_graph: Record<string, string[]>;  // child -> [parents] mapping
  form_level_errors: string[];  // Non-field validation errors
}

/**
 * Node form response
 */
export interface TNodeForm {
  node: TNodeMetadata;
  form: TNodeFormData | null;
  message?: string;
}

/**
 * Field options request for dependent fields
 */
export interface TFieldOptionsRequest {
  parent_field: string;
  parent_value: string;
  dependent_field: string;
  form_values?: Record<string, string>;  // All current form values for multi-parent access
}

/**
 * Field options response
 */
export interface TFieldOptionsResponse {
  field: string;
  options: Array<{ value: string; text: string }>;
}

/**
 * Form update request
 */
export interface TFormUpdateRequest {
  field_values: Record<string, unknown>;
}

/**
 * Node execute request
 */
export interface TNodeExecuteRequest {
  input_data: Record<string, unknown>;
  form_data: Record<string, unknown>;
  session_id: string;  // Required for stateful execution
}

/**
 * Node execute response
 */
export interface TNodeExecuteResponse {
  success: boolean;
  node?: {
    name: string;
    identifier: string;
  };
  input?: Record<string, unknown>;
  form_data?: Record<string, unknown>;
  session_id?: string;
  output?: unknown;
  error?: string;
  error_type?: string;
  details?: string;
  message?: string;
  form?: TNodeFormData;
}

/**
 * Node reset session request
 */
export interface TNodeResetSessionRequest {
  session_id: string;
}

/**
 * Node reset session response
 */
export interface TNodeResetSessionResponse {
  success: boolean;
  session_id: string;
  cleared: boolean;
}
