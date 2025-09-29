"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Trash2, Plus, ExternalLink, Briefcase } from "lucide-react";
import { InputSection } from "./input-section";
import { OutputSection } from "./output-section";
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

  const addCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      field: "",
      operator: "equals",
      value: ""
    };
    setConditions(prev => [...prev, newCondition]);
  };

  const updateCondition = (id: string, field: keyof Condition, value: string) => {
    setConditions(prev => 
      prev.map(condition => 
        condition.id === id ? { ...condition, [field]: value } : condition
      )
    );
  };

  const removeCondition = (id: string) => {
    setConditions(prev => prev.filter(condition => condition.id !== id));
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
            <div className="border-r border-gray-700 flex flex-col bg-gray-900 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">If</span>
                  </div>
                  <h3 className="text-white font-medium">If</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-3 py-1 h-auto">
                    <Briefcase className="w-3 h-3 mr-1" />
                    Test step
                  </Button>
                  <a href="#" className="text-gray-400 hover:text-white text-sm flex items-center gap-1">
                    Docs
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <Tabs value={activeNodeTab} onValueChange={(value) => setActiveNodeTab(value as "parameters" | "settings")} className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-b border-gray-700 rounded-none">
                  <TabsTrigger 
                    value="parameters" 
                    className={`data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-pink-500 text-gray-400`}
                  >
                    Parameters
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className={`data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400`}
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="parameters" className="flex-1 p-4 m-0 overflow-auto">
                  <div className="space-y-6">
                    {/* Conditions Section */}
                    <div>
                      <h4 className="text-white font-medium mb-4">Conditions</h4>
                      
                      {/* Logic Selector */}
                      <div className="flex mb-4">
                        <div className="flex bg-gray-800 rounded p-1">
                          <button
                            onClick={() => setLogicOperator("AND")}
                            className={`px-3 py-1 text-sm rounded ${
                              logicOperator === "AND" 
                                ? "bg-gray-700 text-white" 
                                : "text-gray-400 hover:text-white"
                            }`}
                          >
                            AND
                          </button>
                          <button
                            onClick={() => setLogicOperator("OR")}
                            className={`px-3 py-1 text-sm rounded ${
                              logicOperator === "OR" 
                                ? "bg-gray-700 text-white" 
                                : "text-gray-400 hover:text-white"
                            }`}
                          >
                            OR
                          </button>
                        </div>
                      </div>

                      {/* Condition Rows */}
                      <div className="space-y-3">
                        {conditions.map((condition) => (
                          <div key={condition.id} className="flex items-center gap-2">
                            <button className="bg-gray-700 text-gray-300 px-2 py-1 text-xs rounded">
                              fx
                            </button>
                            <Input
                              value={condition.field}
                              onChange={(e) => updateCondition(condition.id, "field", e.target.value)}
                              className="bg-gray-800 border-pink-500 text-white placeholder-gray-400"
                              placeholder="Field expression"
                            />
                            <Select value={condition.operator} onValueChange={(value) => updateCondition(condition.id, "operator", value)}>
                              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-600">
                                <SelectItem value="equals">equals</SelectItem>
                                <SelectItem value="is greater than">is greater than</SelectItem>
                                <SelectItem value="is less than">is less than</SelectItem>
                                <SelectItem value="contains">contains</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              value={condition.value}
                              onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
                              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                              placeholder="Value"
                            />
                            <button
                              onClick={() => removeCondition(condition.id)}
                              className="text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add Condition Buttons */}
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={addCondition}
                          variant="outline"
                          className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Condition
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Group
                        </Button>
                      </div>
                    </div>

                    {/* Convert Types Toggle */}
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Convert types where required</Label>
                      <Toggle
                        pressed={convertTypes}
                        onPressedChange={setConvertTypes}
                        className="data-[state=on]:bg-orange-600"
                      />
                    </div>

                    {/* Options Section */}
                    <div>
                      <h4 className="text-white font-medium mb-2">Options</h4>
                      <p className="text-gray-400 text-sm">No properties</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="flex-1 p-4 m-0 overflow-auto">
                  <div className="space-y-4">
          <div className="grid gap-2">
                      <Label htmlFor="label" className="text-white">Label</Label>
            <Input
              id="label"
              value={editData.label}
              onChange={(e) => handleEditDataChange('label', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              placeholder="Node label"
            />
          </div>
          <div className="grid gap-2">
                      <Label htmlFor="description" className="text-white">Description</Label>
            <Input
              id="description"
              value={editData.description}
              onChange={(e) => handleEditDataChange('description', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              placeholder="Node description"
            />
          </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* OUTPUT Column */}
            <OutputSection 
              activeOutputTab={activeOutputTab}
              onOutputTabChange={(value) => setActiveOutputTab(value as "schema" | "json")}
              jsonData={sampleInputData}
            />
          </ResizablePanels>
        </div>
      </DialogContent>
    </Dialog>
  );
}
