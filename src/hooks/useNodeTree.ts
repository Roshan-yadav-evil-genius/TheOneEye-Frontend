import { useState, useEffect, useMemo } from 'react';
import { nodeApi } from '@/lib/api/services/node-api';
import { TNodeTree, TNodeFolder, TNodeMetadata } from '@/types';

export type ViewMode = 'tree' | 'flat';

interface UseNodeTreeOptions {
  searchTerm?: string;
  viewMode?: ViewMode;
  categoryFilter?: string;
}

interface UseNodeTreeResult {
  nodeTree: TNodeTree;
  flatNodes: TNodeMetadata[];
  categories: string[];
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
 * Recursively extract all category paths from a folder
 */
function extractSubcategories(folder: TNodeFolder, prefix: string): string[] {
  const paths: string[] = [];
  
  for (const [name, subfolder] of Object.entries(folder.subfolders)) {
    const fullPath = prefix ? `${prefix}/${name}` : name;
    paths.push(fullPath);
    paths.push(...extractSubcategories(subfolder, fullPath));
  }
  
  return paths;
}

/**
 * Extract all unique categories from the node tree (including nested subcategories)
 */
function extractCategories(tree: TNodeTree): string[] {
  const categories: string[] = [];
  
  for (const [categoryName, folder] of Object.entries(tree)) {
    // Add top-level category
    categories.push(categoryName);
    // Add all nested subcategories
    categories.push(...extractSubcategories(folder, categoryName));
  }
  
  return categories.sort();
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
 * Navigate to a subfolder by path (e.g., "Browser/actions/linkedin")
 */
function getSubfolderByPath(folder: TNodeFolder, pathParts: string[]): TNodeFolder | null {
  if (pathParts.length === 0) {
    return folder;
  }
  
  const [first, ...rest] = pathParts;
  const subfolder = folder.subfolders[first];
  
  if (!subfolder) {
    return null;
  }
  
  return getSubfolderByPath(subfolder, rest);
}

/**
 * Filter entire node tree based on search term and category
 */
function filterNodeTree(tree: TNodeTree, searchTerm: string, categoryFilter: string): TNodeTree {
  let filteredTree: TNodeTree = tree;
  
  // Apply category filter first
  if (categoryFilter.trim()) {
    filteredTree = {};
    
    // Parse the category path (e.g., "Browser/actions/linkedin")
    const pathParts = categoryFilter.split('/');
    const topCategory = pathParts[0];
    const subPath = pathParts.slice(1);
    
    if (tree[topCategory]) {
      if (subPath.length === 0) {
        // Just top-level category
        filteredTree[topCategory] = tree[topCategory];
      } else {
        // Navigate to the specific subfolder
        const subfolder = getSubfolderByPath(tree[topCategory], subPath);
        if (subfolder) {
          // Create a new tree with just this subfolder
          filteredTree[categoryFilter] = subfolder;
        }
      }
    }
  }
  
  // Then apply search filter
  if (!searchTerm.trim()) {
    return filteredTree;
  }
  
  const searchFilteredTree: TNodeTree = {};
  
  for (const [categoryName, folder] of Object.entries(filteredTree)) {
    // Also match category name
    const categoryMatches = categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (categoryMatches) {
      searchFilteredTree[categoryName] = folder;
    } else {
      const filtered = filterFolder(folder, searchTerm);
      if (filtered) {
        searchFilteredTree[categoryName] = filtered;
      }
    }
  }
  
  return searchFilteredTree;
}

/**
 * Filter flat nodes list based on search term and category
 */
function filterFlatNodes(nodes: TNodeMetadata[], searchTerm: string, categoryFilter: string): TNodeMetadata[] {
  let filteredNodes = nodes;
  
  // Apply category filter first
  if (categoryFilter.trim()) {
    filteredNodes = nodes.filter(node => {
      // Check if the node's category starts with the filter
      // This handles nested categories like "WebPageParsers/Linkedin"
      const nodeCategory = node.category || '';
      return nodeCategory === categoryFilter || nodeCategory.startsWith(categoryFilter + '/');
    });
  }
  
  // Then apply search filter
  if (!searchTerm.trim()) {
    return filteredNodes;
  }
  
  const lowerSearch = searchTerm.toLowerCase();
  return filteredNodes.filter(node => 
    node.name.toLowerCase().includes(lowerSearch) ||
    node.label?.toLowerCase().includes(lowerSearch) ||
    node.identifier.toLowerCase().includes(lowerSearch) ||
    node.category?.toLowerCase().includes(lowerSearch)
  );
}

/**
 * Hook to fetch and manage node tree data with search and category filtering
 * Supports both tree view and flat view modes
 */
export function useNodeTree({ 
  searchTerm = '', 
  viewMode = 'tree',
  categoryFilter = ''
}: UseNodeTreeOptions = {}): UseNodeTreeResult {
  const [nodeTree, setNodeTree] = useState<TNodeTree>({});
  const [flatNodes, setFlatNodes] = useState<TNodeMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNodes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch both tree and flat data
      const [treeData, flatData] = await Promise.all([
        nodeApi.getNodes(),
        nodeApi.getNodesFlat(),
      ]);
      setNodeTree(treeData);
      setFlatNodes(flatData);
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

  // Extract available categories from the tree
  const categories = useMemo(() => {
    return extractCategories(nodeTree);
  }, [nodeTree]);

  // Filter the tree based on search term and category
  const filteredTree = useMemo(() => {
    return filterNodeTree(nodeTree, searchTerm, categoryFilter);
  }, [nodeTree, searchTerm, categoryFilter]);

  // Filter the flat list based on search term and category
  const filteredFlatNodes = useMemo(() => {
    return filterFlatNodes(flatNodes, searchTerm, categoryFilter);
  }, [flatNodes, searchTerm, categoryFilter]);

  return {
    nodeTree: filteredTree,
    flatNodes: filteredFlatNodes,
    categories,
    isLoading,
    error,
    refresh: fetchNodes,
  };
}

