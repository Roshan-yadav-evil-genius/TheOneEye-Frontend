import { useState } from "react";

export function useNodeGroupExpansion() {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (nodeGroup: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(nodeGroup)) {
      newExpanded.delete(nodeGroup);
    } else {
      newExpanded.add(nodeGroup);
    }
    setExpandedGroups(newExpanded);
  };

  const isExpanded = (nodeGroup: string) => expandedGroups.has(nodeGroup);

  const expandAll = () => {
    // This could be enhanced to accept a list of all available groups
    setExpandedGroups(new Set());
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  return {
    expandedGroups,
    toggleGroup,
    isExpanded,
    expandAll,
    collapseAll
  };
}
