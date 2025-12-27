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
import { TNodeMetadata, TNodeExecuteResponse } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw, Play, Loader2 } from "lucide-react";
import { getBadgeStyles } from "@/constants/node-styles";
import { NodeLogo } from "@/components/common/node-logo";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useNodeSession } from "@/hooks/useNodeSession";
import { useNodePersistence, WorkflowPersistenceContext } from "@/hooks/useNodePersistence";
import { useNodeExecution } from "@/hooks/useNodeExecution";

// Workflow context for DB persistence
export interface WorkflowExecuteContext {
  workflowId: string;
  nodeInstanceId: string;
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
  // Session management
  const { sessionId, isWorkflowMode } = useNodeSession(node.identifier, workflowContext);

  // Persistence management
  const persistenceContext: WorkflowPersistenceContext | undefined = workflowContext
    ? {
        workflowId: workflowContext.workflowId,
        nodeInstanceId: workflowContext.nodeInstanceId,
        getConnectedNodeOutput: workflowContext.getConnectedNodeOutput,
      }
    : undefined;

  const {
    inputData,
    formValues: persistedFormValues,
    outputData,
    setInputData,
    setFormValues: setPersistedFormValues,
    setOutputData,
  } = useNodePersistence(node.identifier, isWorkflowMode, persistenceContext, isOpen);

  // Execution management
  const {
    execute,
    reset: handleReset,
    save: handleSave,
    isExecuting,
    isSaving,
    executionFormState,
    setExecutionFormState,
  } = useNodeExecution({
    nodeIdentifier: node.identifier,
    sessionId,
    isWorkflowMode,
    workflowContext: workflowContext
      ? {
          workflowId: workflowContext.workflowId,
          nodeInstanceId: workflowContext.nodeInstanceId,
        }
      : undefined,
    onOutputChange: setOutputData,
  });

  // Tab state
  const [activeInputTab, setActiveInputTab] = useState<"schema" | "json">("schema");
  const [activeOutputTab, setActiveOutputTab] = useState<"schema" | "json">("schema");

  // Clear execution form state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setExecutionFormState(null);
    }
  }, [isOpen, setExecutionFormState]);

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

  // Wrapper to call execute with current form values (for header button)
  const handleExecuteClick = useCallback(() => {
    execute(persistedFormValues, inputData);
  }, [execute, persistedFormValues, inputData]);

  const getTypeBadgeColor = (type: string) => {
    const styles = getBadgeStyles(type);
    return `${styles.bg} ${styles.text}`;
  };

  const getNodeTypeDescription = (type: string): string => {
    switch (type) {
      case 'BlockingNode':
        return 'Blocking nodes pause workflow execution until they complete. The workflow waits for the result before proceeding to the next node.';
      case 'NonBlockingNode':
        return 'Non-blocking nodes execute asynchronously. The workflow continues immediately without waiting for completion.';
      case 'ProducerNode':
        return 'Producer nodes generate or fetch data that can be used by other nodes in the workflow.';
      default:
        return 'Standard node type with default execution behavior.';
    }
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={pointerWithin}
    >
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="!max-w-[95vw] h-[90vh] bg-background border-border !p-0 shadow-2xl">
          <VisuallyHidden>
            <DialogTitle>Execute Node: {node.name}</DialogTitle>
          </VisuallyHidden>

          <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pr-12 py-2.5 border-b border-border bg-card/95 backdrop-blur-sm shadow-md flex-shrink-0 transition-all duration-200">
              <div className="flex items-center gap-2.5">
                <NodeLogo node={node} size="sm" />
                <h2 className="text-sm font-semibold text-foreground leading-tight">
                  {node.label || node.name}
                  <span className="text-muted-foreground font-normal ml-1">
                    ({node.identifier})
                  </span>
                </h2>
              </div>
              {/* Header action buttons */}
              <div className="flex items-center gap-3 mr-2">
                {/* Execute button */}
                <Button
                  size="sm"
                  onClick={handleExecuteClick}
                  disabled={isExecuting || isSaving}
                  className="relative flex items-center gap-2 px-4 py-2 font-medium shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                      <span>Execute</span>
                    </>
                  )}
                  {!isExecuting && !isSaving && (
                    <span className="absolute inset-0 rounded-md bg-primary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10"></span>
                  )}
                </Button>
                {/* Reset button - clears node state for fresh execution */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={isExecuting || isSaving}
                  className="flex items-center gap-2 px-4 py-2 font-medium border-border/50 hover:border-border hover:bg-muted/50 transition-all duration-300 hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Reset</span>
                </Button>
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
              <div className="h-full flex flex-col overflow-hidden border-r border-border/50 border-l-2 border-l-blue-500/30 bg-background transition-all duration-200">
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
              <div className="h-full flex flex-col overflow-hidden border-r border-border/50 border-l-2 border-l-pink-500/30 bg-background transition-all duration-200">
                <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-border bg-card/80 backdrop-blur-sm flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.6)] animate-pulse"></div>
                    <h3 className="text-foreground font-medium text-sm tracking-wide">
                      {isWorkflowMode && workflowContext 
                        ? `Form(${workflowContext.nodeInstanceId})` 
                        : 'FORM'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Node Type Badge with Tooltip */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className={`${getTypeBadgeColor(node.type)} border transition-all duration-200 hover:scale-105 cursor-help text-xs font-medium px-2 py-0.5`}>
                          {node.type}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs">
                        <div className="space-y-1">
                          <p className="font-semibold">{node.type}</p>
                          <p className="text-xs opacity-90">{getNodeTypeDescription(node.type)}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <NodeFormEditor
                    node={node}
                    onExecute={(formData) => execute(formData, inputData)}
                    isExecuting={isExecuting}
                    initialFormValues={persistedFormValues}
                    onFormValuesChange={setPersistedFormValues}
                    showExecuteButton={false}
                    onSave={isWorkflowMode ? () => handleSave(persistedFormValues) : undefined}
                    isSaving={isSaving}
                    executionFormState={executionFormState}
                  />
                </div>
              </div>

              {/* OUTPUT Panel */}
              <div className={`h-full flex flex-col overflow-hidden border-l-2 ${
                outputData?.success 
                  ? "border-l-green-500/30" 
                  : outputData?.error 
                  ? "border-l-red-500/30" 
                  : "border-l-yellow-500/30"
              } bg-background transition-all duration-200`}>
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

