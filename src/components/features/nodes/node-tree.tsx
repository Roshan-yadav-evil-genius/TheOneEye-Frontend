"use client";

import { useMemo } from "react";
import { TNodeTree, TNodeMetadata } from "@/types";
import { NodeFolder } from "./node-folder";
import { IconSearch, IconLoader2 } from "@tabler/icons-react";

interface NodeTreeProps {
  tree: TNodeTree;
  isLoading?: boolean;
  onViewForm?: (node: TNodeMetadata) => void;
  onExecute?: (node: TNodeMetadata) => void;
}

/**
 * Count total nodes across all categories in the tree
 */
function countAllNodes(tree: TNodeTree): number {
  let count = 0;
  for (const folder of Object.values(tree)) {
    count += countFolderNodes(folder);
  }
  return count;
}

function countFolderNodes(folder: { nodes: TNodeMetadata[]; subfolders: Record<string, any> }): number {
  let count = folder.nodes.length;
  for (const subfolder of Object.values(folder.subfolders)) {
    count += countFolderNodes(subfolder as { nodes: TNodeMetadata[]; subfolders: Record<string, any> });
  }
  return count;
}

/**
 * NodeTree component - renders the hierarchical tree of node folders
 */
export function NodeTree({
  tree,
  isLoading,
  onViewForm,
  onExecute,
}: NodeTreeProps) {
  const totalNodes = useMemo(() => countAllNodes(tree), [tree]);
  const categoryCount = Object.keys(tree).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading nodes...</span>
      </div>
    );
  }

  if (categoryCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <IconSearch className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No nodes found</h3>
        <p className="text-muted-foreground">No nodes are available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Object.entries(tree)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([categoryName, folder]) => (
          <NodeFolder
            key={categoryName}
            name={categoryName}
            folder={folder}
            level={0}
            defaultExpanded={true}
            onViewForm={onViewForm}
            onExecute={onExecute}
          />
        ))}
    </div>
  );
}

