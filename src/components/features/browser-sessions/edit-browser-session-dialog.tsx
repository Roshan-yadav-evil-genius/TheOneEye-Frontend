"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBrowserSessionStore } from "@/stores/browser-session-store";
import { uiHelpers } from "@/stores/ui-store";
import { BrowserSessionForm, BrowserSessionFormData } from "./browser-session-form";
import { TBrowserSession } from "@/types/browser-session";

interface EditBrowserSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: TBrowserSession | null;
}

export function EditBrowserSessionDialog({ open, onOpenChange, session }: EditBrowserSessionDialogProps) {
  const { updateSession } = useBrowserSessionStore();

  const handleSubmit = async (formData: BrowserSessionFormData) => {
    if (!session) return;

    try {
      const sessionData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        browser_type: formData.browser_type,
        playwright_config: formData.playwright_config,
        status: session.status, // Keep existing status
        tags: session.tags, // Keep existing tags
      };

      await updateSession(session.id, sessionData);
      
      uiHelpers.showSuccess(
        "Browser Session Updated",
        `Browser session "${formData.name}" has been updated successfully.`
      );

      // Close dialog
      onOpenChange(false);
      
    } catch (error) {
      console.error("Failed to update browser session:", error);
      uiHelpers.showError(
        "Update Failed",
        "Failed to update browser session. Please try again."
      );
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const initialData = session ? {
    name: session.name,
    description: session.description,
    browser_type: session.browser_type,
    playwright_config: session.playwright_config,
  } : {};

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Browser Session</DialogTitle>
          <DialogDescription>
            Update the browser session configuration and Playwright settings.
          </DialogDescription>
        </DialogHeader>
        
        <BrowserSessionForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitButtonText="Update Session"
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}




