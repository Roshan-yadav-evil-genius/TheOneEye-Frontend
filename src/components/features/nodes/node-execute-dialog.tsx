"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useNodeTestDataStore } from "@/stores/node-test-data-store";
import { useWorkflowCanvasStore } from "@/stores";
import { getBadgeStyles } from "@/constants/node-styles";
import { workflowApi } from "@/lib/api/services/workflow-api";

// Generate a unique session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Workflow context for DB persistence
export interface WorkflowExecuteContext {
  workflowId: string;
  nodeInstanceId: string;
  savedFormValues?: Record<string, unknown>;
  savedInputData?: Record<string, unknown>;
  savedOutputData?: Record<string, unknown>;
  getConnectedNodeOutput?: () => Record<string, unknown> | null;
}

interface NodeExecuteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  node: TNodeMetadata;
  workflowContext?: WorkflowExecuteContext;
}

export function NodeExecuteDialog({
  isOpen,
  onOpenChange,
  node,
  workflowContext,
}: NodeExecuteDialogProps) {
  // Determine if we're in workflow mode (with DB persistence)
  const isWorkflowMode = !!workflowContext;

  // Session ID for stateful execution - persists across executes, regenerated on reset
  const [sessionId, setSessionId] = useState<string>(() => generateSessionId());
  const isResettingRef = useRef(false);

  // Tab state
  const [activeInputTab, setActiveInputTab] = useState<"schema" | "json">("schema");
  const [activeOutputTab, setActiveOutputTab] = useState<"schema" | "json">("schema");

  // Get persisted test data from store (for standalone mode)
  const { 
    getInputData, setInputData: persistInputData,
    getFormData, setFormData: persistFormData,
  } = useNodeTestDataStore();

  // Input JSON state - initialize from workflow context or persisted store
  const [inputData, setInputData] = useState<Record<string, unknown>>(() => {
    if (isWorkflowMode) {
      // In workflow mode: prefer connected node's output, then saved input
      const connectedOutput = workflowContext?.getConnectedNodeOutput?.();
      if (connectedOutput && Object.keys(connectedOutput).length > 0) {
        return connectedOutput;
      }
      return (workflowContext?.savedInputData as Record<string, unknown>) || {};
    }
    return getInputData(node.identifier);
  });

  // Form values state - initialize from workflow context or persisted store
  const [persistedFormValues, setPersistedFormValues] = useState<Record<string, string>>(() => {
    if (isWorkflowMode && workflowContext?.savedFormValues) {
      // Convert Record<string, unknown> to Record<string, string>
      const formValues: Record<string, string> = {};
      for (const [key, value] of Object.entries(workflowContext.savedFormValues)) {
        formValues[key] = String(value ?? '');
      }
      return formValues;
    }
    return getFormData(node.identifier);
  });

  // Output state - initialize from workflow context or null
  const [outputData, setOutputData] = useState<TNodeExecuteResponse | null>(() => {
    if (isWorkflowMode && workflowContext?.savedOutputData && Object.keys(workflowContext.savedOutputData).length > 0) {
      return {
        success: true,
        output: { data: workflowContext.savedOutputData },
      };
    }
    return null;
  });

  // Load data when dialog opens or node changes
  useEffect(() => {
    if (isOpen) {
      if (isWorkflowMode) {
        // In workflow mode: load from workflow context
        const connectedOutput = workflowContext?.getConnectedNodeOutput?.();
        if (connectedOutput && Object.keys(connectedOutput).length > 0) {
          setInputData(connectedOutput);
        } else if (workflowContext?.savedInputData) {
          setInputData(workflowContext.savedInputData as Record<string, unknown>);
        }
        
        if (workflowContext?.savedFormValues) {
          const formValues: Record<string, string> = {};
          for (const [key, value] of Object.entries(workflowContext.savedFormValues)) {
            formValues[key] = String(value ?? '');
          }
          setPersistedFormValues(formValues);
        }
        
        if (workflowContext?.savedOutputData && Object.keys(workflowContext.savedOutputData).length > 0) {
          setOutputData({
            success: true,
            output: { data: workflowContext.savedOutputData },
          });
        }
      } else {
        // In standalone mode: load from local store
        setInputData(getInputData(node.identifier));
        setPersistedFormValues(getFormData(node.identifier));
        setOutputData(null);  // Clear previous node's output
      }
    }
  }, [isOpen, node.identifier, isWorkflowMode, workflowContext, getInputData, getFormData]);

  // Persist input data whenever it changes (only in standalone mode)
  const handleInputDataChange = useCallback((data: Record<string, unknown>) => {
    setInputData(data);
    if (!isWorkflowMode) {
      persistInputData(node.identifier, data);
    }
  }, [node.identifier, persistInputData, isWorkflowMode]);

  // Persist form data whenever it changes (only in standalone mode)
  const handleFormValuesChange = useCallback((data: Record<string, string>) => {
    setPersistedFormValues(data);
    if (!isWorkflowMode) {
      persistFormData(node.identifier, data);
    }
  }, [node.identifier, persistFormData, isWorkflowMode]);
  
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

  // Get store method to update node execution data
  const updateNodeExecutionData = useWorkflowCanvasStore(state => state.updateNodeExecutionData);

  // Reset session - clears server-side state and generates new session ID
  const handleReset = useCallback(async () => {
    if (isResettingRef.current) return;
    isResettingRef.current = true;

    try {
      // Clear server-side session
      await ApiService.resetNodeSession(node.identifier, { session_id: sessionId });
    } catch (error) {
      console.error("Failed to reset session:", error);
    }

    // Generate new session ID and clear output
    setSessionId(generateSessionId());
    setOutputData(null);
    isResettingRef.current = false;
  }, [node.identifier, sessionId]);

  // Execute node
  const handleExecute = useCallback(
    async (formData: Record<string, string>) => {
      setIsExecuting(true);
      setOutputData(null);

      try {
        let result: TNodeExecuteResponse;
        
        if (isWorkflowMode && workflowContext) {
          // Workflow mode: use execute_and_save_node API (saves to DB)
          const response = await workflowApi.executeAndSaveNode(
            workflowContext.workflowId,
            workflowContext.nodeInstanceId,
            {
              form_values: formData,
              input_data: inputData,
            }
          );
          
          // Convert workflow response to standard format
          result = {
            success: response.success,
            output: response.output,
            error: response.error,
            error_type: response.error_type,
          };
          
          // Update the local store with the execution data so it persists without page refresh
          if (response.success) {
            // Extract output_data from the response
            const outputPayload = response.output;
            let outputData: Record<string, unknown> = {};
            if (outputPayload && typeof outputPayload === 'object' && 'data' in outputPayload) {
              outputData = (outputPayload as { data: Record<string, unknown> }).data || {};
            } else if (outputPayload && typeof outputPayload === 'object') {
              outputData = outputPayload as Record<string, unknown>;
            }
            
            updateNodeExecutionData(workflowContext.nodeInstanceId, {
              form_values: formData,
              input_data: inputData,
              output_data: outputData,
            });
          }
        } else {
          // Standalone mode: use regular execute API with session_id for stateful execution
          result = await ApiService.executeNode(node.identifier, {
            input_data: inputData,
            form_data: formData,
            session_id: sessionId,
          });
        }
        
        setOutputData(result);
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
    [node.identifier, inputData, isWorkflowMode, workflowContext, updateNodeExecutionData, sessionId]
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
              {/* Reset button - clears node state for fresh execution */}
              {!isWorkflowMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={isExecuting}
                  className="flex items-center gap-1.5 text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </Button>
              )}
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

