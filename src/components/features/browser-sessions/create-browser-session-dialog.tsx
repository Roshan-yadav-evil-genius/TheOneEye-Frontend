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
import { BrowserSessionForm } from "./browser-session-form";
import { BrowserSessionFormData } from "@/types/browser-session";

interface CreateBrowserSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBrowserSessionDialog({ open, onOpenChange }: CreateBrowserSessionDialogProps) {
  const { createSession } = useBrowserSessionStore();

  const handleSubmit = async (formData: BrowserSessionFormData) => {
    try {
      const sessionData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        browser_type: formData.browser_type,
        playwright_config: formData.playwright_config,
        status: 'inactive' as const,
        created_by: "current-user", // TODO: Get from auth context
      };

      await createSession(sessionData);
      
      uiHelpers.showSuccess(
        "Browser Session Created",
        `Browser session "${formData.name}" has been created successfully.`
      );

      // Close dialog
      onOpenChange(false);
      
    } catch (error) {
      console.error("Failed to create browser session:", error);
      uiHelpers.showError(
        "Creation Failed",
        "Failed to create browser session. Please try again."
      );
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Browser Session</DialogTitle>
          <DialogDescription>
            Create a new browser session for automation. Configure the browser type and Playwright settings.
          </DialogDescription>
        </DialogHeader>
        
        <BrowserSessionForm
          onSubmit={handleSubmit}
          submitButtonText="Create Session"
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}




