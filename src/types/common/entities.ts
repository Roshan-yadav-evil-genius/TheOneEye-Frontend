import { BackendNodeType } from "../api";

// Core entity types
export type TNode = BackendNodeType;
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


// Node Template - Standalone node template data
export interface TNodeTemplate {
  id: string;
  name: string;
  type: string;
  description?: string;
  logo?: string;
  form_configuration: Record<string, unknown>;
  tags: string[];
}

// WorkflowNode - Instance of a node in a specific workflow
export interface TWorkflowNode {
  id: string;
  position: {
    x: number;
    y: number;
  };
  form_values?: Record<string, unknown>;
  node_type?: BackendNodeType | null; // Updated to use node_type instead of node_template
}

export interface TWorkflow {
  id: string;
  name: string;
  description: string;
  category?: string;
  nodes: TWorkflowNode[]; // Changed from TNode[] to TWorkflowNode[]
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
  source: string;
  target: string;
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
