// Form widget types
export interface WidgetConfig {
  id: string;
  type: WidgetType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export type WidgetType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'file';

export interface WidgetDefinition {
  type: WidgetType;
  label: string;
  icon: string;
  description: string;
  defaultConfig: Partial<WidgetConfig>;
}
