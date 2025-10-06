"use client";

import React from "react";
import { BackendNodeType } from "@/types/api/backend";
import { WidgetLoader } from "./WidgetLoader";
import { WidgetMapper } from "./WidgetMapper";

interface FormFieldsSectionProps {
  nodeData: Partial<BackendNodeType>;
}

export function FormFieldsSection({ nodeData }: FormFieldsSectionProps) {
  return (
    <div>
      <WidgetLoader nodeData={nodeData}>
        {(widgets) => <WidgetMapper widgets={widgets} />}
      </WidgetLoader>
    </div>
  );
}
