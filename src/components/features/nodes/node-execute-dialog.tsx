"use client";

import { useState, useCallback } from "react";
import { DndContext } from "@dnd-kit/core";
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
import { Textarea } from "@/components/ui/textarea";
import { IconCode, IconPlayerPlay } from "@tabler/icons-react";

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
  const [inputJsonText, setInputJsonText] = useState<string>("{}");
  const [inputData, setInputData] = useState<Record<string, unknown>>({});
  const [inputError, setInputError] = useState<string | null>(null);

  // Output state
  const [outputData, setOutputData] = useState<TNodeExecuteResponse | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Parse input JSON
  const handleInputJsonChange = useCallback((value: string) => {
    setInputJsonText(value);
    try {
      const parsed = JSON.parse(value);
      setInputData(parsed);
      setInputError(null);
    } catch {
      setInputError("Invalid JSON");
    }
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] h-[90vh] bg-gray-900 border-gray-700 !p-0">
        <VisuallyHidden>
          <DialogTitle>Execute Node: {node.name}</DialogTitle>
        </VisuallyHidden>

        <DndContext>
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
                <div className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-800 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h3 className="text-white font-medium text-sm">INPUT</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveInputTab(activeInputTab === "schema" ? "json" : "schema")}
                    className="h-7 px-2 text-xs text-gray-400 hover:text-white"
                  >
                    <IconCode className="w-3 h-3 mr-1" />
                    {activeInputTab === "schema" ? "Edit JSON" : "View Schema"}
                  </Button>
                </div>

                {activeInputTab === "json" ? (
                  <div className="flex-1 p-3 overflow-hidden">
                    <Textarea
                      value={inputJsonText}
                      onChange={(e) => handleInputJsonChange(e.target.value)}
                      placeholder='{"key": "value"}'
                      className="h-full font-mono text-sm bg-gray-800 border-gray-600 text-gray-200 resize-none"
                    />
                    {inputError && (
                      <p className="text-red-400 text-xs mt-1">{inputError}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 overflow-hidden">
                    <JsonViewer
                      title="INPUT"
                      statusColor="bg-blue-500"
                      jsonData={inputData}
                      activeTab="schema"
                      onTabChange={() => {}}
                      enableDragDrop={true}
                    />
                  </div>
                )}
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
        </DndContext>
      </DialogContent>
    </Dialog>
  );
}

