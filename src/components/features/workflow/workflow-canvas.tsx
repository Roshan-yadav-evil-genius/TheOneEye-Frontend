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

import { useWorkflowState } from "@/hooks/useWorkflowState";
import { useWorkflowDragDrop } from "@/hooks/useWorkflowDragDrop";
import { nodeTypes } from "./nodeTypes";
import DragOverlay from "./DragOverlay";

interface WorkflowCanvasProps {
  workflowId: string;
  selectedNodes: string[];
  searchTerm: string;
  filters: {
    nodeGroup: string;
  };
  lineType: string;
  showMinimap: boolean;
}

export function WorkflowCanvas({ workflowId, selectedNodes, searchTerm, filters, lineType, showMinimap }: WorkflowCanvasProps) {
  const {
    nodes,
    edges,
    isDragOver,
    setIsDragOver,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDragStop,
    addNodeFromDrag,
    isLoading,
    isSaving,
    error,
  } = useWorkflowState({ workflowId, lineType, selectedNodes, searchTerm, filters });

  const {
    reactFlowWrapper,
    reactFlowInstance,
    setReactFlowInstance,
    onDragOver,
    onDragLeave,
    onDrop,
  } = useWorkflowDragDrop({ addNodeFromDrag, setIsDragOver });

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading workflow...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-destructive mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Failed to load workflow</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative" ref={reactFlowWrapper}>
      {/* Saving indicator */}
      {isSaving && (
        <div className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm border rounded-lg px-3 py-2 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span className="text-sm text-muted-foreground">Saving...</span>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
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
              switch (node.data?.backendWorkflowNode?.node_type?.type) {
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
