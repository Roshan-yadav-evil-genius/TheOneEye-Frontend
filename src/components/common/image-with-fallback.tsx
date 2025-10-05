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
  onError?: () => void;
}

export function ImageWithFallback({
  src,
  alt,
  width = 32,
  height = 32,
  className = "",
  fallbackIcon,
  onError,
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);

  // If no src or image failed to load, show fallback
  if (!src || imageError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        {fallbackIcon || <IconPhotoOff className="h-4 w-4 text-muted-foreground" />}
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
