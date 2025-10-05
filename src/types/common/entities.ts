// Core entity types
export interface TUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
}

export interface TNodeGroup {
  id: string;
  name: string;
  description?: string;
  icon?: string; // URL to the node group icon image
  isActive: boolean;
  createdAt: string; // ISO string format from backend
  updatedAt: string; // ISO string format from backend
}

export interface TNode {
  id: string;
  name: string;
  type: 'trigger' | 'action' | 'logic' | 'system';
  category: string; // Keep temporarily for backward compatibility
  nodeGroup?: string; // NodeGroup ID
  nodeGroupName?: string; // NodeGroup name for display
  nodeGroupIcon?: string; // NodeGroup icon URL for display
  description: string;
  version: string;
  isActive: boolean;
  createdAt: string; // ISO string format from backend
  updatedAt: string; // ISO string format from backend
  createdBy: string; // Username of the creator
  formConfiguration: Record<string, unknown>; // Form configuration JSON
  tags: string[];
  logo?: string; // URL to the node logo image
}

export interface TWorkflow {
  id: string;
  name: string;
  description: string;
  category?: string;
  nodes: TNode[];
  connections: TWorkflowConnection[];
  status: 'active' | 'inactive' | 'error';
  lastRun?: string;
  nextRun?: string;
  runsCount: number;
  successRate: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface TWorkflowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface TProject {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  workflows: string[]; // Workflow IDs
  team: string[]; // User IDs
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface TFormConfiguration {
  id: string;
  name: string;
  description: string;
  json: Record<string, unknown>;
  nodeId?: string;
  createdAt: Date;
  updatedAt: Date;
}
