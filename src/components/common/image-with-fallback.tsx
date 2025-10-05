"use client";

import { useState } from "react";
import Image from "next/image";
import { IconPhotoOff } from "@tabler/icons-react";

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackIcon?: React.ReactNode;
  secondaryFallbackIcon?: React.ReactNode;
  fallbackIconColor?: string;
  onError?: () => void;
}

export function ImageWithFallback({
  src,
  alt,
  width = 32,
  height = 32,
  className = "",
  fallbackIcon,
  secondaryFallbackIcon,
  fallbackIconColor = "text-muted-foreground",
  onError,
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  // If no src or image failed to load, show fallback
  if (!src || imageError) {
    // If fallback icon also failed to load, show secondary fallback or no icon
    if (fallbackError && secondaryFallbackIcon) {
      return (
        <div className={`flex items-center justify-center ${className}`}>
          {secondaryFallbackIcon}
        </div>
      );
    }
    
    // Show primary fallback or no icon
    return (
      <div className={`flex items-center justify-center ${className}`}>
        {fallbackIcon || <IconPhotoOff className={`h-5 w-5 ${fallbackIconColor}`} />}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => {
        setImageError(true);
        onError?.();
      }}
    />
  );
}
