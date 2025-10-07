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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { updateNodeFormValues } = useWorkflowCanvasStore();

  // Update form values when initial values change
  useEffect(() => {
    setFormValues(initialFormValues);
  }, [initialFormValues]);

  const validateForm = (widgets: any[]) => {
    const errors: Record<string, string> = {};
    widgets.forEach(widget => {
      const fieldName = widget.name || widget.id;
      const value = formValues[fieldName];
      if (widget.required && (!value || value === '')) {
        errors[fieldName] = `${widget.label} is required`;
      }
    });
    return errors;
  };

  const handleFormValueChange = (fieldName: string, value: unknown) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSave = async (widgets: any[]) => {
    // Validate form before saving
    const errors = validateForm(widgets);
    setValidationErrors(errors);
    
    // Don't save if there are validation errors
    if (Object.keys(errors).length > 0) {
      return;
    }
    
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
          <>
            <WidgetMapper 
              widgets={widgets} 
              formValues={formValues}
              onFormValueChange={handleFormValueChange}
              validationErrors={validationErrors}
            />
            
            <div className="flex justify-end pt-4 border-t border-gray-700">
              <Button 
                onClick={() => handleSave(widgets)}
                disabled={isSaving || Object.keys(validationErrors).length > 0}
                className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Form Values"}
              </Button>
            </div>
          </>
        )}
      </WidgetLoader>
    </div>
  );
}
