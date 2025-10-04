"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useDroppable, useDndMonitor } from '@dnd-kit/core';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { convertPathToExpression, isExpression, extractExpressions } from './expression-utils';

interface DroppableInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function DroppableInput({ 
  value, 
  onChange, 
  placeholder = "Field expression", 
  className,
  id 
}: DroppableInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { isOver, setNodeRef } = useDroppable({
    id: id || 'droppable-input',
    data: {
      type: 'input-field',
      accepts: ['field']
    }
  });

  // Check if the drag is exactly over the input field
  const [isOverInput, setIsOverInput] = useState(false);

  // Monitor drag events to handle drops
  useDndMonitor({
    onDragStart: (event) => {
      setIsOverInput(false);
    },
    onDragOver: (event) => {
      const { active, over } = event;
      if (over && over.id === (id || 'droppable-input')) {
        setIsOverInput(true);
      } else {
        setIsOverInput(false);
      }
    },
    onDragEnd: (event) => {
      const { active, over } = event;
      setIsOverInput(false);
      
      if (over && over.id === (id || 'droppable-input')) {
        const dragData = active.data.current;
        
        if (dragData && dragData.type === 'field') {
          // Convert the field path to expression syntax
          const expression = convertPathToExpression(dragData.path);
          
          // Insert at cursor position or replace selection
          const input = inputRef.current;
          if (input) {
            const start = input.selectionStart || 0;
            const end = input.selectionEnd || 0;
            const newValue = value.slice(0, start) + expression + value.slice(end);
            onChange(newValue);
            
            // Set cursor position after the inserted expression
            setTimeout(() => {
              const newCursorPos = start + expression.length;
              input.setSelectionRange(newCursorPos, newCursorPos);
              input.focus();
            }, 0);
          }
        }
      }
    }
  });

  // Remove the local convertPathToExpression function since we're importing it

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle special key combinations for expression building
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      // Could add auto-completion here
    }
  };

  // Check if the input contains expressions
  const expressions = extractExpressions(value);
  const hasExpressions = expressions.length > 0;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative w-full",
        isOverInput && "ring-2 ring-pink-500 ring-opacity-50"
      )}
    >
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "w-full bg-gray-800 border-pink-500 text-white placeholder-gray-400",
          isOverInput && "border-pink-400 bg-pink-900/10",
          className
        )}
      />
      {isOverInput && (
        <div className="absolute inset-0 bg-pink-500/10 border-2 border-dashed border-pink-400 rounded flex items-center justify-center pointer-events-none">
          <span className="text-pink-400 text-sm font-medium">Drop field here</span>
        </div>
      )}
    </div>
  );
}
