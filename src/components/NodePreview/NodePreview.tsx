"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Node } from "@/data/nodes";
import { NodeHeader } from "./NodeHeader";
import { NodeMetadata } from "./NodeMetadata";
import { FormFieldsSection } from "./FormFieldsSection";

interface NodePreviewProps {
  nodeData: Partial<Node>;
  logoPreview?: string | null;
}

export function NodePreview({ nodeData, logoPreview }: NodePreviewProps) {
  return (
    <div className="max-w-5xl">
      <Card>
        <CardHeader className="">
          <div className="flex items-start justify-between">
            {/* Top-left: Logo, name with info button */}
            <NodeHeader nodeData={nodeData} logoPreview={logoPreview} />
            {/* Top-right: Type, category */}
            <NodeMetadata nodeData={nodeData} />
          </div>
        </CardHeader>

        <CardContent className="">
          <FormFieldsSection nodeData={nodeData} />
        </CardContent>
      </Card>
    </div>
  );
}
