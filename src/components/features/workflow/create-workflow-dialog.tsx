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
import { WorkflowForm, WorkflowFormData } from "./workflow-form";

interface CreateWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWorkflowDialog({ open, onOpenChange }: CreateWorkflowDialogProps) {
  const { createWorkflow, workflows } = useWorkflowListStore();

  const tagSuggestions = [...new Set(workflows.flatMap((w) => w.tags || []))];

  const handleSubmit = async (formData: WorkflowFormData) => {
    try {
      const workflowData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        workflow_type: formData.workflow_type,
        nodes: [],
        connections: [],
        status: 'inactive' as const,
        runsCount: 0,
        tags: formData.tags ?? [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "current-user", // TODO: Get from auth context
      };

      await createWorkflow(workflowData);
      
      uiHelpers.showSuccess(
        "Workflow Created",
        `Workflow "${formData.name}" has been created successfully.`
      );

      // Close dialog
      onOpenChange(false);
      
    } catch (error) {
      console.error("Failed to create workflow:", error);
      uiHelpers.showError(
        "Creation Failed",
        "Failed to create workflow. Please try again."
      );
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Workflow</DialogTitle>
          <DialogDescription>
            Create a new workflow to automate your processes. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        
        <WorkflowForm
          initialData={{ tags: [] }}
          tagSuggestions={tagSuggestions}
          onSubmit={handleSubmit}
          submitButtonText="Create Workflow"
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}
