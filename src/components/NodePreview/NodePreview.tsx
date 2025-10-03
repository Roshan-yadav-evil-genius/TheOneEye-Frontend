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
      <Card className="shadow-lg border-border/50">
        <CardHeader className="pb-6">
          <div className="flex items-start justify-between">
            {/* Top-left: Logo, name with info button */}
            <NodeHeader nodeData={nodeData} logoPreview={logoPreview} />

            {/* Top-right: Type, category */}
            <NodeMetadata nodeData={nodeData} />
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8"></div>
          
          {/* Form Fields Section */}
          <FormFieldsSection nodeData={nodeData} />
        </CardContent>
      </Card>
    </div>
  );
}
