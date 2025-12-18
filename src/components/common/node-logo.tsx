"use client";

import React from "react";
import { IconCube } from "@tabler/icons-react";
import { getNodeColors } from "@/constants/node-styles";
import { getSizeConfig, type SizeVariant } from "@/lib/size-config";

interface NodeLogoProps {
  node: {
    name?: string;
    type?: string;
  };
  size?: SizeVariant;
  className?: string;
}

export function NodeLogo({ node, size = "md", className = "" }: NodeLogoProps) {
  const { iconColorClass } = getNodeColors(node.type || 'unknown');
  const { container, icon } = getSizeConfig(size);

  return (
    <div className={`${container} flex items-center justify-center ${className}`}>
      <IconCube className={`${icon} ${iconColorClass}`} />
    </div>
  );
}
