"use client";

import React, { useState, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ChevronRight, ChevronDown, Hash, Type, Folder, FileText, GripVertical } from 'lucide-react';

interface SchemaField {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  value?: any;
  children?: SchemaField[];
  path: string;
}

interface DraggableFieldProps {
  field: SchemaField;
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function DraggableField({ field, level, isExpanded, onToggle }: DraggableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: field.path,
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'number':
        return <Hash className="w-3 h-3 text-blue-400" />;
      case 'string':
        return <Type className="w-3 h-3 text-green-400" />;
      case 'boolean':
        return <Hash className="w-3 h-3 text-blue-400" />;
      case 'object':
        return <Folder className="w-3 h-3 text-purple-400" />;
      case 'array':
        return <FileText className="w-3 h-3 text-purple-400" />;
      default:
        return <Type className="w-3 h-3 text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'number':
        return 'text-white';
      case 'string':
        return 'text-white';
      case 'boolean':
        return 'text-white';
      case 'object':
        return 'text-white';
      case 'array':
        return 'text-white';
      default:
        return 'text-white';
    }
  };

  const hasChildren = field.children && field.children.length > 0;
  const isExpandable = hasChildren && (field.type === 'object' || field.type === 'array');

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, marginLeft: `${level * 16}px` }}
      onClick={handleClick}
      {...listeners}
      {...attributes}
      className={`
        group flex items-center gap-2 py-1 px-2 rounded
        hover:bg-gray-700/30 transition-colors select-none
        ${isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab'}
      `}
    >
      {isExpandable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onToggle();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="flex items-center justify-center w-4 h-4 hover:bg-gray-600 rounded"
        >
          {isExpanded ? (
            <ChevronDown className="w-3 h-3 text-gray-300" />
          ) : (
            <ChevronRight className="w-3 h-3 text-gray-300" />
          )}
        </button>
      )}
      
      {!isExpandable && <div className="w-4" />}
      
      {getTypeIcon(field.type)}
      <div className="flex items-center justify-between w-full">
        <span className={`font-mono text-sm ${getTypeColor(field.type)}`}>
          {field.key}
        </span>
        {field.type !== 'object' && field.type !== 'array' && field.value !== undefined && (
          <span className="text-gray-400 font-mono text-sm">
            {typeof field.value === 'string' ? `"${field.value}"` : field.value}
          </span>
        )}
      </div>
    </div>
  );
}

interface DraggableSchemaProps {
  jsonData: any;
  title: string;
}

export function DraggableSchema({ jsonData, title }: DraggableSchemaProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['[0]', '[1]']));

  const parseJsonToSchema = (data: any, key: string = '', path: string = ''): SchemaField[] => {
    if (Array.isArray(data)) {
      return data.map((item, index) => {
        const arrayPath = path ? `${path}[${index}]` : `[${index}]`;
        return {
          key: `[${index}]`,
          type: 'object',
          path: arrayPath,
          children: parseJsonToSchema(item, `[${index}]`, arrayPath)
        };
      });
    } else if (data && typeof data === 'object') {
      return Object.entries(data).map(([k, v]) => {
        const currentPath = path ? `${path}.${k}` : k;
        const field: SchemaField = {
          key: k,
          type: Array.isArray(v) ? 'array' : typeof v as any,
          path: currentPath,
          value: v
        };

        if (v && typeof v === 'object' && !Array.isArray(v)) {
          field.children = parseJsonToSchema(v, k, currentPath);
        } else if (Array.isArray(v)) {
          field.children = parseJsonToSchema(v, k, currentPath);
        }

        return field;
      });
    } else {
      return [{
        key,
        type: typeof data as any,
        value: data,
        path: path || key
      }];
    }
  };

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const renderFields = (fields: SchemaField[], level: number = 0): React.ReactNode => {
    return fields.map((field) => {
      const isExpanded = expandedPaths.has(field.path);
      const hasChildren = field.children && field.children.length > 0;

      return (
        <div key={field.path} className="mb-1">
          <DraggableField
            field={field}
            level={level}
            isExpanded={isExpanded}
            onToggle={() => toggleExpanded(field.path)}
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

  const getTotalItems = (fields: SchemaField[]): number => {
    let count = 0;
    const countRecursive = (fieldList: SchemaField[]) => {
      fieldList.forEach(field => {
        count++;
        if (field.children) {
          countRecursive(field.children);
        }
      });
    };
    countRecursive(fields);
    return count;
  };

  const totalItems = getTotalItems(schemaFields);

  return (
    <div className="h-full overflow-auto p-4">
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
