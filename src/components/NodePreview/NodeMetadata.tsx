"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Node } from "@/data/nodes";
import { getNodeColors } from "@/constants/node-styles";

interface NodeMetadataProps {
  nodeData: Partial<Node>;
}

export function NodeMetadata({ nodeData }: NodeMetadataProps) {
  const { colorClass, iconColorClass } = getNodeColors(nodeData.type || "system");
  
  return (
    <div className="flex flex-col items-end gap-1 text-right">
          <Badge variant="outline" className={`px-2 py-1 ${colorClass} ${iconColorClass}`}>
            {nodeData.type ? nodeData.type.charAt(0).toUpperCase() + nodeData.type.slice(1) : "Action"}
          </Badge>
          <Badge variant="outline" className="px-2 py-1">
            {nodeData.category ? nodeData.category.charAt(0).toUpperCase() + nodeData.category.slice(1) : "System"}
          </Badge>
    </div>
  );
}
