"use client";

import { SchemaTree } from './schema';

interface DraggableSchemaProps {
  jsonData: unknown;
  title: string;
  wordWrap?: boolean;
}

/**
 * DraggableSchema component - a thin wrapper around SchemaTree with drag enabled
 */
export function DraggableSchema({ jsonData, title, wordWrap = false }: DraggableSchemaProps) {
  return (
    <SchemaTree 
      jsonData={jsonData} 
      title={title} 
      wordWrap={wordWrap} 
      enableDrag={true} 
    />
  );
}
