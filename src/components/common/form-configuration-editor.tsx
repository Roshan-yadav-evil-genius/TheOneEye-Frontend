"use client";

import { useCallback } from "react";
import FormBuilder from "../features/form-builder/FormBuilder";
import { TWidgetConfig, TWidgetType } from "../features/form-builder/inputs";
import { TFormConfiguration } from "@/types/api/backend";

interface FormConfigurationEditorProps {
  value: Record<string, unknown>;
  onChange: (value: TFormConfiguration) => void;
  disabled?: boolean;
  onValidationError?: (hasErrors: boolean, errorMessage?: string) => void;
}

// Helper function to convert form elements back to widgets for the FormBuilder
function convertElementsToWidgets(value: Record<string, unknown>): TWidgetConfig[] {
  if (!value || !value.elements || !Array.isArray(value.elements)) {
    return [];
  }

  return (value.elements as Record<string, unknown>[]).map((element, index) => ({
    id: `widget-${index}`,
    type: element.type as TWidgetType,
    name: element.name as string,
    label: element.title as string,
    required: Boolean(element.isRequired) || false,
    placeholder: (element.placeholder as string) || "",
    ...(element.choices ? { options: element.choices as string[] } : {}),
  }));
}

export function FormConfigurationEditor({ value, onChange, disabled, onValidationError }: FormConfigurationEditorProps) {


  // Handle form builder changes
  const handleFormBuilderChange = useCallback((widgets: TWidgetConfig[]) => {
    // Validate that all widgets have required fields
    const incompleteWidgets = widgets.filter(widget => 
      !widget.name || widget.name.trim() === '' || 
      !widget.label || widget.label.trim() === ''
    );

    if (incompleteWidgets.length > 0) {
      // Don't save incomplete widgets, but still allow the form builder to work
      console.warn('Some widgets are missing required fields (name or label)');
      onValidationError?.(true, `${incompleteWidgets.length} field(s) are missing required name or label`);
      return;
    }

    // Clear validation errors if all widgets are complete
    onValidationError?.(false);

    // Convert widgets to form configuration format that matches backend expectations
    const formConfig: TFormConfiguration = {
      title: "Node Configuration Form",
      description: "Configure the settings for this node",
      elements: widgets.map(widget => ({
        type: widget.type,
        name: widget.name,
        title: widget.label || widget.name,
        isRequired: widget.required || false,
        placeholder: widget.placeholder || "",
        ...(widget.options ? { choices: widget.options } : {}),
      }))
    };
    onChange(formConfig);
  }, [onChange, onValidationError]);

  return (
    <FormBuilder
      onFormChange={handleFormBuilderChange}
      initialWidgets={convertElementsToWidgets(value)}
      disabled={disabled}
    />

  );
}