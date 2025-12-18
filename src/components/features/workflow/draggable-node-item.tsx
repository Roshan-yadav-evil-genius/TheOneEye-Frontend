"use client";

import React from 'react';
import { TNodeMetadata } from '@/types';
import { IconCube } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { getBadgeStyles } from '@/constants/node-styles';

interface DraggableNodeItemProps {
  node: TNodeMetadata;
  className?: string;
}

/**
 * A draggable node item that can be dropped onto the workflow canvas
 */
export function DraggableNodeItem({ node, className }: DraggableNodeItemProps) {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    // Set the drag data as JSON for the reactflow drop handler
    event.dataTransfer.setData('application/reactflow', JSON.stringify(node));
    event.dataTransfer.effectAllowed = 'move';
  };

  const displayName = node.label || node.name;
  const badgeStyle = getBadgeStyles(node.type);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg cursor-grab active:cursor-grabbing',
        'transition-all duration-150',
        'bg-card/50 hover:bg-card',
        'border border-border/30 hover:border-border/60',
        'shadow-sm hover:shadow-md',
        className
      )}
      title={node.description || displayName}
    >
      {/* Left Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
          <IconCube size={18} className="text-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Top row: Name + Type Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="text-sm font-medium text-foreground truncate flex-1">
            {displayName}
          </div>
          {/* Type Badge */}
          <span
            className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border flex-shrink-0',
              badgeStyle.bg,
              badgeStyle.text
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
}
