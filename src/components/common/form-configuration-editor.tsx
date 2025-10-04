"use client";

import { useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconForms } from "@tabler/icons-react";
import FormBuilder from "../FormBuilder/FormBuilder";
import { TWidgetConfig } from "../FormBuilder/inputs";

interface FormConfigurationEditorProps {
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
  disabled?: boolean;
}

export function FormConfigurationEditor({ value, onChange, disabled }: FormConfigurationEditorProps) {


  // Handle form builder changes
  const handleFormBuilderChange = useCallback((widgets: TWidgetConfig[]) => {
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
        <FormBuilder 
          onFormChange={handleFormBuilderChange} 
          initialWidgets={(value as Record<string, unknown>)?.widgets as TWidgetConfig[] || []} 
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
}