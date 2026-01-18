"use client";
import { WorkflowTable } from "@/components/features/workflow/workflow-table";
import { CreateWorkflowDialog } from "@/components/features/workflow/create-workflow-dialog";
import { EditWorkflowDialog } from "@/components/features/workflow/edit-workflow-dialog";
import { DeleteWorkflowDialog } from "@/components/features/workflow/delete-workflow-dialog";
import { Button } from "@/components/ui/button";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { TWorkflow } from "@/types";
import { useWorkflowList } from "@/hooks/useWorkflowList";
import { useUIStore } from "@/stores";

interface WorkflowListProps {
  workflows: TWorkflow[];
}

export function WorkflowList({
  workflows,
}: WorkflowListProps) {
  const {
    modals,
    deleteDialogOpen,
    workflowToDelete,
    isDeleting,
    editDialogOpen,
    setEditDialogOpen,
    workflowToEdit,
    handleRun,
    handleStop,
    handleEditInfo,
    handleEditWorkflow,
    handleDuplicate,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
    handleCreate,
  } = useWorkflowList({ workflows });

  return (
    <div className="space-y-6 py-6">
      {/* Workflow table */}
      {workflows.length > 0 ? (
        <WorkflowTable
          workflows={workflows}
          onRun={handleRun}
          onStop={handleStop}
          onEditInfo={handleEditInfo}
          onEditWorkflow={handleEditWorkflow}
          onDuplicate={handleDuplicate}
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
  );
}
