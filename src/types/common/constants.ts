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

export type TNodeTypeEnum = typeof nodeTypes[number];
export type TNodeCategoryEnum = typeof nodeCategories[number];
