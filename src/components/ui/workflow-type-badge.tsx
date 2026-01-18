"use client";

import { cn } from "@/lib/utils";
import { WorkflowType, WORKFLOW_TYPE_LABELS, WORKFLOW_TYPE_DESCRIPTIONS } from "@/types/common/constants";
import { IconRefresh, IconApi } from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WorkflowTypeBadgeProps {
  workflowType: WorkflowType;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showTooltip?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

const iconSizes = {
  sm: 12,
  md: 14,
  lg: 16,
};

const typeStyles: Record<WorkflowType, { bg: string; text: string; border: string }> = {
  [WorkflowType.PRODUCTION]: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
  },
  [WorkflowType.API]: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
  },
};

const TypeIcon: React.FC<{ type: WorkflowType; size: number }> = ({ type, size }) => {
  switch (type) {
    case WorkflowType.PRODUCTION:
      return <IconRefresh size={size} />;
    case WorkflowType.API:
      return <IconApi size={size} />;
    default:
      return null;
  }
};

export function WorkflowTypeBadge({
  workflowType,
  size = "md",
  showIcon = true,
  showTooltip = true,
  className,
}: WorkflowTypeBadgeProps) {
  const style = typeStyles[workflowType];
  const label = WORKFLOW_TYPE_LABELS[workflowType];
  const description = WORKFLOW_TYPE_DESCRIPTIONS[workflowType];

  const badge = (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md font-medium border",
        sizeClasses[size],
        style.bg,
        style.text,
        style.border,
        className
      )}
    >
      {showIcon && <TypeIcon type={workflowType} size={iconSizes[size]} />}
      {label}
    </span>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
