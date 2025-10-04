"use client";

import { useAlert } from "@/hooks/use-alert";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  IconAlertTriangle, 
  IconCheck, 
  IconTrash, 
  IconDeviceFloppy, 
  IconSettings,
  IconEdit
} from "@tabler/icons-react";

export function AlertDialogDemo() {
  const alert = useAlert();
  const toast = useToast();

  const handleBasicConfirm = async () => {
    const confirmed = await alert.confirm({
      title: "Basic Confirmation",
      description: "This is a basic confirmation dialog. Do you want to proceed?",
    });
    
    if (confirmed) {
      toast.success("Action confirmed!", {
        description: "You clicked confirm on the basic dialog."
      });
    } else {
      toast.info("Action cancelled", {
        description: "You cancelled the basic dialog."
      });
    }
  };

  const handleDeleteConfirm = async () => {
    const confirmed = await alert.confirmDelete("Sample Workflow", async () => {
      // Simulate async delete operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Workflow deleted successfully");
    });
    
    if (confirmed) {
      toast.success("Workflow deleted successfully!");
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
      toast.success("Changes saved successfully!");
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
      toast.success("Destructive action completed!");
    }
  };

  const handleDeleteWithToast = async () => {
    const confirmed = await alert.confirmDeleteWithToast(
      "Test Node",
      async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Node deleted successfully");
      },
      "Node deleted successfully!"
    );
    
    if (confirmed) {
      console.log("Delete with toast confirmed");
    }
  };

  const handleActionWithToast = async () => {
    const confirmed = await alert.confirmActionWithToast(
      "Publish Workflow",
      "This will make your workflow public and available to all users.",
      async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Workflow published successfully");
      },
      "Workflow published successfully!",
      "Failed to publish workflow"
    );
    
    if (confirmed) {
      console.log("Action with toast confirmed");
    }
  };

  const handleCustomConfirm = async () => {
    const confirmed = await alert.confirm({
      title: "Custom Confirmation",
      description: "This is a custom confirmation with specific styling and behavior.",
      confirmText: "Proceed",
      cancelText: "Go Back",
      variant: "default",
      onConfirm: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Custom action completed");
      },
    });
    
    if (confirmed) {
      toast.success("Custom action completed!");
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconAlertTriangle className="h-5 w-5" />
          Alert Dialog Controls
        </CardTitle>
        <CardDescription>
          Test different types of alert dialogs and confirmations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button onClick={handleBasicConfirm} variant="outline" className="justify-start">
            <IconCheck className="h-4 w-4 mr-2" />
            Basic Confirmation
          </Button>
          
          <Button onClick={handleDeleteConfirm} variant="destructive" className="justify-start">
            <IconTrash className="h-4 w-4 mr-2" />
            Delete Confirmation
          </Button>
          
          <Button onClick={handleActionConfirm} variant="default" className="justify-start">
            <IconDeviceFloppy className="h-4 w-4 mr-2" />
            Action Confirmation
          </Button>
          
          <Button onClick={handleDestructiveAction} variant="destructive" className="justify-start">
            <IconAlertTriangle className="h-4 w-4 mr-2" />
            Destructive Action
          </Button>
          
          <Button onClick={handleDeleteWithToast} variant="outline" className="justify-start">
            <IconTrash className="h-4 w-4 mr-2" />
            Delete with Toast
          </Button>
          
          <Button onClick={handleActionWithToast} variant="secondary" className="justify-start">
            <IconEdit className="h-4 w-4 mr-2" />
            Action with Toast
          </Button>
          
          <Button onClick={handleCustomConfirm} variant="outline" className="justify-start">
            <IconSettings className="h-4 w-4 mr-2" />
            Custom Confirmation
          </Button>
          
          <Button onClick={handleAsyncError} variant="outline" className="justify-start">
            <IconAlertTriangle className="h-4 w-4 mr-2" />
            Test Error Handling
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
