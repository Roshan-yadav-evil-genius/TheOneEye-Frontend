"use client";

import React from "react";
import { TNode } from "@/types";

interface WidgetLoaderProps {
  nodeData: Partial<TNode>;
  children: (widgets: any[]) => React.ReactNode;
}

export function WidgetLoader({ nodeData, children }: WidgetLoaderProps) {
  // Check if we have form configuration
  if (!nodeData.formConfiguration || Object.keys(nodeData.formConfiguration).length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        No form fields configured
      </div>
    );
  }

  // Check if we have widgets in the form configuration
  const widgets = (nodeData.formConfiguration as any)?.widgets;
  if (!widgets || !Array.isArray(widgets) || widgets.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        No form fields configured
      </div>
    );
  }

  // Pass the loaded widgets to the children function
  return <>{children(widgets)}</>;
}
