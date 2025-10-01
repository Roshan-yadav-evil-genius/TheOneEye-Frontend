"use client";

import { useAlert } from "@/hooks/use-alert";
import { Button } from "@/components/ui/button";

export function AlertDemo() {
  const alert = useAlert();

  const handleBasicConfirm = async () => {
    const confirmed = await alert.confirm({
      title: "Basic Confirmation",
      description: "This is a basic confirmation dialog. Do you want to proceed?",
    });
    
    if (confirmed) {
      console.log("User confirmed the action");
    } else {
      console.log("User cancelled the action");
    }
  };

  const handleDeleteConfirm = async () => {
    const confirmed = await alert.confirmDelete("My Important File", async () => {
      // Simulate async delete operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("File deleted successfully");
    });
    
    if (confirmed) {
      console.log("Delete confirmed");
    }
  };

  const handleActionConfirm = async () => {
    const confirmed = await alert.confirmAction(
      "Save Changes",
      "Are you sure you want to save these changes? This will overwrite the current data.",
      async () => {
        // Simulate async save operation
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Changes saved successfully");
      }
    );
    
    if (confirmed) {
      console.log("Save confirmed");
    }
  };

  const handleDestructiveAction = async () => {
    const confirmed = await alert.confirm({
      title: "Destructive Action",
      description: "This action will permanently remove all data. Are you absolutely sure?",
      confirmText: "Yes, Delete Everything",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Destructive action completed");
      },
    });
    
    if (confirmed) {
      console.log("Destructive action confirmed");
    }
  };

  const handleDeleteWithToast = async () => {
    const confirmed = await alert.confirmDeleteWithToast(
      "User Profile",
      async () => {
        // Simulate async delete operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("User profile deleted");
      },
      "User profile has been deleted successfully!"
    );
    
    if (confirmed) {
      console.log("Delete with toast confirmed");
    }
  };

  const handleActionWithToast = async () => {
    const confirmed = await alert.confirmActionWithToast(
      "Publish Article",
      "This will make your article visible to all users. Are you ready to publish?",
      async () => {
        // Simulate async publish operation
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Article published");
      },
      "Article published successfully!"
    );
    
    if (confirmed) {
      console.log("Publish with toast confirmed");
    }
  };

  const handleCustomConfirm = async () => {
    const confirmed = await alert.confirm({
      title: "Custom Confirmation",
      description: "This is a custom confirmation with custom button text and actions.",
      confirmText: "Proceed",
      cancelText: "Go Back",
      onConfirm: async () => {
        console.log("Custom action executed");
      },
      onCancel: () => {
        console.log("Custom cancel action executed");
      },
    });
    
    if (confirmed) {
      console.log("Custom confirmation accepted");
    }
  };

  const handleAsyncError = async () => {
    const confirmed = await alert.confirmWithToast(
      {
        title: "Test Error Handling",
        description: "This will simulate an error to test error handling with toasts.",
        confirmText: "Test Error",
        onConfirm: async () => {
          // Simulate an error
          throw new Error("Simulated error for testing");
        },
      },
      "Operation completed successfully!",
      "Operation failed! This is the error message."
    );
    
    if (confirmed) {
      console.log("Error test confirmed");
    }
  };

  return (
    <div className="space-y-4 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Alert Dialog Demo</h3>
      <p className="text-sm text-muted-foreground">
        Click the buttons below to test different types of alert dialogs and confirmations.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button onClick={handleBasicConfirm} variant="outline">
          Basic Confirmation
        </Button>
        
        <Button onClick={handleDeleteConfirm} variant="destructive">
          Delete Confirmation
        </Button>
        
        <Button onClick={handleActionConfirm} variant="default">
          Action Confirmation
        </Button>
        
        <Button onClick={handleDestructiveAction} variant="destructive">
          Destructive Action
        </Button>
        
        <Button onClick={handleDeleteWithToast} variant="outline">
          Delete with Toast
        </Button>
        
        <Button onClick={handleActionWithToast} variant="secondary">
          Action with Toast
        </Button>
        
        <Button onClick={handleCustomConfirm} variant="outline">
          Custom Confirmation
        </Button>
        
        <Button onClick={handleAsyncError} variant="outline">
          Test Error Handling
        </Button>
      </div>
      
      <div className="mt-4 p-3 bg-muted rounded-md">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> Check the browser console to see the confirmation results and async operations.
        </p>
      </div>
    </div>
  );
}
