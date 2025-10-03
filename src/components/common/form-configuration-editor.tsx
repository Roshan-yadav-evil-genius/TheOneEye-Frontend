"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconForms, IconCheck, IconX } from "@tabler/icons-react";
import FormBuilder from "../FormBuilder/FormBuilder";
import { WidgetConfig } from "../FormBuilder/inputs";

interface FormConfigurationEditorProps {
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
  disabled?: boolean;
}

export function FormConfigurationEditor({ value, onChange, disabled = false }: FormConfigurationEditorProps) {
  const [jsonString, setJsonString] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize JSON string from value
  useEffect(() => {
    if (value && Object.keys(value).length > 0) {
      setJsonString(JSON.stringify(value, null, 2));
    } else {
      setJsonString("");
    }
  }, [value]);

  const handleJsonChange = (newValue: string) => {
    setJsonString(newValue);
    
    if (newValue.trim() === "") {
      setIsValid(true);
      setError(null);
      onChange({});
      return;
    }

    try {
      const parsed = JSON.parse(newValue);
      setIsValid(true);
      setError(null);
      onChange(parsed);
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const handleClear = () => {
    setJsonString("");
    setIsValid(true);
    setError(null);
    onChange({});
  };

  const handleFormat = () => {
    if (jsonString.trim() === "") return;
    
    try {
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonString(formatted);
      setIsValid(true);
      setError(null);
    } catch {
      // Don't format if invalid
    }
  };

  // Handle form builder changes
  const handleFormBuilderChange = useCallback((widgets: WidgetConfig[]) => {
    // Convert widgets to form configuration format
    const formConfig = {
      widgets: widgets,
      metadata: {
        totalFields: widgets.length,
        lastUpdated: new Date().toISOString()
      }
    };
    onChange(formConfig);
  }, [onChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconForms className="h-5 w-5" />
          Form Configuration
        </CardTitle>
        <CardDescription>
          Define the form structure and validation rules for this node
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormBuilder onFormChange={handleFormBuilderChange} initialWidgets={value.widgets as WidgetConfig[] || []}/>
      </CardContent>
    </Card>
  );
}