"use client";

import { useState, useCallback, useEffect } from "react";
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
import { useNodeTestDataStore } from "@/stores/node-test-data-store";
import { getBadgeStyles } from "@/constants/node-styles";

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

  // Get persisted test data from store
  const { 
    getInputData, setInputData: persistInputData,
    getFormData, setFormData: persistFormData,
  } = useNodeTestDataStore();

  // Input JSON state - initialize from persisted store
  const [inputData, setInputData] = useState<Record<string, unknown>>(() => 
    getInputData(node.identifier)
  );

  // Form values state - initialize from persisted store
  const [persistedFormValues, setPersistedFormValues] = useState<Record<string, string>>(() =>
    getFormData(node.identifier)
  );

  // Output state - not persisted
  const [outputData, setOutputData] = useState<TNodeExecuteResponse | null>(null);

  // Load persisted data when dialog opens or node changes
  useEffect(() => {
    if (isOpen) {
      setInputData(getInputData(node.identifier));
      setPersistedFormValues(getFormData(node.identifier));
    }
  }, [isOpen, node.identifier, getInputData, getFormData]);

  // Persist input data whenever it changes
  const handleInputDataChange = useCallback((data: Record<string, unknown>) => {
    setInputData(data);
    persistInputData(node.identifier, data);
  }, [node.identifier, persistInputData]);

  // Persist form data whenever it changes
  const handleFormValuesChange = useCallback((data: Record<string, string>) => {
    setPersistedFormValues(data);
    persistFormData(node.identifier, data);
  }, [node.identifier, persistFormData]);
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

  // Helper to extract output data for display
  const getOutputDisplayData = useCallback((): Record<string, unknown> | unknown[] | string | null => {
    if (!outputData) {
      return { message: "Execute node to see output" };
    }
    if (outputData.error) {
      return { error: outputData.error, error_type: outputData.error_type };
    }
    // Safely extract data from output
    const output = outputData.output;
    if (output && typeof output === 'object' && 'data' in output) {
      const data = (output as { data: unknown }).data;
      if (data && typeof data === 'object') {
        return data as Record<string, unknown>;
      }
      if (typeof data === 'string') {
        return data;
      }
      return { result: data };
    }
    if (output && typeof output === 'object') {
      return output as Record<string, unknown>;
    }
    return { message: "No data in output" };
  }, [outputData]);

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
    const styles = getBadgeStyles(type);
    return `${styles.bg} ${styles.text}`;
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
                  onJsonChange={handleInputDataChange}
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
                    initialFormValues={persistedFormValues}
                    onFormValuesChange={handleFormValuesChange}
                  />
                </div>
              </div>

              {/* OUTPUT Panel */}
              <div className="h-full flex flex-col overflow-hidden">
                <JsonViewer
                  title="OUTPUT"
                  statusColor={outputData?.success ? "bg-green-500" : outputData?.error ? "bg-red-500" : "bg-yellow-500"}
                  jsonData={getOutputDisplayData()}
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

