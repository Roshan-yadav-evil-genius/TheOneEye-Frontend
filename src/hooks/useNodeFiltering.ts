import { useMemo } from "react";
import { TNode } from "@/types";

interface UseNodeFilteringProps {
  nodesByNodeGroup: Record<string, TNode[]>;
  searchTerm: string;
  nodeGroupFilter: string;
}

export function useNodeFiltering({ 
  nodesByNodeGroup, 
  searchTerm, 
  nodeGroupFilter 
}: UseNodeFilteringProps) {
  const filteredNodesByNodeGroup = useMemo(() => {
    return Object.entries(nodesByNodeGroup).reduce((acc, [nodeGroup, nodes]) => {
      const filteredNodes = nodes.filter(node => {
        const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             node.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesNodeGroup = nodeGroupFilter === "all" || node.nodeGroupName === nodeGroupFilter;
        
        return matchesSearch && matchesNodeGroup;
      });
      
      if (filteredNodes.length > 0) {
        acc[nodeGroup] = filteredNodes;
      }
      return acc;
    }, {} as Record<string, TNode[]>);
  }, [nodesByNodeGroup, searchTerm, nodeGroupFilter]);

  return {
    filteredNodesByNodeGroup
  };
}
