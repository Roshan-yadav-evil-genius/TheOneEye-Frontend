"use client";

import React, { useState, useEffect } from "react";
import { BackendNodeType } from "@/types/api/backend";
import { WidgetLoader } from "./WidgetLoader";
import { WidgetMapper } from "./WidgetMapper";
import { Button } from "@/components/ui/button";
import { useWorkflowCanvasStore } from "@/stores/workflow-canvas-store";

interface FormFieldsSectionProps {
  node_type: BackendNodeType;
  nodeId: string;
  initialFormValues?: Record<string, unknown>;
}

export function FormFieldsSection({ node_type, nodeId, initialFormValues = {} }: FormFieldsSectionProps) {
  const [formValues, setFormValues] = useState<Record<string, unknown>>(initialFormValues);
  const [isSaving, setIsSaving] = useState(false);
  const { updateNodeFormValues } = useWorkflowCanvasStore();

  // Update form values when initial values change
  useEffect(() => {
    setFormValues(initialFormValues);
  }, [initialFormValues]);

  const handleFormValueChange = (fieldName: string, value: unknown) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateNodeFormValues(nodeId, formValues);
    } catch (error) {
      console.error('Failed to save form values:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <WidgetLoader node_type={node_type}>
        {(widgets) => (
          <WidgetMapper 
            widgets={widgets} 
            formValues={formValues}
            onFormValueChange={handleFormValueChange}
          />
        )}
      </WidgetLoader>
      
      <div className="flex justify-end pt-4 border-t border-gray-700">
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isSaving ? "Saving..." : "Save Form Values"}
        </Button>
      </div>
    </div>
  );
}
