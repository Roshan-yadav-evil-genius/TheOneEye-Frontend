import { Node, Edge } from "reactflow";

// Initial nodes and edges for the workflow
export const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 100, y: 100 },
    data: { 
      label: "Start", 
      type: "trigger",
      status: "active",
      category: "system",
      description: "Workflow entry point"
    },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 300, y: 100 },
    data: { 
      label: "Send Email", 
      type: "action",
      status: "active",
      category: "communication",
      description: "Send notification email"
    },
  },
  {
    id: "3",
    type: "custom",
    position: { x: 500, y: 100 },
    data: { 
      label: "Database Query", 
      type: "action",
      status: "active",
      category: "data",
      description: "Fetch user data"
    },
  },
  {
    id: "4",
    type: "custom",
    position: { x: 300, y: 250 },
    data: { 
      label: "Switch", 
      type: "logic",
      status: "active",
      category: "control",
      description: "Route based on condition"
    },
  },
  {
    id: "5",
    type: "custom",
    position: { x: 500, y: 250 },
    data: { 
      label: "End", 
      type: "trigger",
      status: "active",
      category: "system",
      description: "Workflow completion"
    },
  },
];

export const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "step",
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    type: "step",
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    type: "step",
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
    type: "step",
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  },
];
