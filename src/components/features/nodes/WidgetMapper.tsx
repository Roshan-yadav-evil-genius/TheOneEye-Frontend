"use client";

import React from "react";
import { FieldPreview } from "./FieldPreview";
import { TWidgetConfig } from "@/types/forms/widgets";

interface WidgetMapperProps {
  widgets: TWidgetConfig[];
  formValues?: Record<string, unknown>;
  onFormValueChange?: (fieldName: string, value: unknown) => void;
  validationErrors?: Record<string, string>;
}

export function WidgetMapper({ widgets, formValues = {}, onFormValueChange, validationErrors = {} }: WidgetMapperProps) {
  const handleFieldChange = (fieldName: string, value: unknown) => {
    if (onFormValueChange) {
      onFormValueChange(fieldName, value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {widgets.map((widget: TWidgetConfig, index: number) => {
          const fieldName = widget.name || widget.id || `field-${index}`;
          const fieldValue = formValues[fieldName];
          
          return (
            <div key={widget.id || index} className="group">
              <div>
                {/* Field Header */}
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {widget.required && (
                        <span className="text-red-500 font-bold">*</span>
                      )}
                      <span className="text-sm font-medium text-foreground">
                        {widget.label || `Field ${index + 1}`}
                      </span>
                    </div>

                </div>
                
                {/* Field Preview */}
                <div className="mb-3">
                  <FieldPreview 
                    widget={widget} 
                    value={fieldValue as string | boolean | number | undefined}
                    onChange={(value) => handleFieldChange(fieldName, value)}
                    error={validationErrors[fieldName]}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
