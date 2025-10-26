import { TWorkflow } from "@/types";
import { useWorkflowTable as useWorkflowTableStore } from "@/stores/workflow-table-store";

interface UseWorkflowTableProps {
  workflows: TWorkflow[];
}

export const useWorkflowTable = ({ workflows }: UseWorkflowTableProps) => {
  return useWorkflowTableStore(workflows);
};
