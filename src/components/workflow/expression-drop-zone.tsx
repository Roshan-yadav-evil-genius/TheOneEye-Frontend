"use client";

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus, X } from 'lucide-react';

interface ExpressionDropZoneProps {
  expressions: string[];
  onRemoveExpression: (index: number) => void;
  className?: string;
}

export function ExpressionDropZone({ 
  expressions, 
  onRemoveExpression, 
  className = "" 
}: ExpressionDropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'expression-drop-zone',
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[200px] border-2 border-dashed rounded-lg p-4 transition-colors
        ${isOver 
          ? 'border-blue-400 bg-blue-400/10' 
          : 'border-gray-600 bg-gray-800/50'
        }
        ${className}
      `}
    >
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Plus className="w-4 h-4" />
          <span className="text-sm">Drop fields here to create expressions</span>
        </div>
      </div>
      
      <div className="space-y-2">
        {expressions.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            No expressions yet. Drag fields from the schema to create them.
          </div>
        ) : (
          expressions.map((expression, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-700 rounded px-3 py-2 group"
            >
              <code className="text-green-400 font-mono text-sm">
                {expression}
              </code>
              <button
                onClick={() => onRemoveExpression(index)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
