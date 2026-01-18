"use client";

import React from 'react';
import { TNodeMetadata } from '@/types';
import { cn } from '@/lib/utils';
import { getBadgeStyles } from '@/constants/node-styles';
import { NodeLogo } from '@/components/common/node-logo';
import { WorkflowType } from '@/types/common/constants';
import { isNodeCompatibleWithWorkflowType, getNodeCompatibilityMessage } from '@/lib/utils/node-compatibility';
import { IconAlertTriangle } from '@tabler/icons-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DraggableNodeItemProps {
  node: TNodeMetadata;
  workflowType?: WorkflowType;
  className?: string;
}

/**
 * A draggable node item that can be dropped onto the workflow canvas
 */
export function DraggableNodeItem({ node, workflowType, className }: DraggableNodeItemProps) {
  // Check compatibility if workflow type is provided
  const isCompatible = workflowType 
    ? isNodeCompatibleWithWorkflowType(node, workflowType)
    : true;
  const compatibilityMessage = workflowType
    ? getNodeCompatibilityMessage(node, workflowType)
    : '';

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    // Prevent drag if incompatible
    if (!isCompatible) {
      event.preventDefault();
      return;
    }
    // Set the drag data as JSON for the reactflow drop handler
    event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
    event.dataTransfer.effectAllowed = 'move';
  };

  const displayName = node.label || node.name;
  const badgeStyle = getBadgeStyles(node.type);

  const nodeContent = (
    <div
      draggable={isCompatible}
      onDragStart={handleDragStart}
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg',
        'transition-all duration-150',
        'border shadow-sm',
        isCompatible ? [
          'cursor-grab active:cursor-grabbing',
          'bg-card/50 hover:bg-card',
          'border-border/30 hover:border-border/60',
          'hover:shadow-md',
        ] : [
          'cursor-not-allowed',
          'bg-muted/30',
          'border-border/20',
          'opacity-60',
        ],
        className
      )}
      title={isCompatible ? (node.description || displayName) : compatibilityMessage}
    >
      {/* Left Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <div className={cn(
          "w-8 h-8 rounded-md flex items-center justify-center",
          isCompatible ? "bg-primary/10" : "bg-muted"
        )}>
          <NodeLogo node={node} size="md" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Top row: Name + Type Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className={cn(
            "text-sm font-medium truncate flex-1",
            isCompatible ? "text-foreground" : "text-muted-foreground"
          )}>
            {displayName}
          </div>
          {/* Incompatibility Indicator */}
          {!isCompatible && (
            <IconAlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
          )}
          {/* Type Badge */}
          <span
            className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border flex-shrink-0',
              badgeStyle.bg,
              badgeStyle.text,
              !isCompatible && 'opacity-60'
            )}
          >
            {node.type}
          </span>
        </div>
        {/* Identifier */}
        <div className="text-xs text-muted-foreground truncate mt-0.5">
          {node.identifier}
        </div>
      </div>
    </div>
  );

  // Wrap in tooltip if incompatible
  if (!isCompatible) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{nodeContent}</TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <p className="font-medium text-amber-500">Incompatible Node</p>
            <p className="text-xs text-muted-foreground">{compatibilityMessage}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return nodeContent;
}
