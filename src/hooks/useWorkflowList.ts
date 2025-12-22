import { useState } from "react";
import { useRouter } from "next/navigation";
import { TWorkflow } from "@/types";
import { useUIStore, uiHelpers, useWorkflowListStore } from "@/stores";
import { workflowApi } from "@/lib/api/services/workflow-api";

interface UseWorkflowListProps {
  workflows: TWorkflow[];
}

export const useWorkflowList = ({ workflows }: UseWorkflowListProps) => {
  const router = useRouter();
  const { modals } = useUIStore();
  const { deleteWorkflow, loadWorkflows } = useWorkflowListStore();
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [workflowToEdit, setWorkflowToEdit] = useState<TWorkflow | null>(null);

  const handleRun = async (id: string) => {
    try {
      await workflowApi.startWorkflowExecution(id);
      uiHelpers.showSuccess(
        "Workflow Started",
        "Workflow execution has been started successfully."
      );
      // Refresh workflow list to show updated status
      await loadWorkflows();
    } catch (error) {
      console.error("Failed to start workflow:", error);
      uiHelpers.showError(
        "Execution Failed",
        "Failed to start workflow execution. Please try again."
      );
    }
  };

  const handleStop = async (id: string) => {
    try {
      await workflowApi.stopWorkflowExecution(id);
      uiHelpers.showSuccess(
        "Workflow Stopped",
        "Workflow execution has been stopped successfully."
      );
      // Refresh workflow list to show updated status
      await loadWorkflows();
    } catch (error) {
      console.error("Failed to stop workflow:", error);
      uiHelpers.showError(
        "Stop Failed",
        "Failed to stop workflow execution. Please try again."
      );
    }
  };

  const handleEditInfo = (workflow: TWorkflow) => {
    setWorkflowToEdit(workflow);
    setEditDialogOpen(true);
  };

  const handleEditWorkflow = (id: string) => {
    router.push(`/workflow/${id}`);
  };

  const handleDelete = (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    if (workflow) {
      setWorkflowToDelete({ id, name: workflow.name });
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!workflowToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteWorkflow(workflowToDelete.id);
      uiHelpers.showSuccess(
        "Workflow Deleted",
        `Workflow "${workflowToDelete.name}" has been deleted successfully.`
      );
      setDeleteDialogOpen(false);
      setWorkflowToDelete(null);
    } catch (error) {
      console.error("Failed to delete workflow:", error);
      uiHelpers.showError(
        "Deletion Failed",
        "Failed to delete workflow. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setWorkflowToDelete(null);
  };

  const handleCreate = () => {
    uiHelpers.openCreateWorkflowModal();
  };

  return {
    // State
    modals,
    deleteDialogOpen,
    workflowToDelete,
    isDeleting,
    editDialogOpen,
    setEditDialogOpen,
    workflowToEdit,
    
    // Actions
    handleRun,
    handleStop,
    handleEditInfo,
    handleEditWorkflow,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
    handleCreate,
  };
};
