"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWorkflowListStore } from "@/stores";
import { uiHelpers } from "@/stores";
import { TWorkflow } from "@/types";
import { WorkflowForm, WorkflowFormData } from "./workflow-form";

interface EditWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: TWorkflow | null;
}

export function EditWorkflowDialog({ open, onOpenChange, workflow }: EditWorkflowDialogProps) {
  const { updateWorkflow } = useWorkflowListStore();

  const handleSubmit = async (formData: WorkflowFormData) => {
    if (!workflow) {
      return;
    }

    try {
      const updatedWorkflow = {
        ...workflow,
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        workflow_type: formData.workflow_type,
        updatedAt: new Date(),
      };

      await updateWorkflow(workflow.id, updatedWorkflow);
      
      uiHelpers.showSuccess(
        "Workflow Updated",
        `Workflow "${formData.name}" has been updated successfully.`
      );

      // Close dialog
      onOpenChange(false);
      
    } catch (error) {
      console.error("Failed to update workflow:", error);
      uiHelpers.showError(
        "Update Failed",
        "Failed to update workflow. Please try again."
      );
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!workflow) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Workflow Information</DialogTitle>
          <DialogDescription>
            Update the workflow details below.
          </DialogDescription>
        </DialogHeader>
        
        <WorkflowForm
          initialData={{
            name: workflow.name,
            description: workflow.description,
            category: workflow.category || "",
            workflow_type: workflow.workflow_type,
          }}
          onSubmit={handleSubmit}
          submitButtonText="Update Workflow"
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}
