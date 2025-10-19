"use client";

import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { InputSection } from "./input-section";
import { OutputSection } from "./output-section";
import { NodeEditor } from "./node-editor";
import { sampleInputData } from "@/data";
import { ResizablePanels } from "@/components/ui/resizable-panel";
import { BackendWorkflowNode } from "@/types";
import { useNodeData } from "@/hooks/useNodeData";
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
  
  // Fetch node data
  const { inputData, outputData, isLoading, error, refetch } = useNodeData(workflowId, data.id, isOpen);
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] h-[90vh] bg-gray-900 border-gray-700 !p-0">
        <VisuallyHidden>
          <DialogTitle>Edit Node: {data.node_type?.name} (ID: {data.id})</DialogTitle>
        </VisuallyHidden>
        <DndContext>
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header with refresh button */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-gray-800 flex-shrink-0">
              <h2 className="text-sm font-semibold text-gray-300">
                {data.node_type?.name}
              </h2>
              <Button 
                onClick={refetch} 
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
              />
            </div>

            {/* OUTPUT Column */}
            <OutputSection 
              activeOutputTab={activeOutputTab}
              onOutputTabChange={(value) => setActiveOutputTab(value as "schema" | "json")}
              jsonData={outputData}
              isLoading={isLoading}
              error={error}
            />
          </ResizablePanels>
        </div>
        </DndContext>
      </DialogContent>
    </Dialog>
  );
}
