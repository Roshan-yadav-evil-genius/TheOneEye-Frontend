"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { IconPhotoOff } from "@tabler/icons-react";
import { TNode } from "@/types";
import { getNodeColors } from "@/constants/node-styles";

interface NodeMetadataProps {
  nodeData: Partial<TNode>;
}

export function NodeMetadata({ nodeData }: NodeMetadataProps) {
  const { colorClass, iconColorClass } = getNodeColors(nodeData.type || "system");
  
  return (
    <div className="flex flex-col items-end gap-1 text-right">
      <Badge variant="outline" className={`px-2 py-1 ${colorClass} ${iconColorClass}`}>
        {nodeData.type ? nodeData.type.charAt(0).toUpperCase() + nodeData.type.slice(1) : "Action"}
      </Badge>
      <Badge variant="outline" className="px-2 py-1 flex items-center gap-1">
        <IconPhotoOff className="h-3 w-3" />
        {nodeData.category ? nodeData.category.charAt(0).toUpperCase() + nodeData.category.slice(1) : "System"}
      </Badge>
    </div>
  );
}
