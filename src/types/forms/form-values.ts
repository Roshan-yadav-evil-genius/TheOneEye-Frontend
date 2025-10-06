// Form value types for node form values
export type FormValue = 
  | string 
  | number 
  | boolean 
  | string[] 
  | number[] 
  | Record<string, unknown>
  | null
  | undefined;

export interface FormValues {
  [fieldName: string]: FormValue;
}

export interface FormValuesResponse {
  form_values: FormValues;
  last_updated: string;
  user_id: string;
  workflow_id: string;
  node_id: string;
}

export interface FormValuesSaveRequest {
  user_id: string;
  form_values: FormValues;
}

export interface FormValuesApi {
  getFormValues(workflowId: string, nodeId: string, userId: string): Promise<FormValuesResponse>;
  saveFormValues(workflowId: string, nodeId: string, data: FormValuesSaveRequest): Promise<FormValuesResponse>;
  clearFormValues(workflowId: string, nodeId: string, userId: string): Promise<void>;
}
