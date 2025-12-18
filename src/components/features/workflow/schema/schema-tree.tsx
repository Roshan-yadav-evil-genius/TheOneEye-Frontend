"use client";

import React, { useState } from 'react';
import { useDndMonitor } from '@dnd-kit/core';
import { SchemaField as SchemaFieldType, SchemaTreeProps } from './types';
import { SchemaField } from './schema-field';
import { parseJsonToSchema, getTotalItems } from './utils';

/**
 * Schema tree component that renders a hierarchical view of JSON data
 * Supports optional drag-and-drop functionality via enableDrag prop
 */
export function SchemaTree({ jsonData, title, wordWrap = false, enableDrag = false }: SchemaTreeProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['[0]', '[1]']));
  const [isDragging, setIsDragging] = useState(false);

  // Monitor drag events to disable scroll during drag (only when drag is enabled)
  useDndMonitor({
    onDragStart: () => enableDrag && setIsDragging(true),
    onDragEnd: () => enableDrag && setIsDragging(false),
    onDragCancel: () => enableDrag && setIsDragging(false),
  });

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const renderFields = (fields: SchemaFieldType[], level: number = 0): React.ReactNode => {
    return fields.map((field) => {
      const isExpanded = expandedPaths.has(field.path);
      const hasChildren = field.children && field.children.length > 0;

      return (
        <div key={field.path} className="mb-1">
          <SchemaField
            field={field}
            level={level}
            isExpanded={isExpanded}
            onToggle={() => toggleExpanded(field.path)}
            wordWrap={wordWrap}
            enableDrag={enableDrag}
          />
          {hasChildren && isExpanded && (
            <div className="mt-1">
              {renderFields(field.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const schemaFields = parseJsonToSchema(jsonData, title, '');
  const totalItems = getTotalItems(schemaFields);

  // Apply overflow:hidden during drag to prevent scrolling issues
  const containerClassName = enableDrag && isDragging 
    ? 'h-full p-4 sidebar-scrollbar overflow-hidden'
    : 'h-full p-4 sidebar-scrollbar overflow-auto';

  return (
    <div className={containerClassName}>
      <div className="mb-3 text-gray-400 text-sm">
        {totalItems} items
      </div>
      <div className="space-y-0">
        {schemaFields.length > 0 ? (
          renderFields(schemaFields)
        ) : (
          <div className="text-gray-500 text-sm">No data available</div>
        )}
      </div>
    </div>
  );
}

