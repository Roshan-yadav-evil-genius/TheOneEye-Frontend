import { useMemo } from "react";
import { TNode } from "@/types";
import { BackendNodeType } from "@/types/api/backend";

interface UseNodeFilteringProps {
  nodesByNodeGroup: Record<string, (TNode | BackendNodeType)[]>;
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
        
        // Handle both TNode and BackendNodeType structures for nodeGroup matching
        const nodeGroupName = ('node_group' in node && node.node_group?.name) 
          ? node.node_group.name 
          : ('nodeGroupName' in node ? node.nodeGroupName : '');
        const matchesNodeGroup = nodeGroupFilter === "all" || nodeGroupName === nodeGroupFilter;
        
        return matchesSearch && matchesNodeGroup;
      });
      
      if (filteredNodes.length > 0) {
        acc[nodeGroup] = filteredNodes;
      }
      return acc;
    }, {} as Record<string, (TNode | BackendNodeType)[]>);
  }, [nodesByNodeGroup, searchTerm, nodeGroupFilter]);

  return {
    filteredNodesByNodeGroup
  };
}
