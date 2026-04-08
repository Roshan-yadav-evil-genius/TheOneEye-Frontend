"use client";

import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  ConnectionLineType,
  type OnSelectionChangeFunc,
} from "reactflow";
import { SelectionMode } from "@reactflow/core";
import "reactflow/dist/style.css";
import "./workflow-canvas.css";

import { useWorkflowState, mapLineTypeToWorkflowEdgeType } from "@/hooks/useWorkflowState";
import { useWorkflowDragDrop } from "@/hooks/useWorkflowDragDrop";
import { nodeTypes } from "./nodeTypes";
import { workflowEdgeTypes } from "./workflow-edge";
import DragOverlay from "./DragOverlay";
import { useWorkflowCanvasStore } from "@/stores/workflow/workflow-canvas-store";
import { useWorkflowClipboardStore } from "@/stores/workflow/workflow-clipboard-store";
import { toastService } from "@/lib/services/toast-service";

function isEditableDocumentTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return Boolean(target.closest('[role="textbox"]'));
}

const FLOW_COLORS = {
  connection: "var(--primary)",
  running: "var(--success)",
  trigger: "var(--node-blocking)",
  action: "var(--node-non-blocking)",
  logic: "var(--node-producer)",
  fallback: "var(--muted-foreground)",
};

interface WorkflowCanvasProps {
  workflowId: string;
  searchTerm: string;
  filters: {
    nodeGroup: string;
  };
  lineType: string;
  showMinimap: boolean;
  isRunning: boolean;
  locateRequest?: { nodeId: string; requestId: number } | null;
  onLocateResult?: (status: "found" | "not_found") => void;
}

