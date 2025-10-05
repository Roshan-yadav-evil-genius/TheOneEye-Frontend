"use client";

import React, { memo } from "react";
import { IconPhotoOff } from "@tabler/icons-react";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { iconColors } from "@/constants/node-styles";

interface NodeIconProps {
  logo?: string;
  nodeGroupIcon?: string;
  nodeGroupName?: string;
  type?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

type IconSize = "sm" | "md" | "lg";

const SIZE_CONFIG = {
  sm: { container: "h-4 w-4", icon: "h-3 w-3", dimensions: 16 },
  md: { container: "h-8 w-8", icon: "h-4 w-4", dimensions: 32 },
  lg: { container: "h-10 w-10", icon: "h-5 w-5", dimensions: 40 },
} as const;

export const NodeIcon = memo(function NodeIcon({ 
  logo, 
  nodeGroupIcon, 
  nodeGroupName, 
  type,
  size = "md", 
  className = "" 
}: NodeIconProps) {
  const config = SIZE_CONFIG[size as IconSize];
  const typeColor = type ? iconColors[type as keyof typeof iconColors] || iconColors.system : iconColors.system;
  
  // Create fallback icon component
  const createFallbackIcon = () => (
    <div className={`${config.container} flex items-center justify-center`}>
      <IconPhotoOff className={`${config.icon} ${typeColor}`} />
    </div>
  );

  // Create ImageWithFallback component with consistent props
  const createImageComponent = (src: string, alt: string, fallbackIcon: React.ReactNode) => (
    <ImageWithFallback
      src={src}
      alt={alt}
      width={config.dimensions}
      height={config.dimensions}
      className={`${config.container} object-cover rounded ${className}`}
      fallbackIcon={fallbackIcon}
      fallbackIconColor={typeColor}
    />
  );

  // Two-tier fallback: node logo → group icon → IconPhotoOff
  if (logo) {
    return createImageComponent(
      logo,
      "Node logo",
      nodeGroupIcon 
        ? createImageComponent(
            nodeGroupIcon,
            `${nodeGroupName || 'Group'} icon`,
            createFallbackIcon()
          )
        : createFallbackIcon()
    );
  }

  // If no node logo, try group icon
  if (nodeGroupIcon) {
    return createImageComponent(
      nodeGroupIcon,
      `${nodeGroupName || 'Group'} icon`,
      createFallbackIcon()
    );
  }

  // Final fallback: show IconPhotoOff
  return (
    <div className={`${config.container} flex items-center justify-center ${className}`}>
      <IconPhotoOff className={`${config.icon} ${typeColor}`} />
    </div>
  );
});

NodeIcon.displayName = 'NodeIcon';
