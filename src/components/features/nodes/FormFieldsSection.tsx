"use client";

import React from "react";
import { BackendNodeType } from "@/types/api/backend";
import { WidgetLoader } from "./WidgetLoader";
import { WidgetMapper } from "./WidgetMapper";



interface FormFieldsSectionProps {
  node_type: BackendNodeType;
}

export function FormFieldsSection({ node_type }: FormFieldsSectionProps) {
  return (
    <div>
      <WidgetLoader node_type={node_type}>
        {(widgets) => <WidgetMapper widgets={widgets} />}
      </WidgetLoader>
    </div>
  );
}
