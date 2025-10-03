// Common constants and type definitions
export const nodeTypes = ['trigger', 'action', 'logic', 'system'] as const;
export const nodeCategories = [
  'system',
  'email', 
  'database',
  'api',
  'logic',
  'control',
  'file'
] as const;

export type NodeType = typeof nodeTypes[number];
export type NodeCategory = typeof nodeCategories[number];
