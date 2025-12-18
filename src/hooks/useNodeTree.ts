import { useState, useEffect, useMemo } from 'react';
import { nodeApi } from '@/lib/api/services/node-api';
import { TNodeTree, TNodeFolder, TNodeMetadata } from '@/types';

interface UseNodeTreeOptions {
  searchTerm?: string;
}

interface UseNodeTreeResult {
  nodeTree: TNodeTree;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Count total nodes in a folder (including subfolders)
 */
export function countNodesInFolder(folder: TNodeFolder): number {
  let count = folder.nodes.length;
  for (const subfolder of Object.values(folder.subfolders)) {
    count += countNodesInFolder(subfolder);
  }
  return count;
}

/**
 * Filter a node folder based on search term
 */
function filterFolder(folder: TNodeFolder, searchTerm: string): TNodeFolder | null {
  const lowerSearch = searchTerm.toLowerCase();
  
  // Filter direct nodes
  const filteredNodes = folder.nodes.filter(node => 
    node.name.toLowerCase().includes(lowerSearch) ||
    node.label?.toLowerCase().includes(lowerSearch) ||
    node.identifier.toLowerCase().includes(lowerSearch)
  );
  
  // Recursively filter subfolders
  const filteredSubfolders: Record<string, TNodeFolder> = {};
  for (const [name, subfolder] of Object.entries(folder.subfolders)) {
    const filtered = filterFolder(subfolder, searchTerm);
    if (filtered && (filtered.nodes.length > 0 || Object.keys(filtered.subfolders).length > 0)) {
      filteredSubfolders[name] = filtered;
    }
  }
  
  // Return null if nothing matches
  if (filteredNodes.length === 0 && Object.keys(filteredSubfolders).length === 0) {
    return null;
  }
  
  return {
    nodes: filteredNodes,
    subfolders: filteredSubfolders,
  };
}

/**
 * Filter entire node tree based on search term
 */
function filterNodeTree(tree: TNodeTree, searchTerm: string): TNodeTree {
  if (!searchTerm.trim()) {
    return tree;
  }
  
  const filteredTree: TNodeTree = {};
  
  for (const [categoryName, folder] of Object.entries(tree)) {
    // Also match category name
    const categoryMatches = categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (categoryMatches) {
      filteredTree[categoryName] = folder;
    } else {
      const filtered = filterFolder(folder, searchTerm);
      if (filtered) {
        filteredTree[categoryName] = filtered;
      }
    }
  }
  
  return filteredTree;
}

/**
 * Hook to fetch and manage node tree data with search filtering
 */
export function useNodeTree({ searchTerm = '' }: UseNodeTreeOptions = {}): UseNodeTreeResult {
  const [nodeTree, setNodeTree] = useState<TNodeTree>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNodes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await nodeApi.getNodes();
      setNodeTree(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch nodes');
      console.error('Failed to fetch node tree:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  // Filter the tree based on search term
  const filteredTree = useMemo(() => {
    return filterNodeTree(nodeTree, searchTerm);
  }, [nodeTree, searchTerm]);

  return {
    nodeTree: filteredTree,
    isLoading,
    error,
    refresh: fetchNodes,
  };
}

