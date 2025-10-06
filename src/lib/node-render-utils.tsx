import React from "react";
import { IconPhotoOff } from "@tabler/icons-react";
import { BackendNodeType } from "@/types/api/backend";
import { NodeLogo } from "@/components/common/node-logo";
import { ImageWithFallback } from "@/components/common/image-with-fallback";

// Utility function to render node logo
export const renderNodeLogo = (node: BackendNodeType) => {
  return <NodeLogo node={node} size="md" />;
};

// Utility function to render node group icon
export const renderNodeGroupIcon = (node: BackendNodeType) => {
  return (
    <ImageWithFallback
      src={node.node_group?.icon}
      alt={node.node_group?.name || 'Group'}
      width={16}
      height={16}
      className="h-4 w-4 object-contain"
      fallbackIcon={<IconPhotoOff className="h-4 w-4 text-muted-foreground" />}
    />
  );
};
