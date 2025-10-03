"use client";

import React from "react";
import { FieldPreview } from "./FieldPreview";

interface WidgetMapperProps {
  widgets: any[];
}

export function WidgetMapper({ widgets }: WidgetMapperProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {widgets.map((widget: any, index: number) => (
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
                <FieldPreview widget={widget} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
