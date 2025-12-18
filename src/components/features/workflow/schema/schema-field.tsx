"use client";

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { SchemaField as SchemaFieldType, SchemaFieldProps } from './types';
import { getTypeIcon } from './utils';

/**
 * Draggable key component - only rendered when drag is enabled
 */
interface DraggableKeyProps {
  field: SchemaFieldType;
}

function DraggableKey({ field }: DraggableKeyProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `key-${field.path}`,
    data: {
      type: 'field',
      key: field.key,
      path: field.path,
      fieldType: field.type
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleDragStart = (e: React.DragEvent) => {
    // Create a custom drag preview showing only the key name
    const dragPreview = document.createElement('div');
    dragPreview.style.cssText = `
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 14px;
      border: 1px solid #374151;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    `;
    
    // Show only the key name
    dragPreview.textContent = field.key;
    
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 0, 0);
    
    // Clean up the preview element after a short delay
    setTimeout(() => {
      if (document.body.contains(dragPreview)) {
        document.body.removeChild(dragPreview);
      }
    }, 0);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onDragStart={handleDragStart}
      {...listeners}
      {...attributes}
      className={`
        inline-block px-2 py-1 rounded text-xs font-mono
        bg-blue-600/20 text-blue-300 border border-blue-500/30
        hover:bg-blue-600/30 cursor-grab select-none
        ${isDragging ? 'opacity-50 cursor-grabbing' : ''}
        transition-colors
      `}
    >
      {field.key}
    </div>
  );
}

/**
 * Non-draggable key component - rendered when drag is disabled
 */
interface NonDraggableKeyProps {
  field: SchemaFieldType;
}

function NonDraggableKey({ field }: NonDraggableKeyProps) {
  return (
    <span className="px-2 py-1 rounded text-xs font-mono bg-gray-600/20 text-gray-300 border border-gray-500/30">
      {field.key}
    </span>
  );
}

/**
 * Unified SchemaField component that supports both draggable and non-draggable modes
 */
export function SchemaField({ 
  field, 
  level, 
  isExpanded, 
  onToggle, 
  wordWrap = false,
  enableDrag = false 
}: SchemaFieldProps) {
  const handleClick = (e: React.MouseEvent) => {
    // If clicking on expand button, let it handle the click
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    // Toggle expand/collapse for objects and arrays
    if (field.children && field.children.length > 0) {
      onToggle();
    }
  };

  const hasChildren = field.children && field.children.length > 0;
  const isExpandable = hasChildren && (field.type === 'object' || field.type === 'array');

  return (
    <div
      style={{ marginLeft: `${level * 16}px` }}
      onClick={handleClick}
      className={`group flex ${wordWrap ? 'items-start' : 'items-center'} gap-2 py-1 px-2 rounded hover:bg-gray-700/30 transition-colors`}
    >
      {isExpandable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onToggle();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="flex items-center justify-center w-4 h-4 hover:bg-gray-600 rounded flex-shrink-0"
        >
          {isExpanded ? (
            <ChevronDown className="w-3 h-3 text-gray-300" />
          ) : (
            <ChevronRight className="w-3 h-3 text-gray-300" />
          )}
        </button>
      )}
      
      {!isExpandable && <div className="w-4 flex-shrink-0" />}
      
      <div className="flex-shrink-0">{getTypeIcon(field.type)}</div>
      <div className={`flex ${wordWrap ? 'flex-col items-start gap-1' : 'items-center justify-between'} w-full min-w-0`}>
        <div className="flex items-center gap-2 flex-shrink-0">
          {enableDrag ? <DraggableKey field={field} /> : <NonDraggableKey field={field} />}
        </div>
        {field.type !== 'object' && field.type !== 'array' && field.value !== undefined && (
          <span className={`text-gray-400 font-mono text-sm ${wordWrap ? 'break-all' : 'truncate'}`}>
            {typeof field.value === 'string' ? `"${field.value}"` : JSON.stringify(field.value)}
          </span>
        )}
      </div>
    </div>
  );
}

