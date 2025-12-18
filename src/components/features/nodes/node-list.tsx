"use client";

import { useState, useMemo } from "react";
import { TNodeTree, TNodeMetadata, TNodeFolder } from "@/types";
import { NodeTree } from "./node-tree";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconSearch, IconRefresh, IconLoader2 } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

interface NodeListProps {
  tree: TNodeTree;
  isLoading?: boolean;
  onRefresh?: () => void;
  onViewForm?: (node: TNodeMetadata) => void;
  onExecute?: (node: TNodeMetadata) => void;
}

/**
 * Count total nodes in a tree
 */
function countTreeNodes(tree: TNodeTree): number {
  let count = 0;
  for (const folder of Object.values(tree)) {
    count += countFolderNodes(folder);
  }
  return count;
}

function countFolderNodes(folder: TNodeFolder): number {
  let count = folder.nodes.length;
  for (const subfolder of Object.values(folder.subfolders)) {
    count += countFolderNodes(subfolder);
  }
  return count;
}

/**
 * Extract all unique types from the tree
 */
function extractTypes(tree: TNodeTree): string[] {
  const types = new Set<string>();
  
  function processFolder(folder: TNodeFolder) {
    for (const node of folder.nodes) {
      if (node.type) types.add(node.type);
    }
    for (const subfolder of Object.values(folder.subfolders)) {
      processFolder(subfolder);
    }
  }
  
  for (const folder of Object.values(tree)) {
    processFolder(folder);
  }
  
  return Array.from(types).sort();
}

/**
 * Filter tree by search term and type filter
 */
function filterTree(
  tree: TNodeTree,
  searchTerm: string,
  typeFilter: string
): TNodeTree {
  const search = searchTerm.toLowerCase();
  
  function filterFolder(folder: TNodeFolder): TNodeFolder | null {
    // Filter nodes in this folder
    const filteredNodes = folder.nodes.filter((node) => {
      const matchesSearch =
        search === "" ||
        node.name.toLowerCase().includes(search) ||
        node.identifier.toLowerCase().includes(search) ||
        (node.label?.toLowerCase().includes(search) ?? false) ||
        (node.description?.toLowerCase().includes(search) ?? false);

      const matchesType = typeFilter === "all" || node.type === typeFilter;

      return matchesSearch && matchesType;
    });

    // Filter subfolders recursively
    const filteredSubfolders: Record<string, TNodeFolder> = {};
    for (const [name, subfolder] of Object.entries(folder.subfolders)) {
      const filtered = filterFolder(subfolder);
      if (filtered && (filtered.nodes.length > 0 || Object.keys(filtered.subfolders).length > 0)) {
        filteredSubfolders[name] = filtered;
      }
    }

    // Return null if folder is empty after filtering
    if (filteredNodes.length === 0 && Object.keys(filteredSubfolders).length === 0) {
      return null;
    }

    return {
      nodes: filteredNodes,
      subfolders: filteredSubfolders,
    };
  }

  const filteredTree: TNodeTree = {};
  for (const [categoryName, folder] of Object.entries(tree)) {
    const filtered = filterFolder(folder);
    if (filtered) {
      filteredTree[categoryName] = filtered;
    }
  }

  return filteredTree;
}

export function NodeList({
  tree,
  isLoading,
  onRefresh,
  onViewForm,
  onExecute,
}: NodeListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Get unique types from tree
  const types = useMemo(() => extractTypes(tree), [tree]);

  // Filter tree based on search and type
  const filteredTree = useMemo(
    () => filterTree(tree, searchTerm, typeFilter),
    [tree, searchTerm, typeFilter]
  );

  const totalNodes = useMemo(() => countTreeNodes(tree), [tree]);
  const filteredNodes = useMemo(() => countTreeNodes(filteredTree), [filteredTree]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading nodes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {filteredNodes} of {totalNodes} nodes
          </Badge>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <IconRefresh className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Node tree */}
      <NodeTree
        tree={filteredTree}
        isLoading={false}
        onViewForm={onViewForm}
        onExecute={onExecute}
      />
    </div>
  );
}
