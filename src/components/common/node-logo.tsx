"use client";

import React, { useState } from "react";
import { IconCube } from "@tabler/icons-react";
import { getNodeColors } from "@/constants/node-styles";
import { getSizeConfig, type SizeVariant } from "@/lib/size-config";

// Backend URL for node icons (dedicated endpoint, not Django static)
const BACKEND_STATIC_URL = "http://127.0.0.1:7878/node-icons";

interface NodeLogoProps {
  node: {
    name?: string;
    type?: string;
    icon?: string;  // Auto-discovered icon path (e.g., "Store/icon.png")
  };
  size?: SizeVariant;
  className?: string;
}

export function NodeLogo({ node, size = "md", className = "" }: NodeLogoProps) {
  const [imageError, setImageError] = useState(false);
  const { iconColorClass } = getNodeColors(node.type || 'unknown');
  const { container, icon, dimensions } = getSizeConfig(size);

  // Check if we have a valid icon path and image hasn't errored
  const hasValidIcon = node.icon && !imageError;

  // Handle image load error - fallback to default icon
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`${container} flex items-center justify-center ${className}`}>
      {hasValidIcon ? (
        <img
          src={`${BACKEND_STATIC_URL}/${node.icon}`}
          alt={node.name || "Node icon"}
          width={dimensions}
          height={dimensions}
          className="object-contain"
          onError={handleImageError}
        />
      ) : (
        <IconCube className={`${icon} ${iconColorClass}`} />
      )}
    </div>
  );
}