export function WorkflowCanvas({
  workflowId,
  searchTerm,
  filters,
  lineType,
  showMinimap,
  isRunning,
  locateRequest,
  onLocateResult,
}: WorkflowCanvasProps) {
  const [blinkingNodeId, setBlinkingNodeId] = React.useState<string | null>(null);
  const clearBlinkTimeoutRef = React.useRef<number | null>(null);
  const lastProcessedLocateRequestIdRef = React.useRef<number | null>(null);

  const {
    nodes,
    edges,
    isDragOver,
    setIsDragOver,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDragStop,
    onSelectionDragStop,
    addNodeFromDrag,
    applyCanvasSelection,
    isLoading,
    isSaving,
    error,
  } = useWorkflowState({
    workflowId,
    lineType,
    searchTerm,
    filters,
    isRunning,
    blinkingNodeId,
  });

  // Get workflow type from canvas store for node compatibility
  const workflow = useWorkflowCanvasStore((state) => state.workflow);
  const workflowType = workflow?.workflow_type;

  const {
    reactFlowWrapper,
    reactFlowInstance,
    setReactFlowInstance,
    onDragOver,
    onDragLeave,
    onDrop,
  } = useWorkflowDragDrop({ addNodeFromDrag, setIsDragOver, workflowType });

  useEffect(() => {
    useWorkflowClipboardStore.getState().resetForWorkflowChange();
  }, [workflowId]);

  const onSelectionChange = useCallback<OnSelectionChangeFunc>(
    ({ nodes: selectedFlowNodes, edges: selectedFlowEdges }) => {
      if (isRunning) return;
      useWorkflowClipboardStore.getState().setCanvasSelection(
        selectedFlowNodes.map((n) => n.id),
        selectedFlowEdges.map((e) => e.id)
      );
    },
    [isRunning]
  );

  useEffect(() => {
    if (isRunning || isLoading || error) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      if (isEditableDocumentTarget(event.target)) return;

      const key = event.key.toLowerCase();
      if (key === "c") {
        event.preventDefault();
        void (async () => {
          const { selectedNodeIds, copySelection } = useWorkflowClipboardStore.getState();
          if (selectedNodeIds.length === 0) {
            toastService.info("Nothing selected", {
              description: "Select one or more nodes to copy.",
            });
            return;
          }
          const ok = await copySelection();
          const clip = useWorkflowClipboardStore.getState().clipboard;
          if (ok && clip) {
            toastService.success("Copied", {
              description: `${clip.nodes.length} node(s), ${clip.edges.length} internal connection(s).`,
            });
          }
        })();
        return;
      }

      if (key === "v") {
        event.preventDefault();
        void (async () => {
          const { pasteClipboard, setCanvasSelection } = useWorkflowClipboardStore.getState();
          const { newNodeIds, newEdgeIds } = await pasteClipboard();
          if (newNodeIds.length === 0) {
            toastService.info("Nothing to paste", {
              description: "Copy a selection first (Ctrl+C).",
            });
            return;
          }
          setCanvasSelection(newNodeIds, newEdgeIds);
          // Defer until useWorkflowState has synced new nodes from the canvas store (avoids racing setNodes).
          window.setTimeout(() => {
            applyCanvasSelection(newNodeIds, newEdgeIds);
          }, 0);
          toastService.success("Pasted", {
            description: `${newNodeIds.length} node(s)${newEdgeIds.length ? `, ${newEdgeIds.length} connection(s)` : ""}.`,
          });
        })();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isRunning, isLoading, error, applyCanvasSelection]);

  useEffect(() => {
    return () => {
      if (clearBlinkTimeoutRef.current !== null) {
        window.clearTimeout(clearBlinkTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!locateRequest || !reactFlowInstance) {
      return;
    }
    if (lastProcessedLocateRequestIdRef.current === locateRequest.requestId) {
      return;
    }
    lastProcessedLocateRequestIdRef.current = locateRequest.requestId;

    const nodeId = locateRequest.nodeId.trim();
    if (!nodeId) {
      onLocateResult?.("not_found");
      return;
    }

    const targetNode = nodes.find((node) => node.id === nodeId);
    if (!targetNode) {
      onLocateResult?.("not_found");
      return;
    }

    const nodeCenterX = targetNode.position.x + 64;
    const nodeCenterY = targetNode.position.y + 48;
    reactFlowInstance.setCenter(nodeCenterX, nodeCenterY, { zoom: 1.2, duration: 350 });
    setBlinkingNodeId(targetNode.id);
    onLocateResult?.("found");

    if (clearBlinkTimeoutRef.current !== null) {
      window.clearTimeout(clearBlinkTimeoutRef.current);
    }
    clearBlinkTimeoutRef.current = window.setTimeout(() => {
      setBlinkingNodeId(null);
    }, 1000);
  }, [locateRequest, nodes, onLocateResult, reactFlowInstance, workflowId]);

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
    <div className="workflow-canvas h-full w-full relative" ref={reactFlowWrapper}>
      {/* Saving indicator */}
      {isSaving && (
        <div className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm border rounded-lg px-3 py-2 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span className="text-sm text-muted-foreground">Saving...</span>
        </div>
      )}

      {/* Execution mode indicator */}
      {isRunning && (
        <div className="absolute top-4 left-1/2 z-10 flex -translate-x-1/2 transform items-center gap-2 rounded-lg border border-success/50 bg-success/20 px-4 py-2 shadow-lg backdrop-blur-sm">
          <div className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-success"></span>
          </div>
          <span className="text-sm font-medium text-foreground">Workflow Running</span>
          <span className="text-xs text-muted-foreground">Editing disabled</span>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={isRunning ? undefined : onNodesChange}
        onEdgesChange={isRunning ? undefined : onEdgesChange}
        onConnect={isRunning ? undefined : onConnect}
        onNodeDragStop={isRunning ? undefined : onNodeDragStop}
        onSelectionDragStop={isRunning ? undefined : onSelectionDragStop}
        onInit={setReactFlowInstance}
        onDrop={isRunning ? undefined : onDrop}
        onDragOver={isRunning ? undefined : onDragOver}
        onDragLeave={isRunning ? undefined : onDragLeave}
        onSelectionChange={isRunning ? undefined : onSelectionChange}
        nodeTypes={nodeTypes}
        edgeTypes={workflowEdgeTypes}
        fitView
        className="bg-background"
        connectionLineStyle={{ stroke: FLOW_COLORS.connection, strokeWidth: 2 }}
        connectionLineType={lineType === 'straight' ? ConnectionLineType.Straight : 
                           lineType === 'step' ? ConnectionLineType.Step :
                           lineType === 'smoothstep' ? ConnectionLineType.SmoothStep :
                           ConnectionLineType.Bezier}
        defaultEdgeOptions={{
          animated: isRunning,
          style: {
            stroke: isRunning ? FLOW_COLORS.running : FLOW_COLORS.connection,
            strokeWidth: 2,
          },
          type: mapLineTypeToWorkflowEdgeType(lineType),
        }}
        nodesDraggable={!isRunning}
        nodesConnectable={!isRunning}
        elementsSelectable={!isRunning}
        deleteKeyCode={isRunning ? null : 'Delete'}
        selectionOnDrag={!isRunning}
        selectionMode={SelectionMode.Partial}
        panOnDrag={isRunning ? true : [1, 2]}
        selectNodesOnDrag={false}
        elevateEdgesOnSelect
        nodeDragThreshold={6}
        elevateNodesOnSelect={false}
      >
        <Controls />
        {showMinimap && (
          <MiniMap 
            nodeColor={(node) => {
              switch (node.data?.backendWorkflowNode?.node_type?.type) {
                case "trigger": return FLOW_COLORS.trigger;
                case "action": return FLOW_COLORS.action;
                case "logic": return FLOW_COLORS.logic;
                default: return FLOW_COLORS.fallback;
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
