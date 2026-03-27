"use client";

import React from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { SchemaField as SchemaFieldType, SchemaFieldProps } from "./types";
import { getTypeIcon } from "./utils";

function SchemaKeyBadge({ field }: { field: SchemaFieldType }) {
  return (
    <span className="px-2 py-1 rounded text-xs font-mono bg-gray-600/20 text-gray-300 border border-gray-500/30">
      {field.key}
    </span>
  );
}

export function SchemaField({
  field,
  level,
  isExpanded,
  onToggle,
  wordWrap = false,
}: SchemaFieldProps) {
  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }

    if (field.children && field.children.length > 0) {
      onToggle();
    }
  };

  const hasChildren = field.children && field.children.length > 0;
  const isExpandable = hasChildren && (field.type === "object" || field.type === "array");

  return (
    <div
      style={{ marginLeft: `${level * 16}px` }}
      onClick={handleClick}
      className={`group flex ${wordWrap ? "items-start" : "items-center"} gap-2 py-1 px-2 rounded hover:bg-gray-700/30 transition-colors`}
    >
      {isExpandable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onToggle();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="flex items-center justify-center w-4 h-4 hover:bg-gray-600 rounded flex-shrink-0"
        >
          {isExpanded ? (
            <ChevronDown className="w-3 h-3 text-gray-300" />
          ) : (
            <ChevronRight className="w-3 h-3 text-gray-300" />
          )}
        </button>
      )}

      {!isExpandable && <div className="w-4 flex-shrink-0" />}

      <div className="flex-shrink-0">{getTypeIcon(field.type)}</div>
      <div className={`flex ${wordWrap ? "flex-col items-start gap-1" : "items-center justify-between"} w-full min-w-0`}>
        <div className="flex items-center gap-2 flex-shrink-0">
          <SchemaKeyBadge field={field} />
        </div>
        {field.type !== "object" && field.type !== "array" && field.value !== undefined && (
          <span className={`text-gray-400 font-mono text-sm ${wordWrap ? "break-all" : "truncate"}`}>
            {typeof field.value === "string" ? `"${field.value}"` : JSON.stringify(field.value)}
          </span>
        )}
      </div>
    </div>
  );
}
