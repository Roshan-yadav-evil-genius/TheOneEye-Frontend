import React from "react";
import { NodeLogo } from "@/components/common/node-logo";

// Utility function to render node logo
export const renderNodeLogo = (node: { name?: string; type?: string }) => {
  return <NodeLogo node={node} size="md" />;
};
