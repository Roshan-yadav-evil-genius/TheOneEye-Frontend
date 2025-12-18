"use client";

import React from "react";
import Editor from "@monaco-editor/react";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  language?: string;
  showLineNumbers?: boolean;
  error?: string | null;
  className?: string;
  placeholder?: string;
  wordWrap?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  language = "json",
  showLineNumbers = true,
  error,
  className,
  wordWrap = false,
}: CodeEditorProps) {
  const handleChange = (newValue: string | undefined) => {
    if (!readOnly && onChange && newValue !== undefined) {
      onChange(newValue);
    }
  };

  return (
    <div className={cn("h-full flex flex-col overflow-hidden", className)}>
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={handleChange}
          theme="vs-dark"
          options={{
            readOnly,
            lineNumbers: showLineNumbers ? "on" : "off",
            folding: true,
            foldingStrategy: "indentation",
            showFoldingControls: "always",
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            fontSize: 14,
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
            lineHeight: 20,
            padding: { top: 10, bottom: 10 },
            renderLineHighlight: "none",
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            wordWrap: wordWrap ? "on" : "off",
            contextmenu: true,
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="px-3 py-2 bg-red-900/30 border-t border-red-500/30 text-red-400 text-xs flex-shrink-0">
          {error}
        </div>
      )}
    </div>
  );
}
