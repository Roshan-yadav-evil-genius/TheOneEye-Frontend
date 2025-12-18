"use client";

import { useState } from "react";
import { IconSearch, IconFilter, IconLoader2, IconAlertCircle, IconRefresh } from "@tabler/icons-react";
import { useNodeTree } from "@/hooks/useNodeTree";
import { NodeCategoryTree } from "./node-category-tree";
import { cn } from "@/lib/utils";

interface WorkflowSidebarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: {
    nodeGroup: string;
  };
  onFiltersChange: (filters: { nodeGroup: string }) => void;
  selectedNodes: string[];
  onNodeSelect: (nodeId: string) => void;
}

export function WorkflowSidebar({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  selectedNodes,
  onNodeSelect,
}: WorkflowSidebarProps) {
  const { nodeTree, isLoading, error, refresh } = useNodeTree({ searchTerm });
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Search Header */}
      <div className="p-3 border-b border-border space-y-2">
        {/* Search Input */}
        <div className="relative">
          <IconSearch 
            size={16} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "w-full pl-9 pr-10 py-2 text-sm rounded-md",
              "bg-background border border-border",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            )}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded",
              "hover:bg-muted transition-colors",
              showFilters && "bg-muted text-primary"
            )}
            title="Toggle filters"
          >
            <IconFilter size={16} />
          </button>
        </div>

        {/* Filters Panel (expandable) */}
        {showFilters && (
          <div className="p-2 bg-muted/30 rounded-md space-y-2">
            <label className="block">
              <span className="text-xs text-muted-foreground">Node Group</span>
              <select
                value={filters.nodeGroup}
                onChange={(e) => onFiltersChange({ ...filters, nodeGroup: e.target.value })}
                className={cn(
                  "w-full mt-1 px-2 py-1.5 text-sm rounded-md",
                  "bg-background border border-border",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50"
                )}
              >
                <option value="">All Groups</option>
                <option value="trigger">Triggers</option>
                <option value="action">Actions</option>
                <option value="logic">Logic</option>
              </select>
            </label>
          </div>
        )}
      </div>

      {/* Node Tree Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <IconLoader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">Loading nodes...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <IconAlertCircle className="w-10 h-10 text-destructive mb-3" />
            <p className="text-sm text-destructive mb-3">{error}</p>
            <button
              onClick={refresh}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-colors"
              )}
            >
              <IconRefresh size={14} />
              Retry
            </button>
          </div>
        ) : (
          <NodeCategoryTree nodeTree={nodeTree} searchTerm={searchTerm} />
        )}
      </div>
    </div>
  );
}
