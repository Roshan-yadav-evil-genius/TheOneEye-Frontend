"use client";

import { IconInfoCircle } from "@tabler/icons-react";

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

  return (
    <div className="h-full flex flex-col">
      {/* Placeholder Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <IconInfoCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          Node Panel Removed
        </h3>
        <p className="text-sm text-muted-foreground">
          The node drag-and-drop panel has been removed from this workflow builder.
        </p>
      </div>
    </div>
  );
}
