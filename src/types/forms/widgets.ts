// Form widget types
export interface TWidgetConfig {
  id: string;
  type: TWidgetType;
  name: string;
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

export type TWidgetType = 
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

export interface TWidgetDefinition {
  type: TWidgetType;
  label: string;
  icon: string;
  description: string;
  defaultConfig: Partial<TWidgetConfig>;
}
