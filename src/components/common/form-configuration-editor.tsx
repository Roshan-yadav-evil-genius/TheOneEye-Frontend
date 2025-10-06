"use client";

import { useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconForms } from "@tabler/icons-react";
import FormBuilder from "../features/form-builder/FormBuilder";
import { TWidgetConfig } from "../features/form-builder/inputs";

interface FormConfigurationEditorProps {
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
  disabled?: boolean;
}

// Helper function to convert form elements back to widgets for the FormBuilder
function convertElementsToWidgets(value: Record<string, unknown>): TWidgetConfig[] {
  if (!value || !value.elements || !Array.isArray(value.elements)) {
    return [];
  }

  return (value.elements as Record<string, unknown>[]).map((element, index) => ({
    id: `widget-${index}`,
    type: element.type,
    name: element.name,
    label: element.title,
    required: element.isRequired || false,
    placeholder: element.placeholder || "",
    ...(element.choices && { options: element.choices }),
    ...(element.defaultValue && { defaultValue: element.defaultValue }),
  }));
}

export function FormConfigurationEditor({ value, onChange, disabled }: FormConfigurationEditorProps) {


  // Handle form builder changes
  const handleFormBuilderChange = useCallback((widgets: TWidgetConfig[]) => {
    // Convert widgets to form configuration format that matches backend expectations
    const formConfig = {
      title: "Node Configuration Form",
      description: "Configure the settings for this node",
      elements: widgets.map(widget => ({
        type: widget.type,
        name: widget.name,
        title: widget.label || widget.name,
        isRequired: widget.required || false,
        placeholder: widget.placeholder || "",
        ...(widget.options && { choices: widget.options }),
        ...(widget.defaultValue && { defaultValue: widget.defaultValue }),
      }))
    };
    onChange(formConfig);
  }, [onChange]);

  return (
    <FormBuilder
      onFormChange={handleFormBuilderChange}
      initialWidgets={convertElementsToWidgets(value)}
      disabled={disabled}
    />

  );
}