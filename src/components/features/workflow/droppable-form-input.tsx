"use client";

import React, { useRef, useState } from 'react';
import { useDroppable, useDndMonitor } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { convertPathToExpression, isExpression } from './expression-utils';
import { JinjaSyntaxHighlighter } from './JinjaSyntaxHighlighter';

interface DroppableFormInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  rows?: number;
  error?: string;
}

export function DroppableFormInput({ 
  type = 'text',
  value, 
  onChange, 
  placeholder,
  className,
  id,
  rows = 3,
  error
}: DroppableFormInputProps) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  const { setNodeRef } = useDroppable({
    id: id || 'droppable-form-input',
    data: {
      type: 'form-field',
      accepts: ['field']
    }
  });

  // Check if the drag is exactly over the input field
  const [isOverInput, setIsOverInput] = useState(false);

  // Monitor drag events to handle drops
  useDndMonitor({
    onDragStart: () => {
      setIsOverInput(false);
    },
    onDragOver: (event) => {
      const { over } = event;
      if (over && over.id === (id || 'droppable-form-input')) {
        setIsOverInput(true);
      } else {
        setIsOverInput(false);
      }
    },
    onDragEnd: (event) => {
      const { active, over } = event;
      setIsOverInput(false);
      
      if (over && over.id === (id || 'droppable-form-input')) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Helper function to get error styling
  const getErrorStyling = (baseClasses: string) => {
    if (error) {
      return baseClasses.replace('border-input', 'border-red-500').replace('focus:border-primary/50', 'focus:border-red-500');
    }
    return baseClasses;
  };

  const baseInputClasses = getErrorStyling(
    "w-full bg-background border border-input rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
  );

  const isTextarea = type === 'textarea';
  const hasTemplateSyntax = isExpression(value);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative w-full",
        isOverInput && "ring-2 ring-pink-500 ring-opacity-50"
      )}
    >
      {isTextarea && hasTemplateSyntax ? (
        <JinjaSyntaxHighlighter
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          id={id}
          error={error}
          className={cn(
            isOverInput && "ring-2 ring-pink-500 ring-opacity-50",
            className
          )}
        />
      ) : isTextarea ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          rows={rows}
          className={cn(
            baseInputClasses,
            "py-2 resize-none",
            isOverInput && "border-pink-400 bg-pink-900/10",
            className
          )}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={type}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={cn(
            baseInputClasses,
            "h-10",
            isOverInput && "border-pink-400 bg-pink-900/10",
            className
          )}
        />
      )}
      
      {isOverInput && (
        <div className="absolute inset-0 bg-pink-500/10 border-2 border-dashed border-pink-400 rounded flex items-center justify-center pointer-events-none">
          <span className="text-pink-400 text-sm font-medium">Drop field here</span>
        </div>
      )}
      
      {error && !hasTemplateSyntax && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
