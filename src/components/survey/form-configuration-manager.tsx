"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { IconEye, IconCode, IconDownload, IconUpload, IconTrash } from "@tabler/icons-react";
import { SurveyCreatorWrapper } from "./survey-creator";
import { SurveyPreview } from "./survey-preview";
import { getSampleConfiguration } from "@/data/sample-form-configurations";
import { useFormStore, uiHelpers } from "@/stores";

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

  // Zustand store hooks
  const { validateConfiguration, testConfiguration, exportConfiguration } = useFormStore();

  const handleJsonChanged = useCallback((json: any) => {
    setCurrentJson(json);
    if (onJsonChanged) {
      onJsonChanged(json);
    }
  }, [onJsonChanged]);

  const handleSave = useCallback(async () => {
    try {
      // Validate configuration before saving
      const validation = await validateConfiguration({
        id: 'temp',
        name: 'Form Configuration',
        description: '',
        json: currentJson,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (!validation.isValid) {
        uiHelpers.showError('Validation Error', validation.errors.join(', '));
        return;
      }

      if (onSave) {
        onSave(currentJson);
      }
      
      uiHelpers.showSuccess('Success', 'Form configuration saved successfully');
    } catch (error) {
      uiHelpers.showError('Error', 'Failed to save form configuration');
    }
  }, [currentJson, onSave, validateConfiguration]);

  const handleDownload = useCallback(async () => {
    try {
      const jsonString = await exportConfiguration('temp');
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(jsonString);
      
      const exportFileDefaultName = 'form-configuration.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      uiHelpers.showSuccess('Success', 'Form configuration exported successfully');
    } catch (error) {
      uiHelpers.showError('Error', 'Failed to export form configuration');
    }
  }, [currentJson, exportConfiguration]);

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

  const handleLoadSample = useCallback((category: string) => {
    const sampleConfig = getSampleConfiguration(category);
    if (sampleConfig) {
      setCurrentJson(sampleConfig);
      if (onJsonChanged) {
        onJsonChanged(sampleConfig);
      }
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleLoadSample('email')}
              >
                Load Sample
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
              <div className="border rounded-lg overflow-hidden h-[900px]">
                <SurveyCreatorWrapper
                  initialJson={currentJson}
                  onJsonChanged={handleJsonChanged}
                  onSurveySaved={handleSave}
                  className="h-full"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-4">
              <div className="border rounded-lg overflow-hidden h-[900px]">
                <SurveyPreview
                  json={currentJson}
                  onValueChanged={setPreviewData}
                  className="h-full p-4"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="json" className="mt-4">
              <div className="border rounded-lg overflow-hidden">
                <pre className="p-4 bg-muted text-sm overflow-auto max-h-[900px]">
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
