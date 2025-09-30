"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { IconEye, IconCode, IconDownload, IconUpload, IconTrash } from "@tabler/icons-react";
import { SurveyCreatorWrapper } from "./survey-creator";
import { SurveyPreview } from "./survey-preview";

interface FormConfigurationManagerProps {
  initialJson?: any;
  onJsonChanged?: (json: any) => void;
  onSave?: (json: any) => void;
  className?: string;
}

export function FormConfigurationManager({
  initialJson,
  onJsonChanged,
  onSave,
  className = "",
}: FormConfigurationManagerProps) {
  const [currentJson, setCurrentJson] = useState(initialJson || {});
  const [activeTab, setActiveTab] = useState("designer");
  const [previewData, setPreviewData] = useState<any>(null);

  const handleJsonChanged = useCallback((json: any) => {
    setCurrentJson(json);
    if (onJsonChanged) {
      onJsonChanged(json);
    }
  }, [onJsonChanged]);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(currentJson);
    }
  }, [currentJson, onSave]);

  const handleDownload = useCallback(() => {
    const dataStr = JSON.stringify(currentJson, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'form-configuration.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [currentJson]);

  const handleUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          setCurrentJson(json);
          if (onJsonChanged) {
            onJsonChanged(json);
          }
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  }, [onJsonChanged]);

  const handleClear = useCallback(() => {
    setCurrentJson({});
    if (onJsonChanged) {
      onJsonChanged({});
    }
  }, [onJsonChanged]);

  const getFormStats = () => {
    if (!currentJson || !currentJson.elements) return { questions: 0, pages: 0 };
    
    const questions = currentJson.elements?.length || 0;
    const pages = currentJson.pages?.length || 1;
    
    return { questions, pages };
  };

  const stats = getFormStats();

  return (
    <div className={`form-configuration-manager ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Form Configuration
                {stats.questions > 0 && (
                  <Badge variant="secondary">
                    {stats.questions} question{stats.questions !== 1 ? 's' : ''}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Design and configure the form for this node
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!currentJson || Object.keys(currentJson).length === 0}
              >
                <IconDownload className="h-4 w-4" />
                Export
              </Button>
              <label htmlFor="upload-json">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <IconUpload className="h-4 w-4" />
                    Import
                  </span>
                </Button>
              </label>
              <input
                id="upload-json"
                type="file"
                accept=".json"
                onChange={handleUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={!currentJson || Object.keys(currentJson).length === 0}
              >
                <IconTrash className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="designer" className="flex items-center gap-2">
                <IconCode className="h-4 w-4" />
                Designer
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <IconEye className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="json" className="flex items-center gap-2">
                <IconCode className="h-4 w-4" />
                JSON
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="designer" className="mt-4">
              <div className="border rounded-lg overflow-hidden">
                <SurveyCreatorWrapper
                  initialJson={currentJson}
                  onJsonChanged={handleJsonChanged}
                  onSurveySaved={handleSave}
                  className="min-h-[600px]"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-4">
              <div className="border rounded-lg overflow-hidden">
                <SurveyPreview
                  json={currentJson}
                  onValueChanged={setPreviewData}
                  className="min-h-[600px] p-4"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="json" className="mt-4">
              <div className="border rounded-lg overflow-hidden">
                <pre className="p-4 bg-muted text-sm overflow-auto max-h-[600px]">
                  {JSON.stringify(currentJson, null, 2)}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default FormConfigurationManager;
