"use client";

import React from "react";
import { IconPhotoOff } from "@tabler/icons-react";
import { TNode } from "@/types";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { getNodeColors } from "@/constants/node-styles";

interface NodeLogoProps {
  node: TNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8", 
  lg: "h-10 w-10"
};

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5"
};

export function NodeLogo({ node, size = "md", className = "" }: NodeLogoProps) {
  const { iconColorClass } = getNodeColors(node.type);
  
  const getNodeIcon = (type: string) => {
    const nodeIcons = {
      trigger: "🕐", // IconClock equivalent
      action: "⚙️",  // IconSettings equivalent  
      logic: "✅",   // IconCheck equivalent
      system: "🗄️", // IconDatabase equivalent
    };
    return nodeIcons[type as keyof typeof nodeIcons] || "⚙️";
  };

  const getGroupIcon = () => {
    if (node.nodeGroupIcon) {
      return (
        <ImageWithFallback
          src={node.nodeGroupIcon}
          alt={`${node.nodeGroupName} group icon`}
          width={size === "sm" ? 16 : size === "md" ? 32 : 40}
          height={size === "sm" ? 16 : size === "md" ? 32 : 40}
          className={`${sizeClasses[size]} object-cover rounded`}
          fallbackIcon={
            <div className={`${sizeClasses[size]} flex items-center justify-center`}>
              <IconPhotoOff className={`${iconSizes[size]} text-muted-foreground`} />
            </div>
          }
        />
      );
    }
    return (
      <div className={`${sizeClasses[size]} flex items-center justify-center`}>
        <IconPhotoOff className={`${iconSizes[size]} text-muted-foreground`} />
      </div>
    );
  };

  // Three-tier fallback: node logo → group icon → photo off icon
  if (node.logo) {
    return (
      <ImageWithFallback
        src={node.logo}
        alt={`${node.name} logo`}
        width={size === "sm" ? 16 : size === "md" ? 32 : 40}
        height={size === "sm" ? 16 : size === "md" ? 32 : 40}
        className={`${sizeClasses[size]} object-cover rounded ${className}`}
        fallbackIcon={getGroupIcon()}
      />
    );
  }

  // If no node logo, try group icon
  if (node.nodeGroupIcon) {
    return (
      <ImageWithFallback
        src={node.nodeGroupIcon}
        alt={`${node.nodeGroupName} group icon`}
        width={size === "sm" ? 16 : size === "md" ? 32 : 40}
        height={size === "sm" ? 16 : size === "md" ? 32 : 40}
        className={`${sizeClasses[size]} object-cover rounded ${className}`}
        fallbackIcon={
          <div className={`${sizeClasses[size]} flex items-center justify-center`}>
            <IconPhotoOff className={`${iconSizes[size]} text-muted-foreground`} />
          </div>
        }
      />
    );
  }

  // Final fallback: show photo off icon
  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center ${className}`}>
      <IconPhotoOff className={`${iconSizes[size]} text-muted-foreground`} />
    </div>
  );
}
