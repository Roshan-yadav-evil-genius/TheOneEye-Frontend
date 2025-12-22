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
  last_run?: string;  // ✅ Match backend
  next_run?: string;  // ✅ Match backend
  runs_count: number;  // ✅ Match backend
  tags: string[];
  created_by?: string;  // ✅ Match backend
  created_at: string;  // ✅ Match backend
  updated_at: string;  // ✅ Match backend
  task_id?: string;  // ✅ Match backend
}

export interface TWorkflowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string; // The specific output handle (e.g., 'yes', 'no' for conditional nodes)
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
