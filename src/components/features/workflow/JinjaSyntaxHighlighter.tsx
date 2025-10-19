"use client";

import React, { useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface JinjaSyntaxHighlighterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  rows?: number;
  id?: string;
  error?: string;
  ref?: React.Ref<HTMLTextAreaElement>;
}

export const JinjaSyntaxHighlighter = React.forwardRef<HTMLTextAreaElement, JinjaSyntaxHighlighterProps>(({ 
  value, 
  onChange, 
  placeholder = "Enter Jinja2 template...",
  className,
  readOnly = false,
  rows = 3,
  id,
  error
}, ref) => {
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = ref || internalRef;
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab key to insert spaces instead of losing focus
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newValue);
        
        // Set cursor position after the inserted spaces
        setTimeout(() => {
          textarea.setSelectionRange(start + 2, start + 2);
        }, 0);
      }
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Simple textarea without syntax highlighting overlay */}
      <Textarea
        ref={textareaRef as React.RefObject<HTMLTextAreaElement>}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        id={id}
        className={cn(
          "w-full bg-background text-foreground resize-none",
          "font-mono text-sm leading-relaxed",
          "border border-input focus:border-primary/50",
          "placeholder:text-muted-foreground/60",
          error && "border-red-500 focus:border-red-500",
          isFocused && "ring-2 ring-primary/20"
        )}
      />
      
      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
});

JinjaSyntaxHighlighter.displayName = 'JinjaSyntaxHighlighter';