import { useUIStore } from "@/stores/ui-store";

export function useNodeGroupExpansion(availableGroups: string[] = []) {
  const { 
    expandedNodeGroups, 
    toggleNodeGroup, 
    isNodeGroupExpanded, 
    expandAllNodeGroups, 
    collapseAllNodeGroups 
  } = useUIStore();

  const toggleGroup = (nodeGroup: string) => {
    toggleNodeGroup(nodeGroup);
  };

  const isExpanded = (nodeGroup: string) => isNodeGroupExpanded(nodeGroup);

  const expandAll = () => {
    expandAllNodeGroups(availableGroups);
  };

  const collapseAll = () => {
    collapseAllNodeGroups();
  };

  return {
    expandedGroups: expandedNodeGroups,
    toggleGroup,
    isExpanded,
    expandAll,
    collapseAll
  };
}
