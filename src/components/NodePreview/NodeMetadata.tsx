"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Node } from "@/data/nodes";

interface NodeMetadataProps {
  nodeData: Partial<Node>;
}

export function NodeMetadata({ nodeData }: NodeMetadataProps) {
  return (
    <div className="flex flex-col items-end gap-3 text-right">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Type:</span>
          <Badge variant="outline" className="px-3 py-1">
            {nodeData.type ? nodeData.type.charAt(0).toUpperCase() + nodeData.type.slice(1) : "Action"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Category:</span>
          <Badge variant="outline" className="px-3 py-1">
            {nodeData.category ? nodeData.category.charAt(0).toUpperCase() + nodeData.category.slice(1) : "System"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
