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
import type { TBrowserPool } from "@/types/browser-pool";

interface EditBrowserPoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pool: TBrowserPool | null;
}

export function EditBrowserPoolDialog({ open, onOpenChange, pool }: EditBrowserPoolDialogProps) {
  const { updatePool } = useBrowserPoolStore();

  const handleSubmit = async (formData: BrowserPoolFormData) => {
    if (!pool) return;
    try {
      await updatePool(pool.id, {
        name: formData.name,
        description: formData.description || null,
        session_ids: formData.session_ids,
      });
      uiHelpers.showSuccess("Browser Pool Updated", `Pool "${formData.name}" has been updated.`);
      onOpenChange(false);
    } catch (error) {
      uiHelpers.showError("Update Failed", "Failed to update pool. Please try again.");
      throw error;
    }
  };

  const initialData: Partial<BrowserPoolFormData> = pool
    ? { name: pool.name, description: pool.description ?? "", session_ids: pool.session_ids ?? [] }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Browser Pool</DialogTitle>
          <DialogDescription>
            Update pool name, description, and sessions. At least one session is required.
          </DialogDescription>
        </DialogHeader>
        <BrowserPoolForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitButtonText="Update Pool"
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
