"use client";

import React, { useRef, useState } from 'react';
import { useDroppable, useDndMonitor } from '@dnd-kit/core';
import { convertPathToExpression } from './expression-utils';
import { cn } from '@/lib/utils';
import { ExpressionParser } from '@/services/expression/expression-parser';
import { ExpressionHighlighter } from '@/services/expression/expression-highlighter';
import { jinja2Parser } from '@/services/expression/jinja2-parser';
import { defaultHighlighter } from '@/services/expression/default-highlighter';

interface ExpressionInputProps {
  type?: 'text' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  rows?: number;
  error?: string;
  /** Custom expression parser (defaults to Jinja2) */
  parser?: ExpressionParser;
  /** Custom expression highlighter (defaults to default highlighter) */
  highlighter?: ExpressionHighlighter;
}

export function ExpressionInput({
  type = 'text',
  value,
  onChange,
  placeholder,
  className,
  id,
  rows = 3,
  error,
  parser = jinja2Parser,
  highlighter = defaultHighlighter,
}: ExpressionInputProps) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [isOverInput, setIsOverInput] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { setNodeRef } = useDroppable({
    id: id || 'expression-input',
    data: {
      type: 'form-field',
      accepts: ['field']
    }
  });

  // Monitor drag events
  useDndMonitor({
    onDragStart: () => {
      setIsOverInput(false);
    },
    onDragOver: (event) => {
      const { over } = event;
      if (over && over.id === (id || 'expression-input')) {
        setIsOverInput(true);
      } else {
        setIsOverInput(false);
      }
    },
    onDragEnd: (event) => {
      const { active, over } = event;
      setIsOverInput(false);
      
      if (over && over.id === (id || 'expression-input')) {
        const dragData = active.data.current;
        
        if (dragData && dragData.type === 'field') {
          const expression = convertPathToExpression(dragData.path);
          const input = inputRef.current;
          
          if (input) {
            const start = input.selectionStart || 0;
            const end = input.selectionEnd || 0;
            const newValue = value.slice(0, start) + expression + value.slice(end);
            onChange(newValue);
            
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Backspace' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      const input = inputRef.current;
      if (input) {
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        
        // If there's a selection, delete it normally
        if (start !== end) {
          return; // Let default behavior handle selection deletion
        }
        
        // Check if cursor is at the start of an expression
        const expression = parser.getExpressionAtPosition(value, start);
        if (expression && start === expression.start) {
          // Delete the entire expression
          e.preventDefault();
          const newValue = value.slice(0, expression.start) + value.slice(expression.end);
          onChange(newValue);
          
          setTimeout(() => {
            input.setSelectionRange(expression.start, expression.start);
            input.focus();
          }, 0);
          return;
        }
        
        // Check if cursor is inside an expression
        if (expression && start > expression.start && start <= expression.end) {
          // Delete the entire expression
          e.preventDefault();
          const newValue = value.slice(0, expression.start) + value.slice(expression.end);
          onChange(newValue);
          
          setTimeout(() => {
            input.setSelectionRange(expression.start, expression.start);
            input.focus();
          }, 0);
          return;
        }
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Render with highlighted expressions using the highlighter
  const renderWithHighlights = (text: string): React.ReactNode => {
    if (!text) return null;
    const expressions = parser.extractExpressions(text);
    return highlighter.renderWithHighlights(text, expressions);
  };

  const isTextarea = type === 'textarea';
  const baseInputClasses = cn(
    "w-full bg-background border border-input rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground/60",
    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
    error && "border-red-500 focus:border-red-500",
    isOverInput && "border-pink-400 bg-pink-900/10"
  );

  return (
    <div
      ref={setNodeRef}
      className={cn("relative w-full", className)}
    >
      {/* Highlighted overlay (always visible when there are expressions) */}
      {value && (
        <div
          className="absolute inset-0 pointer-events-none px-3 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words overflow-hidden rounded-lg"
          style={{ 
            zIndex: 1,
            ...(isTextarea ? { paddingTop: '0.5rem', paddingBottom: '0.5rem' } : { lineHeight: '2.5rem' })
          }}
          aria-hidden="true"
        >
          {renderWithHighlights(value)}
        </div>
      )}
      
      {/* Actual input */}
      {isTextarea ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={rows}
          id={id}
          className={cn(
            baseInputClasses,
            "py-2 resize-y min-h-[80px] relative",
            value ? "text-transparent caret-foreground" : "text-foreground"
          )}
          style={{
            backgroundColor: value ? 'transparent' : undefined,
          }}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          id={id}
          className={cn(
            baseInputClasses,
            "h-10 relative",
            value ? "text-transparent caret-foreground" : "text-foreground"
          )}
          style={{
            backgroundColor: value ? 'transparent' : undefined,
          }}
        />
      )}
      
      {/* Drop overlay */}
      {isOverInput && (
        <div className="absolute inset-0 bg-pink-500/10 border-2 border-dashed border-pink-400 rounded flex items-center justify-center pointer-events-none z-10">
          <span className="text-pink-400 text-sm font-medium">Drop field here</span>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}

