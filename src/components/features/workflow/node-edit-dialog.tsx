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

interface NodeEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: BackendWorkflowNode;
}

export function NodeEditDialog({ 
  isOpen, 
  onOpenChange, 
  data, 
}: NodeEditDialogProps) {
  // Tab state management
  const [activeInputTab, setActiveInputTab] = useState<"schema" | "json">("schema");
  const [activeOutputTab, setActiveOutputTab] = useState<"schema" | "json">("schema");
  const [activeNodeTab, setActiveNodeTab] = useState<"parameters" | "form">("parameters");
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] h-[90vh] bg-gray-900 border-gray-700 !p-0">
        <VisuallyHidden>
          <DialogTitle>Edit Node: {data.node_type?.name} (ID: {data.id})</DialogTitle>
        </VisuallyHidden>
        <DndContext>
          <div className="flex flex-col h-full overflow-hidden">
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
              jsonData={sampleInputData}
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
              jsonData={sampleInputData}
            />
          </ResizablePanels>
        </div>
        </DndContext>
      </DialogContent>
    </Dialog>
  );
}
