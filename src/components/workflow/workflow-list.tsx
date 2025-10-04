"use client";
import { useState } from "react"
import { useRouter } from "next/navigation"
import { WorkflowTable } from "@/components/workflow/workflow-table"
import { CreateWorkflowDialog } from "@/components/workflow/create-workflow-dialog"
import { EditWorkflowDialog } from "@/components/workflow/edit-workflow-dialog"
import { DeleteWorkflowDialog } from "@/components/workflow/delete-workflow-dialog"
import { Button } from "@/components/ui/button"
import { IconPlus, IconSearch } from "@tabler/icons-react"
import { TWorkflow } from "@/types"
import { useUIStore, uiHelpers } from "@/stores/ui-store"
import { useWorkflowStore } from "@/stores"

interface WorkflowListProps {
  workflows: TWorkflow[]
}

export function WorkflowList({
  workflows,
}: WorkflowListProps) {
  const router = useRouter()
  const { modals } = useUIStore()
  const { deleteTWorkflow } = useWorkflowStore()
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [workflowToDelete, setWorkflowToDelete] = useState<{ id: string; name: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [workflowToEdit, setWorkflowToEdit] = useState<TWorkflow | null>(null)

  const handleRun = (id: string) => {
    // TODO: Implement workflow execution
    console.log('Run workflow:', id);
  }

  const handleStop = (id: string) => {
    // TODO: Implement workflow stop
    console.log('Stop workflow:', id);
  }

  const handleEditInfo = (workflow: TWorkflow) => {
    setWorkflowToEdit(workflow)
    setEditDialogOpen(true)
  }

  const handleEditWorkflow = (id: string) => {
    router.push(`/workflow/${id}`)
  }

  const handleView = (id: string) => {
    router.push(`/workflow/${id}/details`)
  }

  const handleDelete = (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    if (workflow) {
      setWorkflowToDelete({ id, name: workflow.name });
      setDeleteDialogOpen(true);
    }
  }

  const handleConfirmDelete = async () => {
    if (!workflowToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteTWorkflow(workflowToDelete.id);
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
  }

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setWorkflowToDelete(null);
  }

  const handleCreate = () => {
    uiHelpers.openCreateWorkflowModal()
  }

  return (
    <div className="space-y-6">
      {/* Workflow table */}
      {workflows.length > 0 ? (
        <WorkflowTable
          workflows={workflows}
          onRun={handleRun}
          onStop={handleStop}
          onEditInfo={handleEditInfo}
          onEditWorkflow={handleEditWorkflow}
          onView={handleView}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <IconSearch className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No workflows found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first workflow
          </p>
          <Button onClick={handleCreate}>
            <IconPlus className="mr-2 h-4 w-4" />
            Create Workflow
          </Button>
        </div>
      )}

      {/* Create Workflow Dialog */}
      <CreateWorkflowDialog
        open={modals.createWorkflow}
        onOpenChange={(open) => {
          if (!open) {
            useUIStore.getState().closeModal('createWorkflow');
          }
        }}
      />

      {/* Edit Workflow Dialog */}
      <EditWorkflowDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        workflow={workflowToEdit}
      />

      {/* Delete Workflow Dialog */}
      <DeleteWorkflowDialog
        open={deleteDialogOpen}
        onOpenChange={handleCancelDelete}
        workflowName={workflowToDelete?.name || ""}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}
