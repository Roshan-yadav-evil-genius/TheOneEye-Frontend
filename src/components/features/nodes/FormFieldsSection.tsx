"use client";

import React from "react";
import { TNode } from "@/types";
import { WidgetLoader } from "./WidgetLoader";
import { WidgetMapper } from "./WidgetMapper";

interface FormFieldsSectionProps {
  nodeData: Partial<TNode>;
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
