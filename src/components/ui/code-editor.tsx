"use client";

import React, { useCallback } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-json";
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
}

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  language = "json",
  showLineNumbers = true,
  error,
  className,
  placeholder = "",
}: CodeEditorProps) {
  const highlight = useCallback(
    (code: string) => {
      try {
        const grammar = Prism.languages[language] || Prism.languages.json;
        return Prism.highlight(code, grammar, language);
      } catch {
        return code;
      }
    },
    [language]
  );

  const handleChange = useCallback(
    (code: string) => {
      if (!readOnly && onChange) {
        onChange(code);
      }
    },
    [readOnly, onChange]
  );

  // Generate line numbers
  const lineCount = value.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className={cn("h-full flex flex-col overflow-hidden", className)}>
      <div className="flex-1 overflow-auto sidebar-scrollbar">
        <div className="flex min-h-full">
          {/* Line numbers */}
          {showLineNumbers && (
            <div className="flex-shrink-0 py-2.5 px-2 text-right select-none bg-gray-900/50 border-r border-gray-700/50">
              {lineNumbers.map((num) => (
                <div
                  key={num}
                  className="text-xs text-gray-500 font-mono leading-5"
                  style={{ height: "1.25rem" }}
                >
                  {num}
                </div>
              ))}
            </div>
          )}

          {/* Editor */}
          <div className="flex-1 min-w-0">
            <Editor
              value={value}
              onValueChange={handleChange}
              highlight={highlight}
              padding={10}
              disabled={readOnly}
              placeholder={placeholder}
              className={cn(
                "min-h-full font-mono text-sm",
                readOnly && "cursor-default"
              )}
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                minHeight: "100%",
                background: "transparent",
              }}
              textareaClassName={cn(
                "outline-none focus:outline-none",
                readOnly && "pointer-events-none"
              )}
            />
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="px-3 py-2 bg-red-900/30 border-t border-red-500/30 text-red-400 text-xs flex-shrink-0">
          {error}
        </div>
      )}

      {/* Prism theme styles */}
      <style jsx global>{`
        .token.comment,
        .token.prolog,
        .token.doctype,
        .token.cdata {
          color: #6a9955;
        }
        .token.punctuation {
          color: #d4d4d4;
        }
        .token.property,
        .token.tag,
        .token.boolean,
        .token.number,
        .token.constant,
        .token.symbol,
        .token.deleted {
          color: #b5cea8;
        }
        .token.selector,
        .token.attr-name,
        .token.string,
        .token.char,
        .token.builtin,
        .token.inserted {
          color: #ce9178;
        }
        .token.operator,
        .token.entity,
        .token.url,
        .language-css .token.string,
        .style .token.string {
          color: #d4d4d4;
        }
        .token.atrule,
        .token.attr-value,
        .token.keyword {
          color: #569cd6;
        }
        .token.function,
        .token.class-name {
          color: #dcdcaa;
        }
        .token.regex,
        .token.important,
        .token.variable {
          color: #d16969;
        }
      `}</style>
    </div>
  );
}

