"use client";

import React, { useRef, useState } from "react";
import { useDroppable, useDndMonitor } from '@dnd-kit/core';
import { JinjaSyntaxHighlighter } from "./JinjaSyntaxHighlighter";
import { isExpression, validateTemplate, convertPathToExpression } from "./expression-utils";
import { cn } from "@/lib/utils";

interface TemplateInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  rows?: number;
  id?: string;
}

export function TemplateInputField({ 
  value, 
  onChange, 
  placeholder = "Enter value or Jinja2 template...",
  error,
  rows = 3,
  id
}: TemplateInputFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isOverInput, setIsOverInput] = useState(false);
  
  const isTemplate = isExpression(value);
  const validation = validateTemplate(value);

  // Set up drag and drop
  const { setNodeRef } = useDroppable({
    id: id || 'template-input-field',
    data: {
      type: 'form-field',
      accepts: ['field']
    }
  });

  // Monitor drag events to handle drops
  useDndMonitor({
    onDragStart: () => {
      setIsOverInput(false);
    },
    onDragOver: (event) => {
      const { over } = event;
      if (over && over.id === (id || 'template-input-field')) {
        setIsOverInput(true);
      } else {
        setIsOverInput(false);
      }
    },
    onDragEnd: (event) => {
      const { active, over } = event;
      setIsOverInput(false);
      
      if (over && over.id === (id || 'template-input-field')) {
        const dragData = active.data.current;
        
        if (dragData && dragData.type === 'field') {
          // Convert the field path to expression syntax
          const expression = convertPathToExpression(dragData.path);
          
          // Insert at cursor position or replace selection
          const textarea = textareaRef.current;
          if (textarea) {
            const start = textarea.selectionStart || 0;
            const end = textarea.selectionEnd || 0;
            const newValue = value.slice(0, start) + expression + value.slice(end);
            onChange(newValue);
            
            // Set cursor position after the inserted expression
            setTimeout(() => {
              const newCursorPos = start + expression.length;
              textarea.setSelectionRange(newCursorPos, newCursorPos);
              textarea.focus();
            }, 0);
          }
        }
      }
    }
  });
  

  // Custom Jinja2 syntax highlighting function for preview
  const highlightJinja2Expression = (text: string): string => {
    if (!text) return '';
    
    // Simple highlighting that avoids nested HTML issues
    return text
      // Highlight the entire Jinja2 expression
      .replace(/(\{\{[^}]*\}\})/g, '<span class="token jinja2-expression">$1</span>')
      // Highlight Jinja2 blocks
      .replace(/(\{%[^%]*%\})/g, '<span class="token jinja2-block">$1</span>')
      // Highlight Jinja2 comments
      .replace(/(\{#[^#]*#\})/g, '<span class="token jinja2-comment">$1</span>');
  };
  
  return (
    <div className="space-y-3">      
      <div className="space-y-3">
        {/* Preview Section */}
        {isTemplate && value && (
          <div className="p-3 bg-muted rounded-md">
            <div className="text-sm font-mono">
              <span 
                dangerouslySetInnerHTML={{ 
                  __html: highlightJinja2Expression(value) 
                }}
              />
            </div>
          </div>
        )}

        {/* Error Section */}
        {!validation.isValid && validation.error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
            {validation.error}
          </div>
        )}


        {/* Input Field */}
        <div
          ref={setNodeRef}
          className={cn(
            "relative w-full",
            isOverInput && "ring-2 ring-pink-500 ring-opacity-50"
          )}
        >
          <JinjaSyntaxHighlighter
            ref={textareaRef}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            id={id}
            error={error}
            className={cn(
              isOverInput && "ring-2 ring-pink-500 ring-opacity-50"
            )}
          />
          
          {isOverInput && (
            <div className="absolute inset-0 bg-pink-500/10 border-2 border-dashed border-pink-400 rounded flex items-center justify-center pointer-events-none">
              <span className="text-pink-400 text-sm font-medium">Drop field here</span>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}