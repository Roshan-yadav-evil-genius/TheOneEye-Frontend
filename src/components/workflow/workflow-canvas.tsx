"use client";

import { useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";

import { CustomNode } from "./custom-node";

interface WorkflowCanvasProps {
  selectedNodes: string[];
  searchTerm: string;
  filters: {
    category: string;
    status: string;
  };
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// Initial nodes and edges for the workflow
const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 100, y: 100 },
    data: { 
      label: "Start", 
      type: "trigger",
      status: "active",
      category: "system"
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
      category: "communication"
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
      category: "data"
    },
  },
  {
    id: "4",
    type: "custom",
    position: { x: 300, y: 250 },
    data: { 
      label: "Condition", 
      type: "logic",
      status: "active",
      category: "control"
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
      category: "system"
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
  },
];

export function WorkflowCanvas({ selectedNodes, searchTerm, filters }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Filter nodes based on search and filters
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchesSearch = node.data.label.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filters.category === "all" || node.data.category === filters.category;
      const matchesStatus = filters.status === "all" || node.data.status === filters.status;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [nodes, searchTerm, filters]);

  // Update node selection
  const updatedNodes = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      selected: selectedNodes.includes(node.id),
    }));
  }, [nodes, selectedNodes]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={updatedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
      >
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            switch (node.data?.type) {
              case "trigger": return "#3b82f6";
              case "action": return "#10b981";
              case "logic": return "#8b5cf6";
              default: return "#6b7280";
            }
          }}
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
