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
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20">
              {/* Field Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {widget.label || `Field ${index + 1}`}
                    </span>
                    {widget.required && (
                      <span className="text-red-500 text-xs">*</span>
                    )}
                  </div>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md font-medium">
                    {widget.type}
                  </span>
                </div>
              </div>
              
              {/* Field Preview */}
              <div className="mb-3">
                <FieldPreview widget={widget} />
              </div>
              
              {/* Field Details */}
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {widget.placeholder && (
                  <span className="px-2 py-1 bg-muted/50 rounded-md">
                    Placeholder: "{widget.placeholder}"
                  </span>
                )}
                {widget.options && widget.options.length > 0 && (
                  <span className="px-2 py-1 bg-muted/50 rounded-md">
                    {widget.options.length} option{widget.options.length !== 1 ? 's' : ''}
                  </span>
                )}
                {widget.required && (
                  <span className="px-2 py-1 bg-red-50 text-red-600 rounded-md">
                    Required field
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
