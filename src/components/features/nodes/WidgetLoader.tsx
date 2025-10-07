"use client";

import React from "react";
import { BackendNodeType } from "@/types/api/backend";
import { TWidgetConfig } from "@/types/forms/widgets";

interface WidgetLoaderProps {
  node_type: BackendNodeType;
  children: (widgets: TWidgetConfig[]) => React.ReactNode;
}

export function WidgetLoader({node_type, children }: WidgetLoaderProps) {
  // Check if we have form configuration
  if (!node_type.form_configuration || Object.keys(node_type.form_configuration).length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        No form fields configured
      </div>
    );
  }

  // Check if we have elements in the form configuration
  const elements = (node_type.form_configuration as { elements?: any[] })?.elements;
  if (!elements || !Array.isArray(elements) || elements.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        No form fields configured
      </div>
    );
  }

  // Convert elements to widgets format for compatibility
  const widgets: TWidgetConfig[] = elements.map((element, index) => ({
    id: element.name || `widget-${index}`,
    type: element.type,
    name: element.name,
    label: element.title || element.name,
    required: element.isRequired || false,
    placeholder: element.placeholder || "",
    ...(element.choices && { options: element.choices }),
    ...(element.defaultValue && { defaultValue: element.defaultValue }),
  }));

  // Pass the converted widgets to the children function
  return <>{children(widgets)}</>;
}
