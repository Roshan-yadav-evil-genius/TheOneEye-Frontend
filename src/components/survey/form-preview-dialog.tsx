"use client";

import { useState, useEffect, useMemo } from "react";
import { DndContext } from "@dnd-kit/core";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { InputSection } from "../workflow/input-section";
import { OutputSection } from "../workflow/output-section";
import { CustomFormPreview } from "./custom-form-preview";
import { convertSurveyJSJsonToCustomFormat } from "./survey-json-converter";
import { sampleInputData } from "@/data/sample-data";
import { ResizablePanels } from "@/components/ui/resizable-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconEye, IconCode } from "@tabler/icons-react";

interface FormPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formJson: any;
  formTitle?: string;
  nodeName?: string;
  nodeDescription?: string;
  onFormDataChange?: (data: any) => void;
}

export function FormPreviewDialog({ 
  isOpen, 
  onOpenChange, 
  formJson,
  formTitle = "Form Preview",
  nodeName,
  nodeDescription,
  onFormDataChange
}: FormPreviewDialogProps) {
  const [activeInputTab, setActiveInputTab] = useState<"schema" | "json">("schema");
  const [activeOutputTab, setActiveOutputTab] = useState<"schema" | "json">("json");
  const [activePreviewTab, setActivePreviewTab] = useState<"preview" | "json">("preview");
  const [formData, setFormData] = useState<any>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Convert SurveyJS format to custom format for header display
  const convertedConfig = useMemo(() => {
    if (!formJson) return null;
    
    try {
      // Check if it's already in custom format
      if (formJson.elements && Array.isArray(formJson.elements)) {
        return formJson;
      }
      
      // Convert SurveyJS format
      if (formJson.pages || formJson.questions || formJson.elements) {
        return convertSurveyJSJsonToCustomFormat(formJson);
      }
      
      return null;
    } catch (error) {
      console.error('Error converting form configuration:', error);
      return null;
    }
  }, [formJson]);

  const handleFormDataChange = (data: any) => {
    setFormData(data);
    if (onFormDataChange) {
      onFormDataChange(data);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[95vw] h-[90vh] bg-gray-900 border-gray-700 !p-0">
        <VisuallyHidden>
          <DialogTitle>{formTitle}</DialogTitle>
          <DialogDescription>
            Preview the form with input data and see the output results
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

              {/* FORM PREVIEW Column */}
              <div className="h-full overflow-hidden bg-gray-800 border-r border-gray-700">
                <div className="h-full flex flex-col">
                  {/* Header with Logo, Node Name and Description */}
                  {formJson && (
                    <div className="border-b border-gray-700 p-2 bg-gray-800">
                      <div className="flex items-start gap-2">
                        {convertedConfig?.logo && (
                          <img 
                            src={convertedConfig.logo} 
                            alt="Node Logo" 
                            className="w-10 h-10 object-contain flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h2 className="text-sm font-semibold text-white mb-0.5">
                            {nodeName || convertedConfig?.title || "Form Preview"}
                          </h2>
                          {(nodeDescription || convertedConfig?.description) && (
                            <div className="text-xs text-gray-300">
                              {isDescriptionExpanded ? (
                                <p>{nodeDescription || convertedConfig?.description}</p>
                              ) : (
                                <span>
                                  {(nodeDescription || convertedConfig?.description)?.split(' ').slice(0, 5).join(' ')}
                                  {(nodeDescription || convertedConfig?.description)?.split(' ').length > 5 && (
                                    <button
                                      onClick={() => setIsDescriptionExpanded(true)}
                                      className="text-blue-400 hover:text-blue-300 ml-1 cursor-pointer"
                                    >
                                      ...
                                    </button>
                                  )}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-b border-gray-700 p-4">
                    <Tabs value={activePreviewTab} onValueChange={(value) => setActivePreviewTab(value as "preview" | "json")}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="preview" className="flex items-center gap-2">
                          <IconEye className="h-4 w-4" />
                          Preview
                        </TabsTrigger>
                        <TabsTrigger value="json" className="flex items-center gap-2">
                          <IconCode className="h-4 w-4" />
                          JSON
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    <Tabs value={activePreviewTab} onValueChange={(value) => setActivePreviewTab(value as "preview" | "json")}>
                      <TabsContent value="preview" className="h-full m-0">
                        <div className="h-full p-4">
                          <CustomFormPreview
                            configuration={formJson}
                            onDataChange={handleFormDataChange}
                            className="h-full"
                            showSubmitButton={false}
                          />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="json" className="h-full m-0">
                        <div className="h-full p-4">
                          <div className="h-full border rounded-lg overflow-hidden">
                            <pre className="p-4 bg-gray-900 text-gray-100 text-sm overflow-auto h-full">
                              {JSON.stringify(formJson, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>

              {/* OUTPUT Column */}
              <OutputSection 
                activeOutputTab={activeOutputTab}
                onOutputTabChange={(value) => setActiveOutputTab(value as "schema" | "json")}
                jsonData={formData || {}}
              />
            </ResizablePanels>
          </div>
        </DndContext>
      </DialogContent>
    </Dialog>
  );
}

export default FormPreviewDialog;
