"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OAuth2Form } from "./OAuth2Form";
import { OAuth2FormData } from "@/types/auth";
import { uiHelpers } from "@/stores/ui-store";

interface CreateOAuth2DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateOAuth2Dialog({ open, onOpenChange }: CreateOAuth2DialogProps) {
  const handleSubmit = async (formData: OAuth2FormData) => {
    try {
      // TODO: Implement API call to create OAuth2 auth
      console.log("OAuth2 form data:", formData);
      
      uiHelpers.showSuccess(
        "OAuth2 Created",
        `OAuth2 "${formData.title}" has been created successfully.`
      );

      // Close dialog
      onOpenChange(false);
      
    } catch (error) {
      console.error("Failed to create OAuth2:", error);
      uiHelpers.showError(
        "Creation Failed",
        "Failed to create OAuth2. Please try again."
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
          <DialogTitle>Create OAuth2</DialogTitle>
          <DialogDescription>
            Create a new OAuth2 authentication configuration. Enter the required credentials.
          </DialogDescription>
        </DialogHeader>
        
        <OAuth2Form
          onSubmit={handleSubmit}
          submitButtonText="Create OAuth2"
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}

