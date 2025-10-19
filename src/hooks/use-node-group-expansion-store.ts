import { useUIStore, uiHelpers } from '@/stores';

/**
 * Hook for managing node group expansion state using Zustand store
 * This replaces the old useNodeGroupExpansion hook with centralized state management
 */
export const useNodeGroupExpansionStore = (availableGroups: string[] = []) => {
  const expandedGroups = useUIStore((state) => state.expandedNodeGroups);
  const toggleGroup = useUIStore((state) => state.toggleNodeGroup);
  const expandGroup = useUIStore((state) => state.expandNodeGroup);
  const collapseGroup = useUIStore((state) => state.collapseNodeGroup);
  const expandAll = useUIStore((state) => state.expandAllNodeGroups);
  const collapseAll = useUIStore((state) => state.collapseAllNodeGroups);
  const isExpanded = useUIStore((state) => state.isNodeGroupExpanded);

  return {
    expandedGroups,
    toggleGroup,
    expandGroup,
    collapseGroup,
    isExpanded,
    expandAll: () => expandAll(availableGroups),
    collapseAll,
    // Helper functions for convenience
    toggle: uiHelpers.toggleNodeGroup,
    expandAllGroups: () => uiHelpers.expandAllNodeGroups(availableGroups),
    collapseAllGroups: uiHelpers.collapseAllNodeGroups,
  };
};
