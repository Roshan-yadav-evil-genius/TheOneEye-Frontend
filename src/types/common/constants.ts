// Common constants and type definitions
export const nodeTypes = ['trigger', 'action', 'logic', 'system'] as const;

export type TNodeTypeEnum = typeof nodeTypes[number];
