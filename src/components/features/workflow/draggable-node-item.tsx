"use client";

import React from 'react';
import { TNodeMetadata } from '@/types';
import { IconGripVertical } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface DraggableNodeItemProps {
  node: TNodeMetadata;
  className?: string;
}

/**
 * Get icon color based on node type
 */
function getNodeTypeColor(type: string): string {
  switch (type) {
    case 'trigger':
      return 'text-blue-400';
    case 'action':
      return 'text-emerald-400';
    case 'logic':
      return 'text-violet-400';
    case 'iterator':
      return 'text-amber-400';
    case 'crawler':
      return 'text-cyan-400';
    default:
      return 'text-muted-foreground';
  }
}

/**
 * Get background color based on node type
 */
function getNodeTypeBg(type: string): string {
  switch (type) {
    case 'trigger':
      return 'bg-blue-500/10 hover:bg-blue-500/20';
    case 'action':
      return 'bg-emerald-500/10 hover:bg-emerald-500/20';
    case 'logic':
      return 'bg-violet-500/10 hover:bg-violet-500/20';
    case 'iterator':
      return 'bg-amber-500/10 hover:bg-amber-500/20';
    case 'crawler':
      return 'bg-cyan-500/10 hover:bg-cyan-500/20';
    default:
      return 'bg-muted/50 hover:bg-muted';
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
  const typeColor = getNodeTypeColor(node.type);
  const typeBg = getNodeTypeBg(node.type);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-md cursor-grab active:cursor-grabbing',
        'transition-colors duration-150',
        'border border-transparent hover:border-border/50',
        typeBg,
        className
      )}
      title={node.description || displayName}
    >
      <IconGripVertical 
        size={14} 
        className="text-muted-foreground/50 flex-shrink-0" 
      />
      <span className={cn('text-sm font-medium truncate', typeColor)}>
        {displayName}
      </span>
    </div>
  );
}

