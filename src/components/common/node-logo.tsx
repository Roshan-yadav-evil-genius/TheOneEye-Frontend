"use client";

import React from "react";
import { IconPhotoOff } from "@tabler/icons-react";
import { BackendNodeType } from "@/types/api/backend";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { getNodeColors } from "@/constants/node-styles";
import { getSizeConfig, type SizeVariant } from "@/lib/size-config";

interface NodeLogoProps {
  node: BackendNodeType;
  size?: SizeVariant;
  className?: string;
}

export function NodeLogo({ node, size = "md", className = "" }: NodeLogoProps) {
  const { iconColorClass } = getNodeColors(node.type);
  const { container, icon, dimensions } = getSizeConfig(size);

  // Helper functions to safely access node group information
  const getNodeGroupIcon = () => {
    return node.node_group?.icon || null;
  };

  const getNodeGroupName = () => {
    return node.node_group?.name || 'Group';
  };

  const getGroupIcon = () => {
    const groupIcon = getNodeGroupIcon();
    if (groupIcon) {
      return (
        <ImageWithFallback
          src={groupIcon}
          alt={`${getNodeGroupName()} group icon`}
          width={dimensions}
          height={dimensions}
          className={`${container} object-cover rounded`}
          fallbackIconColor={iconColorClass}
          fallbackIcon={
            <div className={`${container} flex items-center justify-center`}>
              <IconPhotoOff className={`${icon} ${iconColorClass}`} />
            </div>
          }
        />
      );
    }
    return (
      <div className={`${container} flex items-center justify-center`}>
        <IconPhotoOff className={`${icon} ${iconColorClass}`} />
      </div>
    );
  };

  // Three-tier fallback: node logo → group icon → photo off icon
  if (node.logo) {
    return (
      <ImageWithFallback
        src={node.logo}
        alt={`${node.name} logo`}
        width={dimensions}
        height={dimensions}
        className={`${container} object-cover rounded ${className}`}
        fallbackIconColor={iconColorClass}
        fallbackIcon={getGroupIcon()}
      />
    );
  }

  // If no node logo, try group icon
  const groupIcon = getNodeGroupIcon();
  if (groupIcon) {
    return (
      <ImageWithFallback
        src={groupIcon}
        alt={`${getNodeGroupName()} group icon`}
        width={dimensions}
        height={dimensions}
        className={`${container} object-cover rounded ${className}`}
        fallbackIconColor={iconColorClass}
        fallbackIcon={
          <div className={`${container} flex items-center justify-center`}>
            <IconPhotoOff className={`${icon} ${iconColorClass}`} />
          </div>
        }
      />
    );
  }

  // Final fallback: show photo off icon
  return (
    <div className={`${container} flex items-center justify-center ${className}`}>
      <IconPhotoOff className={`${icon} ${iconColorClass}`} />
    </div>
  );
}
