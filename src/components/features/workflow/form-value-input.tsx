"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import Editor, { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import {
  setupJinjaJson,
  langId,
  langIdJinjaText,
  themeName,
  getFormTemplateMonacoOptions,
} from "@/lib/monaco/jinja-json";
import { useMonacoFormValueCompletions } from "@/hooks/useMonacoFormValueCompletions";

export interface FormValueInputProps {
  type?: "text" | "email" | "password" | "number" | "textarea";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  rows?: number;
  error?: string;
  jsonMode?: boolean;
  availableVariables?: string[];
  workflowEnvKeys?: string[];
  /** When set, enables `data.*` completions inside `{{ }}` from this INPUT object. */
  nodeInputData?: Record<string, unknown>;
}

export function FormValueInput({
  type = "text",
  value,
  onChange,
  placeholder,
  className,
  id,
  rows = 3,
  error,
  jsonMode = false,
  availableVariables = [],
  workflowEnvKeys = [],
  nodeInputData,
}: FormValueInputProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const nodeInputDataRef = useRef(nodeInputData);
  nodeInputDataRef.current = nodeInputData;

  const [editorHeight, setEditorHeight] = useState<number>(rows * 20 + 40);
  const [isResizing, setIsResizing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [editorMountEpoch, setEditorMountEpoch] = useState(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    if (type === "textarea") {
      const newHeight = rows * 20 + 40;
      setEditorHeight(newHeight);
    }
  }, [rows, type]);

  useMonacoFormValueCompletions({
    enabled: type === "textarea",
    editorRef,
    editorMountEpoch,
    jsonMode,
    availableVariables,
    workflowEnvKeys,
    hasNodeInputData: nodeInputData !== undefined,
    getNodeInputData: () => nodeInputDataRef.current,
  });

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (resizeRef.current) {
        const container = resizeRef.current.closest(".relative");
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

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, rows]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (type !== "textarea") return;
    setLocalValue(value);
  }, [value, type]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue === undefined) return;
    setLocalValue(newValue);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      onChangeRef.current(newValue);
      debounceTimerRef.current = null;
    }, 280);
  };

  const isTextarea = type === "textarea";

  const handleBeforeMount = useCallback(
    (monaco: Parameters<OnMount>[1]) => {
      if (isTextarea) setupJinjaJson(monaco);
    },
    [isTextarea]
  );

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    (window as Window & { monaco?: typeof import("monaco-editor") }).monaco = monaco;
    if (isTextarea) {
      setEditorMountEpoch((n) => n + 1);
    }
  };

  const getErrorStyling = (baseClasses: string) => {
    if (error) {
      return baseClasses
        .replace("border-input", "border-red-500")
        .replace("focus:border-primary/50", "focus:border-red-500");
    }
    return baseClasses;
  };

  const baseInputClasses = getErrorStyling(
    "w-full bg-background border border-input rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
  );

  if (isTextarea) {
    return (
      <div className={cn("relative w-full", className)} style={{ minHeight: `${rows * 20 + 40}px` }}>
        <div
          ref={resizeRef}
          className={cn(
            "border rounded-lg overflow-hidden relative",
            error ? "border-destructive" : "border-input"
          )}
          style={{ height: `${editorHeight}px` }}
        >
          <Editor
            height={`${editorHeight}px`}
            language={jsonMode ? langId : langIdJinjaText}
            value={localValue}
            onChange={handleEditorChange}
            beforeMount={handleBeforeMount}
            onMount={handleEditorDidMount}
            theme={themeName}
            options={getFormTemplateMonacoOptions()}
          />
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

        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      <input
        id={id}
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type={type}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={cn(
          baseInputClasses,
          "h-10",
          error && "border-destructive focus:border-destructive"
        )}
      />

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
