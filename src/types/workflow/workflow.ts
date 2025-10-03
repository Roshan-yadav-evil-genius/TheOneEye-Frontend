// Workflow-specific types
export interface TWorkflowNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: Record<string, any>;
}

export interface TWorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface TWorkflowCanvas {
  nodes: TWorkflowNode[];
  edges: TWorkflowEdge[];
}
