// Core entity types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
}

export interface Node {
  id: string;
  name: string;
  type: 'trigger' | 'action' | 'logic' | 'system';
  category: string;
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

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  connections: WorkflowConnection[];
  status: 'draft' | 'active' | 'paused' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface WorkflowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Project {
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

export interface FormConfiguration {
  id: string;
  name: string;
  description: string;
  json: Record<string, any>;
  nodeId?: string;
  createdAt: Date;
  updatedAt: Date;
}
