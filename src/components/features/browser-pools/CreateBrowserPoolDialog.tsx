"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BrowserPoolForm, BrowserPoolFormData } from "./BrowserPoolForm";
import { useBrowserPoolStore } from "@/stores/browser-pool-store";
import { uiHelpers } from "@/stores";

interface CreateBrowserPoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBrowserPoolDialog({ open, onOpenChange }: CreateBrowserPoolDialogProps) {
  const { createPool } = useBrowserPoolStore();

  const handleSubmit = async (formData: BrowserPoolFormData) => {
    try {
      await createPool({
        name: formData.name,
        description: formData.description || null,
        session_ids: formData.session_ids,
      });
      uiHelpers.showSuccess("Browser Pool Created", `Pool "${formData.name}" has been created successfully.`);
      onOpenChange(false);
    } catch (error) {
      uiHelpers.showError("Creation Failed", "Failed to create pool. Please try again.");
      throw error;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Browser Pool</DialogTitle>
          <DialogDescription>
            Create a pool of browser sessions. At runtime, one session will be chosen from the pool (e.g. least used for the domain).
          </DialogDescription>
        </DialogHeader>
        <BrowserPoolForm
          onSubmit={handleSubmit}
          submitButtonText="Create Pool"
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
