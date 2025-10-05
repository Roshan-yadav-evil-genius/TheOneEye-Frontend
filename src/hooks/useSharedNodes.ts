import { useEffect, useCallback } from 'react';
import { useNodesStore, nodesSelectors } from '@/stores';
import { TNode, TNodeFilters } from '@/types';

interface UseSharedNodesOptions {
  autoLoad?: boolean;
  showToast?: boolean;
}

interface UseSharedNodesReturn {
  // Data
  nodes: TNode[];
  filteredNodes: TNode[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadNodes: (filters?: TNodeFilters, options?: { showToast?: boolean }) => Promise<void>;
  refreshNodes: () => Promise<void>;
  clearError: () => void;
  
  // Selectors
  getNodesByNodeGroup: (nodeGroup: string) => TNode[];
  getNodesByType: (type: string) => TNode[];
  getActiveNodes: () => TNode[];
  getInactiveNodes: () => TNode[];
  
  // Filtering
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<TNodeFilters>) => void;
  clearFilters: () => void;
  
}

/**
 * Shared hook for accessing nodes data across components
 * Provides centralized caching and state management
 */
export const useSharedNodes = (options: UseSharedNodesOptions = {}): UseSharedNodesReturn => {
  const {
    autoLoad = true,
    showToast = false,
  } = options;

  // Get store state and actions
  const {
    nodes,
    isLoading,
    error,
    loadNodes: storeLoadNodes,
    setSearchQuery,
    setFilters,
    clearFilters: storeClearFilters,
    clearError,
  } = useNodesStore();

  // Memoized load function
  const loadNodes = useCallback(async (
    filters?: TNodeFilters, 
    loadOptions?: { showToast?: boolean }
  ) => {
    await storeLoadNodes(filters, {
      showToast: loadOptions?.showToast ?? showToast,
    });
  }, [storeLoadNodes, showToast]);

  // Memoized refresh function
  const refreshNodes = useCallback(async () => {
    await loadNodes({});
  }, [loadNodes]);

  // Auto-load nodes on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      loadNodes({}, { showToast: false });
    }
  }, [autoLoad, loadNodes]);

  // Memoized selectors
  const getNodesByNodeGroup = useCallback((nodeGroup: string) => {
    return nodes.filter(node => node.nodeGroup === nodeGroup);
  }, [nodes]);

  const getNodesByType = useCallback((type: string) => {
    return nodes.filter(node => node.type === type);
  }, [nodes]);

  const getActiveNodes = useCallback(() => {
    return nodes.filter(node => node.isActive);
  }, [nodes]);

  const getInactiveNodes = useCallback(() => {
    return nodes.filter(node => !node.isActive);
  }, [nodes]);

  // Get filtered nodes using store selector
  const filteredNodes = nodesSelectors.getFilteredNodes(useNodesStore.getState());

  return {
    // Data
    nodes,
    filteredNodes,
    isLoading,
    error,
    
    // Actions
    loadNodes,
    refreshNodes,
    clearError,
    
    // Selectors
    getNodesByNodeGroup,
    getNodesByType,
    getActiveNodes,
    getInactiveNodes,
    
    // Filtering
    setSearchQuery,
    setFilters,
    clearFilters: storeClearFilters,
  };
};

/**
 * Hook for accessing nodes data with automatic filtering
 * Useful for components that need filtered nodes based on search/filters
 */
export const useFilteredNodes = (searchQuery?: string, nodeGroupFilter?: string) => {
  const {
    nodes,
    isLoading,
    error,
    setSearchQuery,
    setFilters,
    clearError,
  } = useSharedNodes({ autoLoad: true });

  // Update filters when props change
  useEffect(() => {
    if (searchQuery !== undefined) {
      setSearchQuery(searchQuery);
    }
  }, [searchQuery, setSearchQuery]);

  useEffect(() => {
    if (nodeGroupFilter !== undefined) {
      setFilters({ 
        nodeGroup: nodeGroupFilter === "all" ? undefined : nodeGroupFilter 
      });
    }
  }, [nodeGroupFilter, setFilters]);

  // Get filtered nodes
  const filteredNodes = nodesSelectors.getFilteredNodes(useNodesStore.getState());

  return {
    nodes: filteredNodes,
    allNodes: nodes,
    isLoading,
    error,
    clearError,
  };
};

/**
 * Hook for accessing nodes grouped by category
 * Useful for sidebar components that display nodes by category
 */
export const useNodesByCategory = () => {
  const { nodes, isLoading, error, clearError } = useSharedNodes({ autoLoad: true });

  // Group nodes by category
  const nodesByCategory = nodes.reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = [];
    }
    acc[node.category].push(node);
    return acc;
  }, {} as Record<string, TNode[]>);

  // Get unique categories
  const categories = Object.keys(nodesByCategory).sort();

  return {
    nodesByCategory,
    categories,
    totalNodes: nodes.length,
    isLoading,
    error,
    clearError,
  };
};

/**
 * Hook for accessing nodes grouped by nodeGroup
 * Useful for sidebar components that display nodes by nodeGroup
 */
export const useNodesByNodeGroup = () => {
  const { nodes, isLoading, error, clearError } = useSharedNodes({ autoLoad: true });

  // Group nodes by nodeGroup
  const nodesByNodeGroup = nodes.reduce((acc, node) => {
    const groupName = node.nodeGroupName || 'Uncategorized';
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(node);
    return acc;
  }, {} as Record<string, TNode[]>);

  // Get unique nodeGroups
  const nodeGroups = Object.keys(nodesByNodeGroup).sort();

  return {
    nodesByNodeGroup,
    nodeGroups,
    totalNodes: nodes.length,
    isLoading,
    error,
    clearError,
  };
};

/**
 * Hook for accessing node statistics
 * Useful for dashboard components
 */
export const useNodeStats = () => {
  const { nodes, isLoading, error, clearError } = useSharedNodes({ autoLoad: true });

  // Calculate stats
  const stats = {
    total: nodes.length,
    active: nodes.filter(node => node.isActive).length,
    inactive: nodes.filter(node => !node.isActive).length,
    byType: nodes.reduce((acc, node) => {
      acc[node.type] = (acc[node.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byNodeGroup: nodes.reduce((acc, node) => {
      const groupName = node.nodeGroupName || 'Uncategorized';
      acc[groupName] = (acc[groupName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return {
    stats,
    isLoading,
    error,
    clearError,
  };
};
