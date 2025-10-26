import { BackendNodeType } from "@/types/api/backend";
import { useNodesTable as useNodesTableStore } from "@/stores/nodes-table-store";

interface UseNodesTableProps {
  nodes: BackendNodeType[];
}

export const useNodesTable = ({ nodes }: UseNodesTableProps) => {
  return useNodesTableStore(nodes);
};
