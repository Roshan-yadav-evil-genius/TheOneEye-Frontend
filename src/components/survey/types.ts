// Form field types and interfaces for custom form system

export type FormFieldType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'tel' 
  | 'url'
  | 'comment' 
  | 'dropdown' 
  | 'checkbox' 
  | 'boolean' 
  | 'radio' 
  | 'file'
  | 'date'
  | 'time'
  | 'datetime';

export interface FormFieldChoice {
  value: string;
  text: string;
}

export interface FormField {
  type: FormFieldType;
  name: string;
  title: string;
  description?: string;
  placeholder?: string;
  isRequired?: boolean;
  defaultValue?: any;
  inputType?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  choices?: FormFieldChoice[];
  min?: number;
  max?: number;
  step?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  rows?: number; // for textarea/comment fields
  validation?: {
    message?: string;
    custom?: string; // custom validation expression
  };
  conditional?: {
    dependsOn: string;
    condition: string;
    value: any;
  };
}

export interface FormConfiguration {
  title?: string;
  description?: string;
  elements: FormField[];
  showProgressBar?: boolean;
  showQuestionNumbers?: boolean;
  completeText?: string;
  pageNextText?: string;
  pagePrevText?: string;
  startSurveyText?: string;
  // Additional metadata
  logo?: string;
  locale?: string;
  showTitle?: boolean;
  showDescription?: boolean;
}

export interface FormData {
  [key: string]: any;
}

export interface FormValidationError {
  field: string;
  message: string;
}

export interface FormState {
  data: FormData;
  errors: FormValidationError[];
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

export interface FormFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export interface CustomFormProps {
  configuration: FormConfiguration;
  initialData?: FormData;
  onDataChange?: (data: FormData) => void;
  onValidationChange?: (isValid: boolean, errors: FormValidationError[]) => void;
  onSubmit?: (data: FormData) => void;
  readOnly?: boolean;
  className?: string;
}

// Utility types for form field mapping
export type FieldComponentMap = {
  [K in FormFieldType]: React.ComponentType<FormFieldProps>;
};

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  errors: FormValidationError[];
}
