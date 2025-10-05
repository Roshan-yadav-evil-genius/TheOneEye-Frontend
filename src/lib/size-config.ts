// Size configuration utilities for consistent sizing across components

export type SizeVariant = "sm" | "md" | "lg";

export const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8", 
  lg: "h-10 w-10"
} as const;

export const iconSizes = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5"
} as const;

export const imageDimensions = {
  sm: 16,
  md: 32,
  lg: 40
} as const;

// Helper function to get size configuration
export const getSizeConfig = (size: SizeVariant) => ({
  container: sizeClasses[size],
  icon: iconSizes[size],
  dimensions: imageDimensions[size]
});
