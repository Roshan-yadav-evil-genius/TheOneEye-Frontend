"use client";

import React from "react";
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  ConnectionLineType,
} from "reactflow";
import "reactflow/dist/style.css";

import { useWorkflowState } from "../../hooks/useWorkflowState";
import { useWorkflowDragDrop } from "../../hooks/useWorkflowDragDrop";
import { nodeTypes } from "./nodeTypes";
import DragOverlay from "./DragOverlay";

interface WorkflowCanvasProps {
  selectedNodes: string[];
  searchTerm: string;
  filters: {
    category: string;
  };
  lineType: string;
  showMinimap: boolean;
}

export function WorkflowCanvas({ selectedNodes, searchTerm, filters, lineType, showMinimap }: WorkflowCanvasProps) {
  const {
    nodes,
    edges,
    isDragOver,
    setIsDragOver,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNodeFromDrag,
  } = useWorkflowState({ lineType, selectedNodes, searchTerm, filters });

  const {
    reactFlowWrapper,
    reactFlowInstance,
    setReactFlowInstance,
    onDragOver,
    onDragLeave,
    onDrop,
  } = useWorkflowDragDrop({ addNodeFromDrag, setIsDragOver });

  return (
    <div className="h-full w-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
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
      
      <DragOverlay isVisible={isDragOver} />
    </div>
  );
}
