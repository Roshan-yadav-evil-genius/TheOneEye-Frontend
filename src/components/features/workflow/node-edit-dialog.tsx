"use client";

import { useState, useCallback } from "react";
import { DndContext, DragOverlay, DragStartEvent, pointerWithin } from "@dnd-kit/core";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { InputSection } from "./input-section";
import { OutputSection } from "./output-section";
import { NodeEditor } from "./node-editor";
import { ResizablePanels } from "@/components/ui/resizable-panel";
import { BackendWorkflowNode } from "@/types";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface NodeEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: BackendWorkflowNode;
  workflowId: string;
}

export function NodeEditDialog({
  isOpen,
  onOpenChange,
  data,
  workflowId,
}: NodeEditDialogProps) {
  // Tab state management
  const [activeInputTab, setActiveInputTab] = useState<"schema" | "json">("schema");
  const [activeOutputTab, setActiveOutputTab] = useState<"schema" | "json">("schema");
  const [activeNodeTab, setActiveNodeTab] = useState<"parameters" | "form">("parameters");

  // Placeholder data - execution functionality removed
  const inputData: Record<string, unknown> = {};
  const outputData: Record<string, unknown> = {};
  const isLoading = false;
  const error: string | null = null;

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

  const handleRefresh = () => {
    // Refresh functionality removed
  };

  const handleTestStep = async () => {
    // Execution functionality removed
  };

  const handlePauseStep = () => {
    // Pause functionality removed
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
            <DialogTitle>Edit Node: {data.node_type?.name} (ID: {data.id})</DialogTitle>
          </VisuallyHidden>
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header with refresh button */}
            <div className="flex items-center justify-between px-5 pr-10 py-2 border-b border-gray-700 bg-gray-800 flex-shrink-0">
              <h2 className="text-sm font-semibold text-gray-300">
                {data.node_type?.name}
              </h2>
              <Button
                onClick={handleRefresh}
                disabled={isLoading}
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <ResizablePanels
              defaultSizes={[33.33, 33.33, 33.34]}
              minSizes={[20, 25, 20]}
              maxSizes={[60, 60, 60]}
              className="flex-1 overflow-hidden"
            >
              {/* INPUT Column */}
              <InputSection
                activeInputTab={activeInputTab}
                onInputTabChange={(value) => setActiveInputTab(value as "schema" | "json")}
                jsonData={inputData}
                isLoading={isLoading}
                error={error}
              />

              {/* Node Editor Column */}
              <div className="h-full overflow-hidden">
                <NodeEditor
                  activeTab={activeNodeTab}
                  data={data}
                  onTabChange={(value) => setActiveNodeTab(value as "parameters" | "form")}
                  onTestStep={handleTestStep}
                  onPauseStep={handlePauseStep}
                  isExecuting={false}
                  isPolling={false}
                />
              </div>

              {/* OUTPUT Column */}
              <div className="p-5">
                <OutputSection
                  activeOutputTab={activeOutputTab}
                  onOutputTabChange={(value) => setActiveOutputTab(value as "schema" | "json")}
                  jsonData={outputData}
                  isLoading={isLoading}
                  error={error}
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
