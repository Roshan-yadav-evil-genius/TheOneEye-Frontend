"use client";

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useDroppable, useDndMonitor } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { convertPathToExpression } from './expression-utils';
import Editor, { OnMount } from "@monaco-editor/react";
import type { editor } from 'monaco-editor';

interface DroppableFormInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  rows?: number;
  error?: string;
  jsonMode?: boolean; // Enable JSON editor mode
  availableVariables?: string[]; // For autocomplete suggestions
}

export function DroppableFormInput({ 
  type = 'text',
  value, 
  onChange, 
  placeholder,
  className,
  id,
  rows = 3,
  error,
  jsonMode = false,
  availableVariables = [],
}: DroppableFormInputProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  
  const { setNodeRef } = useDroppable({
    id: id || 'droppable-form-input',
    data: {
      type: 'form-field',
      accepts: ['field']
    }
  });

  // Check if the drag is exactly over the input field
  const [isOverInput, setIsOverInput] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [editorHeight, setEditorHeight] = useState<number>(rows * 20 + 40);
  const [isResizing, setIsResizing] = useState(false);

  // Validate JSON when in JSON mode
  useEffect(() => {
    if (jsonMode && value) {
      try {
        JSON.parse(value);
        setJsonError(null);
      } catch (e) {
        setJsonError('Invalid JSON syntax');
      }
    } else {
      setJsonError(null);
    }
  }, [value, jsonMode]);

  // Update editor height when rows prop changes
  useEffect(() => {
    if (jsonMode && type === 'textarea') {
      const newHeight = rows * 20 + 40;
      setEditorHeight(newHeight);
    }
  }, [rows, jsonMode, type]);

  // Setup Monaco autocomplete for JSON and variables
  useEffect(() => {
    if (!jsonMode || !editorRef.current) return;

    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) return;

    // Get monaco instance from window (set in onMount)
    const monaco = (window as any).monaco;
    if (!monaco) return;

    // Register completion item provider
    const disposable = monaco.languages.registerCompletionItemProvider('json', {
      provideCompletionItems: (model: editor.ITextModel, position: editor.Position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions: monaco.languages.CompletionItem[] = [];

        // Add variable suggestions
        availableVariables.forEach((variable) => {
          suggestions.push({
            label: variable,
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: variable,
            range,
            detail: 'Workflow variable',
          });
        });

        // Add common JSON keywords
        const jsonKeywords = [
          { label: 'true', kind: monaco.languages.CompletionItemKind.Keyword },
          { label: 'false', kind: monaco.languages.CompletionItemKind.Keyword },
          { label: 'null', kind: monaco.languages.CompletionItemKind.Keyword },
        ];

        jsonKeywords.forEach(({ label, kind }) => {
          suggestions.push({
            label,
            kind,
            insertText: label,
            range,
          });
        });

        return { suggestions };
      },
    });

    return () => {
      disposable.dispose();
    };
  }, [jsonMode, availableVariables]);

  // Handle resize functionality for Monaco Editor
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (resizeRef.current) {
        const container = resizeRef.current.closest('.relative');
        if (container) {
          const rect = container.getBoundingClientRect();
          const newHeight = e.clientY - rect.top;
          const minHeight = rows * 20 + 40;
          if (newHeight >= minHeight) {
            setEditorHeight(newHeight);
          }
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, rows]);

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
          
          if (jsonMode && editorRef.current) {
            // Insert into Monaco editor
            const editor = editorRef.current;
            const selection = editor.getSelection();
            if (selection) {
              const op = {
                range: selection,
                text: expression,
              };
              editor.executeEdits('drop-variable', [op]);
              editor.focus();
            }
          } else {
            // Insert into regular input/textarea
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
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    // Store monaco instance globally for autocomplete provider
    (window as any).monaco = monaco;
  };

  // Helper function to get error styling
  const getErrorStyling = (baseClasses: string) => {
    if (error || jsonError) {
      return baseClasses.replace('border-input', 'border-red-500').replace('focus:border-primary/50', 'focus:border-red-500');
    }
    return baseClasses;
  };

  const baseInputClasses = getErrorStyling(
    "w-full bg-background border border-input rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
  );

  const isTextarea = type === 'textarea';

  // Use Monaco Editor for JSON mode textarea fields
  if (jsonMode && isTextarea) {
    return (
      <div
        ref={setNodeRef}
        className={cn(
          "relative w-full",
          isOverInput && "ring-2 ring-pink-500 ring-opacity-50",
          className
        )}
        style={{ minHeight: `${rows * 20 + 40}px` }}
      >
        <div 
          ref={resizeRef}
          className={cn(
            "border rounded-lg overflow-hidden relative",
            error || jsonError ? "border-red-500" : "border-input",
            isOverInput && "border-pink-400 bg-pink-900/10"
          )}
          style={{ height: `${editorHeight}px` }}
        >
          <Editor
            height={`${editorHeight}px`}
            language="json"
            value={value}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              readOnly: false,
              lineNumbers: 'on',
              minimap: { enabled: false },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              fontSize: 14,
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
              lineHeight: 20,
              padding: { top: 10, bottom: 10 },
              wordWrap: 'on',
              formatOnPaste: true,
              formatOnType: true,
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              tabSize: 2,
              insertSpaces: true,
            }}
          />
          {/* Resize handle */}
          <div
            onMouseDown={handleResizeStart}
            className={cn(
              "absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-primary/20 transition-colors",
              "flex items-center justify-center group",
              isResizing && "bg-primary/30"
            )}
            style={{ zIndex: 10 }}
          >
            <div className="w-12 h-0.5 bg-border group-hover:bg-primary/50 rounded transition-colors" />
          </div>
        </div>
        
        {isOverInput && (
          <div className="absolute inset-0 bg-pink-500/10 border-2 border-dashed border-pink-400 rounded flex items-center justify-center pointer-events-none z-10">
            <span className="text-pink-400 text-sm font-medium">Drop field here</span>
          </div>
        )}
        
        {(error || jsonError) && (
          <p className="text-red-500 text-xs mt-1">{error || jsonError}</p>
        )}
      </div>
    );
  }

  // Regular input/textarea for non-JSON mode
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative w-full",
        isOverInput && "ring-2 ring-pink-500 ring-opacity-50"
      )}
    >
      {isTextarea ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          rows={rows}
          className={cn(
            baseInputClasses,
            "py-2 resize-y min-h-[80px]",
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
      
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
