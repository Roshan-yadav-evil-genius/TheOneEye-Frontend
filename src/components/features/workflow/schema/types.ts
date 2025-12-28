/**
 * Represents a field in a JSON schema tree structure
 */
export interface SchemaField {
  /** The key/name of the field */
  key: string;
  /** The type of the field value */
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  /** The actual value (for primitive types) */
  value?: unknown;
  /** Child fields (for objects and arrays) */
  children?: SchemaField[];
  /** The path to this field in the JSON structure (e.g., "user.address.city") */
  path: string;
}

/**
 * Props for schema field components
 */
export interface SchemaFieldProps {
  field: SchemaField;
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
  wordWrap?: boolean;
  enableDrag?: boolean;
}

/**
 * Props for schema tree components
 */
export interface SchemaTreeProps {
  jsonData: unknown;
  title: string;
  wordWrap?: boolean;
  enableDrag?: boolean;
}






