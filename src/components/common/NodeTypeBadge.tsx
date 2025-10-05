import React from "react";
import { Badge } from "@/components/ui/badge";
import { getNodeColors } from "@/constants/node-styles";

interface NodeTypeBadgeProps {
  type: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

export function NodeTypeBadge({ 
  type, 
  variant = "outline", 
  className = "" 
}: NodeTypeBadgeProps) {
  const { colorClass, iconColorClass } = getNodeColors(type);
  
  return (
    <Badge 
      variant={variant} 
      className={`${colorClass} ${iconColorClass} ${className}`}
    >
      {type}
    </Badge>
  );
}
