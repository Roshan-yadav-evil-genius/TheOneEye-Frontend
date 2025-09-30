"use client";

import { useCallback, useMemo, useRef, useState, useEffect, memo } from "react";
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
  ReactFlowInstance,
  ConnectionLineType,
} from "reactflow";
import "reactflow/dist/style.css";

import { CustomNode } from "./custom-node";

interface WorkflowCanvasProps {
  selectedNodes: string[];
  searchTerm: string;
  filters: {
    category: string;
  };
  lineType: string;
  showMinimap: boolean;
}

const nodeTypes: NodeTypes = {
  custom: memo(CustomNode),
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

const initialEdges: Edge[] = [
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

export function WorkflowCanvas({ selectedNodes, searchTerm, filters, lineType, showMinimap }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Update existing edges when lineType changes
  useEffect(() => {
    setEdges((currentEdges) =>
      currentEdges.map((edge) => ({
        ...edge,
        type: lineType,
      }))
    );
  }, [lineType, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      // Prevent self-connections
      if (params.source === params.target) {
        return;
      }
      
      // Check if connection already exists
      const connectionExists = edges.some(
        edge => edge.source === params.source && edge.target === params.target
      );
      
      if (connectionExists) {
        console.log('Connection already exists');
        return;
      }
      
      // Create a new edge with a unique ID
      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}-${Date.now()}`,
        animated: true,
        type: lineType,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, edges, lineType]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent) => {
    // Only set isDragOver to false if we're leaving the entire canvas area
    if (!reactFlowWrapper.current?.contains(event.relatedTarget as Element)) {
      setIsDragOver(false);
    }
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type || !reactFlowBounds || !reactFlowInstance) {
        return;
      }

      try {
        const nodeData = JSON.parse(type);
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const newNode: Node = {
          id: `${nodeData.id}-${Date.now()}`, // Ensure unique ID
          type: 'custom',
          position,
          data: {
            label: nodeData.name,
            type: nodeData.type,
            status: 'active',
            category: nodeData.category,
            description: nodeData.description,
          },
        };

        setNodes((nds) => nds.concat(newNode));
        setIsDragOver(false);
      } catch (error) {
        console.error('Error parsing dropped node data:', error);
        setIsDragOver(false);
      }
    },
    [reactFlowInstance, setNodes]
  );

  // Filter nodes based on search and filters
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchesSearch = node.data.label.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filters.category === "all" || node.data.category === filters.category;
      
      return matchesSearch && matchesCategory;
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
    <div className="h-full w-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={updatedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
        connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 2 }}
        connectionLineType={lineType === 'straight' ? ConnectionLineType.Straight : 
                           lineType === 'step' ? ConnectionLineType.Step :
                           lineType === 'smoothstep' ? ConnectionLineType.SmoothStep :
                           ConnectionLineType.Bezier}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          type: lineType,
        }}
      >
        <Controls />
        {showMinimap && (
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
        )}
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      
      {/* Drop overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center pointer-events-none z-10">
          <div className="bg-background/90 backdrop-blur-sm border border-primary/20 rounded-lg px-6 py-4 shadow-lg">
            <div className="flex items-center gap-3 text-primary">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="font-medium">Drop node here to add to workflow</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
