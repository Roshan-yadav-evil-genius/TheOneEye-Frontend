import { useMemo } from "react";
import { BackendNodeType } from "@/types/api/backend";

interface UseNodeFilteringProps {
  nodesByNodeGroup: Record<string, BackendNodeType[]>;
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
                             (node.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        // Handle BackendNodeType structure for nodeGroup matching
        const nodeGroupName = node.node_group?.name || '';
        const matchesNodeGroup = nodeGroupFilter === "all" || nodeGroupName === nodeGroupFilter;
        
        return matchesSearch && matchesNodeGroup;
      });
      
      if (filteredNodes.length > 0) {
        acc[nodeGroup] = filteredNodes;
      }
      return acc;
    }, {} as Record<string, BackendNodeType[]>);
  }, [nodesByNodeGroup, searchTerm, nodeGroupFilter]);

  return {
    filteredNodesByNodeGroup
  };
}
