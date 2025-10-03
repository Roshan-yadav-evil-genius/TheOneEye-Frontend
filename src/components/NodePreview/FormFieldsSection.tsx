"use client";

import React from "react";
import { Node } from "@/data/nodes";
import { WidgetLoader } from "./WidgetLoader";
import { WidgetMapper } from "./WidgetMapper";

interface FormFieldsSectionProps {
  nodeData: Partial<Node>;
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
