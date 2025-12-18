"use client";

import { useState } from "react";
import { IconSearch, IconFilter, IconLoader2, IconAlertCircle, IconRefresh, IconList, IconFolders } from "@tabler/icons-react";
import { useNodeTree, ViewMode } from "@/hooks/useNodeTree";
import { NodeCategoryTree } from "./node-category-tree";
import { DraggableNodeItem } from "./draggable-node-item";
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
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [showFilters, setShowFilters] = useState(false);
  
  const { nodeTree, flatNodes, isLoading, error, refresh } = useNodeTree({ 
    searchTerm, 
    viewMode 
  });

  const toggleViewMode = () => {
    setViewMode(viewMode === 'tree' ? 'flat' : 'tree');
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Search Header */}
      <div className="p-3 border-b border-border space-y-2">
        {/* Search Input */}
        <div className="relative flex gap-1">
          <div className="relative flex-1">
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
                "w-full pl-9 pr-3 py-2 text-sm rounded-md",
                "bg-background border border-border",
                "placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              )}
            />
          </div>
          
          {/* View Mode Toggle */}
          <button
            onClick={toggleViewMode}
            className={cn(
              "p-2 rounded-md border border-border",
              "hover:bg-muted transition-colors",
              "bg-background"
            )}
            title={viewMode === 'tree' ? 'Switch to flat view' : 'Switch to tree view'}
          >
            {viewMode === 'tree' ? (
              <IconFolders size={16} className="text-primary" />
            ) : (
              <IconList size={16} className="text-primary" />
            )}
          </button>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "p-2 rounded-md border border-border",
              "hover:bg-muted transition-colors",
              showFilters ? "bg-muted text-primary" : "bg-background"
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

      {/* Node Tree/List Content */}
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
        ) : viewMode === 'tree' ? (
          <NodeCategoryTree nodeTree={nodeTree} searchTerm={searchTerm} />
        ) : (
          /* Flat List View */
          <div className="space-y-2">
            {flatNodes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <IconList className="w-10 h-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'No nodes match your search' : 'No nodes available'}
                </p>
              </div>
            ) : (
              flatNodes.map((node) => (
                <DraggableNodeItem key={node.identifier} node={node} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
