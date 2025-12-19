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
 * Node form field from FormSerializer
 * Matches the output structure from core/Node/Core/Form/Core/FormSerializer.py
 */
export interface TNodeFormField {
  tag: "input" | "select" | "textarea";
  name: string;
  label: string;
  type?: string;
  value?: unknown;
  options?: Array<{ value: string; text: string; selected?: boolean }>;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  errors?: string[];
}

/**
 * Form data structure with fields and dependencies
 */
export interface TNodeFormData {
  fields: TNodeFormField[];
  dependencies?: Record<string, string[]>;
  non_field_errors?: string[];
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
 * Node execute request
 */
export interface TNodeExecuteRequest {
  input_data: Record<string, unknown>;
  form_data: Record<string, unknown>;
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
  output?: unknown;
  error?: string;
  error_type?: string;
  details?: string;
}
