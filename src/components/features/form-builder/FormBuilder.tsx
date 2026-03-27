"use client";

import React from "react";
import type { TWidgetConfig } from "./inputs";

type FormBuilderProps = {
  initialWidgets?: TWidgetConfig[];
  onFormChange?: (widgets: TWidgetConfig[]) => void;
  disabled?: boolean;
};

export default function FormBuilder({
  initialWidgets = [],
  onFormChange,
  disabled = false,
}: FormBuilderProps) {
  React.useEffect(() => {
    onFormChange?.(initialWidgets);
  }, [initialWidgets, onFormChange]);

  return (
    <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
      {disabled ? "Form builder is disabled." : "Form builder placeholder is active."}
    </div>
  );
}
