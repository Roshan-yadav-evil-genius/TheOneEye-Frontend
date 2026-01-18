"use client";

import { useState } from "react";
import { IconSearch, IconFilter, IconLoader2, IconAlertCircle, IconRefresh, IconList, IconFolders } from "@tabler/icons-react";
import { useNodeTree, ViewMode } from "@/hooks/useNodeTree";
import { NodeCategoryTree } from "./node-category-tree";
import { DraggableNodeItem } from "./draggable-node-item";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores";
import { useWorkflowCanvasStore } from "@/stores/workflow/workflow-canvas-store";
import { WorkflowType } from "@/types/common/constants";

interface WorkflowSidebarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: {
    nodeGroup: string;
  };
  onFiltersChange: (filters: { nodeGroup: string }) => void;
  selectedNodes: string[];
  onNodeSelect: (nodeId: string) => void;
  isExecuting?: boolean;
}

export function WorkflowSidebar({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  selectedNodes,
  onNodeSelect,
  isExecuting = false,
}: WorkflowSidebarProps) {
  const nodesViewMode = useUIStore((state) => state.nodesViewMode);
  const setNodesViewMode = useUIStore((state) => state.setNodesViewMode);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Get workflow type from canvas store
  const workflow = useWorkflowCanvasStore((state) => state.workflow);
  const workflowType = workflow?.workflow_type;
  
  const { nodeTree, flatNodes, categories, isLoading, error, refresh } = useNodeTree({ 
    searchTerm, 
    viewMode: nodesViewMode,
    categoryFilter,
  });

  const toggleViewMode = () => {
    setNodesViewMode(nodesViewMode === 'tree' ? 'flat' : 'tree');
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
            title={nodesViewMode === 'tree' ? 'Switch to flat view' : 'Switch to tree view'}
          >
            {nodesViewMode === 'tree' ? (
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
              showFilters || categoryFilter ? "bg-muted text-primary" : "bg-background"
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
              <span className="text-xs text-muted-foreground">Category</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={cn(
                  "w-full mt-1 px-2 py-1.5 text-sm rounded-md",
                  "bg-background border border-border",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50"
                )}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      {/* Execution Mode Banner */}
      {isExecuting && (
        <div className="px-3 py-2 bg-green-500/10 border-b border-green-500/20">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-xs font-medium">Workflow Running - Drag Disabled</span>
          </div>
        </div>
      )}

      {/* Node Tree/List Content */}
      <div className={cn(
        "flex-1 overflow-y-auto p-2",
        isExecuting && "opacity-50 pointer-events-none"
      )}>
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
        ) : nodesViewMode === 'tree' ? (
          <NodeCategoryTree 
            nodeTree={nodeTree} 
            searchTerm={searchTerm} 
            workflowType={workflowType}
          />
        ) : (
          /* Flat List View */
          <div className="space-y-2">
            {flatNodes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <IconList className="w-10 h-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  {searchTerm || categoryFilter ? 'No nodes match your filters' : 'No nodes available'}
                </p>
              </div>
            ) : (
              flatNodes.map((node) => (
                <DraggableNodeItem 
                  key={node.identifier} 
                  node={node} 
                  workflowType={workflowType}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
