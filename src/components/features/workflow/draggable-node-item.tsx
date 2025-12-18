"use client";

import React from 'react';
import { TNodeMetadata } from '@/types';
import { IconCube } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface DraggableNodeItemProps {
  node: TNodeMetadata;
  className?: string;
}

/**
 * Get badge styles based on node type (matching nodes table colors)
 */
function getTypeBadgeStyles(type: string): { bg: string; text: string } {
  switch (type) {
    case 'BlockingNode':
      return { bg: 'bg-pink-500/20 border-pink-500/50', text: 'text-pink-400' };
    case 'NonBlockingNode':
      return { bg: 'bg-cyan-500/20 border-cyan-500/50', text: 'text-cyan-400' };
    case 'QueueNode':
      return { bg: 'bg-zinc-600/30 border-zinc-500/50', text: 'text-zinc-300' };
    case 'QueueReader':
      return { bg: 'bg-zinc-600/30 border-zinc-500/50', text: 'text-zinc-300' };
    default:
      return { bg: 'bg-zinc-600/30 border-zinc-500/50', text: 'text-zinc-400' };
  }
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
  const badgeStyles = getTypeBadgeStyles(node.type);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={cn(
        'relative flex items-start gap-3 p-3 rounded-lg cursor-grab active:cursor-grabbing',
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
      <div className="flex-1 min-w-0 pr-16">
        {/* Node Name */}
        <div className="text-sm font-medium text-foreground truncate">
          {displayName}
        </div>
        {/* Identifier */}
        <div className="text-xs text-muted-foreground truncate mt-0.5">
          {node.identifier}
        </div>
      </div>

      {/* Type Badge - Top Right */}
      <div className="absolute top-2 right-2">
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border',
            badgeStyles.bg,
            badgeStyles.text
          )}
        >
          {node.type}
        </span>
      </div>
    </div>
  );
}
