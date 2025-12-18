"use client";

import { useState, useCallback } from "react";
import { DndContext, DragOverlay, DragStartEvent, pointerWithin } from "@dnd-kit/core";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { ResizablePanels } from "@/components/ui/resizable-panel";
import { JsonViewer } from "@/components/features/workflow/json-viewer";
import { NodeFormEditor } from "./node-form-editor";
import { ApiService } from "@/lib/api/api-service";
import { TNodeMetadata, TNodeExecuteResponse } from "@/types";
import { Badge } from "@/components/ui/badge";

interface NodeExecuteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  node: TNodeMetadata;
}

export function NodeExecuteDialog({
  isOpen,
  onOpenChange,
  node,
}: NodeExecuteDialogProps) {
  // Tab state
  const [activeInputTab, setActiveInputTab] = useState<"schema" | "json">("schema");
  const [activeOutputTab, setActiveOutputTab] = useState<"schema" | "json">("schema");

  // Input JSON state
  const [inputData, setInputData] = useState<Record<string, unknown>>({});

  // Output state
  const [outputData, setOutputData] = useState<TNodeExecuteResponse | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Drag state for overlay
  const [activeDragKey, setActiveDragKey] = useState<string | null>(null);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'field') {
      setActiveDragKey(active.data.current.key);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    setActiveDragKey(null);
  }, []);

  // Execute node
  const handleExecute = useCallback(
    async (formData: Record<string, string>) => {
      setIsExecuting(true);
      setOutputData(null);

      try {
        const result = await ApiService.executeNode(node.identifier, {
          input_data: inputData,
          form_data: formData,
        });
        setOutputData(result);
        // Switch to output tab to show result
        setActiveOutputTab("schema");
      } catch (error) {
        console.error("Node execution failed:", error);
        setOutputData({
          success: false,
          error: error instanceof Error ? error.message : "Execution failed",
          error_type: "ExecutionError",
        });
      } finally {
        setIsExecuting(false);
      }
    },
    [node.identifier, inputData]
  );

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "ProducerNode":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "NonBlockingNode":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
      case "BlockingNode":
        return "bg-pink-500/20 text-pink-400 border-pink-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <DndContext 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
    >
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="!max-w-[95vw] h-[90vh] bg-gray-900 border-gray-700 !p-0">
          <VisuallyHidden>
            <DialogTitle>Execute Node: {node.name}</DialogTitle>
          </VisuallyHidden>

          <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pr-10 py-3 border-b border-gray-700 bg-gray-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <Badge className={getTypeBadgeColor(node.type)}>
                  {node.type}
                </Badge>
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    {node.label || node.name}
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">
                    {node.identifier}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content - 3 Panels */}
            <ResizablePanels
              defaultSizes={[30, 40, 30]}
              minSizes={[20, 25, 20]}
              maxSizes={[50, 60, 50]}
              className="flex-1 overflow-hidden"
            >
              {/* INPUT Panel */}
              <div className="h-full flex flex-col overflow-hidden border-r border-gray-700">
                <JsonViewer
                  title="INPUT"
                  statusColor="bg-blue-500"
                  jsonData={inputData}
                  activeTab={activeInputTab}
                  onTabChange={setActiveInputTab}
                  enableDragDrop={true}
                  editable={true}
                  onJsonChange={setInputData}
                />
              </div>

              {/* FORM Panel */}
              <div className="h-full flex flex-col overflow-hidden border-r border-gray-700 bg-gray-900">
                <div className="flex items-center gap-2 p-2 border-b border-gray-700 bg-gray-800 flex-shrink-0">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <h3 className="text-white font-medium text-sm">FORM</h3>
                </div>
                <div className="flex-1 overflow-hidden">
                  <NodeFormEditor
                    node={node}
                    onExecute={handleExecute}
                    isExecuting={isExecuting}
                  />
                </div>
              </div>

              {/* OUTPUT Panel */}
              <div className="h-full flex flex-col overflow-hidden">
                <JsonViewer
                  title="OUTPUT"
                  statusColor={outputData?.success ? "bg-green-500" : outputData?.error ? "bg-red-500" : "bg-yellow-500"}
                  jsonData={outputData || { message: "Execute node to see output" }}
                  activeTab={activeOutputTab}
                  onTabChange={setActiveOutputTab}
                  enableDragDrop={false}
                  isLoading={isExecuting}
                />
              </div>
            </ResizablePanels>
          </div>
        </DialogContent>
      </Dialog>

      {/* DragOverlay outside Dialog - not affected by dialog's CSS transforms */}
      <DragOverlay dropAnimation={null} style={{ width: 'auto', height: 'auto' }}>
        {activeDragKey ? (
          <div className="inline-flex px-3 py-1.5 rounded text-sm font-mono bg-blue-600 text-white border border-blue-400 shadow-xl cursor-grabbing whitespace-nowrap w-auto">
            {activeDragKey}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

