"use client";

import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { InputSection } from "./input-section";
import { OutputSection } from "./output-section";
import { NodeEditor } from "./node-editor";
import { sampleInputData } from "@/data/sample-data";
import { ResizablePanels } from "@/components/ui/resizable-panel";

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface NodeEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  nodeData: {
    label: string;
    type: string;
    status: string;
    category: string;
    description?: string;
  };
  onSave: (updatedData: {
    label: string;
    type: string;
    status: string;
    category: string;
    description?: string;
  }) => void;
}

export function NodeEditDialog({ 
  isOpen, 
  onOpenChange, 
  nodeData, 
  onSave 
}: NodeEditDialogProps) {
  const [editData, setEditData] = useState({
    label: nodeData.label,
    description: nodeData.description || "",
    type: nodeData.type,
    status: nodeData.status,
    category: nodeData.category
  });

  const [conditions, setConditions] = useState<Condition[]>([
    { id: "1", field: "{{ $json[0].Age }}", operator: "is greater than", value: "50" }
  ]);
  const [logicOperator, setLogicOperator] = useState<"AND" | "OR">("AND");
  const [convertTypes, setConvertTypes] = useState(false);
  const [activeInputTab, setActiveInputTab] = useState<"schema" | "json">("schema");
  const [activeOutputTab, setActiveOutputTab] = useState<"schema" | "json">("json");
  const [activeNodeTab, setActiveNodeTab] = useState<"parameters" | "settings">("parameters");

  // Update editData when nodeData changes
  useEffect(() => {
    setEditData({
      label: nodeData.label,
      description: nodeData.description || "",
      type: nodeData.type,
      status: nodeData.status,
      category: nodeData.category
    });
  }, [nodeData]);

  const handleEditDataChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleSave = () => {
    onSave(editData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setEditData({
      label: nodeData.label,
      description: nodeData.description || "",
      type: nodeData.type,
      status: nodeData.status,
      category: nodeData.category
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] h-[90vh] bg-gray-900 border-gray-700 !p-0">
        <VisuallyHidden>
          <DialogTitle>Edit Node: {nodeData.label}</DialogTitle>
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
            <NodeEditor
              nodeType="If"
              nodeLabel="If"
              activeTab={activeNodeTab}
              onTabChange={(value) => setActiveNodeTab(value as "parameters" | "settings")}
              conditions={conditions}
              logicOperator={logicOperator}
              convertTypes={convertTypes}
              onConditionsChange={setConditions}
              onLogicOperatorChange={setLogicOperator}
              onConvertTypesChange={setConvertTypes}
              label={editData.label}
              description={editData.description}
              onLabelChange={(value) => handleEditDataChange('label', value)}
              onDescriptionChange={(value) => handleEditDataChange('description', value)}
            />

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
