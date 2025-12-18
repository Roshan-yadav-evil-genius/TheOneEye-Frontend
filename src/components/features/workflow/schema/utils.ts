import React from 'react';
import { Hash, Type, Folder, FileText } from 'lucide-react';
import { SchemaField } from './types';

/**
 * Returns the appropriate icon component for a given field type
 */
export function getTypeIcon(type: string): React.ReactNode {
  switch (type) {
    case 'number':
      return React.createElement(Hash, { className: "w-3 h-3 text-blue-400" });
    case 'string':
      return React.createElement(Type, { className: "w-3 h-3 text-green-400" });
    case 'boolean':
      return React.createElement(Hash, { className: "w-3 h-3 text-blue-400" });
    case 'object':
      return React.createElement(Folder, { className: "w-3 h-3 text-purple-400" });
    case 'array':
      return React.createElement(FileText, { className: "w-3 h-3 text-purple-400" });
    default:
      return React.createElement(Type, { className: "w-3 h-3 text-gray-400" });
  }
}

/**
 * Parses JSON data into a hierarchical schema field structure
 */
export function parseJsonToSchema(
  data: unknown,
  key: string = '',
  path: string = ''
): SchemaField[] {
  if (Array.isArray(data)) {
    return data.map((item, index) => {
      const arrayPath = path ? `${path}[${index}]` : `[${index}]`;
      return {
        key: `[${index}]`,
        type: 'object' as const,
        path: arrayPath,
        children: parseJsonToSchema(item, `[${index}]`, arrayPath)
      };
    });
  } else if (data && typeof data === 'object') {
    return Object.entries(data).map(([k, v]) => {
      const currentPath = path ? `${path}.${k}` : k;
      const field: SchemaField = {
        key: k,
        type: Array.isArray(v) ? 'array' : typeof v as 'string' | 'number' | 'boolean' | 'object',
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
      type: typeof data as 'string' | 'number' | 'boolean' | 'object',
      value: data,
      path: path || key
    }];
  }
}

/**
 * Counts the total number of items in a schema field tree recursively
 */
export function getTotalItems(fields: SchemaField[]): number {
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
}

