"use client";

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
import { useNodeEditDialog } from "@/hooks/useNodeEditDialog";

interface NodeEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  nodeData: {
    id: string;
    label: string;
    type: string;
    status: string;
    category: string;
    description?: string;
    formConfiguration?: Record<string, unknown>;
  };
  onSave?: (updatedData: {
    id: string;
    label: string;
    type: string;
    status: string;
    category: string;
    description?: string;
    formConfiguration?: Record<string, unknown>;
  }) => void;
}

export function NodeEditDialog({ 
  isOpen, 
  onOpenChange, 
  nodeData, 
  onSave 
}: NodeEditDialogProps) {
  const {
    editData,
    groups,
    convertTypes,
    activeInputTab,
    activeOutputTab,
    activeNodeTab,
    setGroups,
    setConvertTypes,
    setActiveInputTab,
    setActiveOutputTab,
    setActiveNodeTab,
    handleEditDataChange,
    handleFormConfigurationChange,
  } = useNodeEditDialog({ nodeData });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] h-[90vh] bg-gray-900 border-gray-700 !p-0">
        <VisuallyHidden>
          <DialogTitle>Edit Node: {nodeData.label} (ID: {nodeData.id})</DialogTitle>
          <DialogDescription>
            Configure the parameters and settings for the {nodeData.type} node &quot;{nodeData.label}&quot;.
          </DialogDescription>
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
                nodeType={editData.type}
                nodeLabel={editData.label}
                nodeId={editData.id}
                activeTab={activeNodeTab}
                onTabChange={(value) => setActiveNodeTab(value as "parameters" | "settings" | "form")}
                groups={groups}
                convertTypes={convertTypes}
                onGroupsChange={setGroups}
                onConvertTypesChange={setConvertTypes}
                label={editData.label}
                description={editData.description}
                onLabelChange={(value) => handleEditDataChange('label', value)}
                onDescriptionChange={(value) => handleEditDataChange('description', value)}
                formConfiguration={editData.formConfiguration}
                onFormConfigurationChange={handleFormConfigurationChange}
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
