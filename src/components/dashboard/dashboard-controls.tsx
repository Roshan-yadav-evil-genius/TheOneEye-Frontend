"use client";

import { useAlert } from "@/hooks/use-alert";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  IconBell, 
  IconAlertTriangle, 
  IconCheck, 
  IconInfoCircle, 
  IconTrash, 
  IconDeviceFloppy, 
  IconSettings,
  IconPlus,
  IconEdit
} from "@tabler/icons-react";

export function DashboardControls() {
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

  const handleSuccessToast = () => {
    toast.success("Operation completed successfully!", {
      description: "Your data has been saved.",
    });
  };

  const handleErrorToast = () => {
    toast.error("Something went wrong!", {
      description: "Please try again later.",
    });
  };

  const handleWarningToast = () => {
    toast.warning("Please review your input", {
      description: "Some fields may need attention.",
    });
  };

  const handleInfoToast = () => {
    toast.info("New feature available!", {
      description: "Check out the latest updates.",
    });
  };

  const handleLoadingToast = () => {
    const loadingToast = toast.loading("Processing your request...");
    
    // Simulate async operation
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success("Request completed!");
    }, 3000);
  };

  const handlePromiseToast = () => {
    const fetchData = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.5) {
            resolve("Data fetched!");
          } else {
            reject("Network error");
          }
        }, 2000);
      });
    };

    toast.promise(fetchData(), {
      loading: "Fetching data...",
      success: "Data loaded successfully!",
      error: "Failed to load data. Please try again.",
    });
  };

  const handleWithActionToast = () => {
    toast.success("File uploaded successfully!", {
      description: "Your file is ready for processing.",
      action: {
        label: "View",
        onClick: () => console.log("View file clicked"),
      },
      cancel: {
        label: "Dismiss",
        onClick: () => console.log("Dismissed"),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPlus className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common actions you can perform from the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="default" className="justify-start">
              <IconPlus className="h-4 w-4 mr-2" />
              Create New Workflow
            </Button>
            <Button variant="outline" className="justify-start">
              <IconEdit className="h-4 w-4 mr-2" />
              Edit Existing Workflow
            </Button>
            <Button variant="outline" className="justify-start">
              <IconSettings className="h-4 w-4 mr-2" />
              Configure Settings
            </Button>
            <Button variant="outline" className="justify-start">
              <IconBell className="h-4 w-4 mr-2" />
              View Notifications
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total Workflows</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Nodes</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +5 from last week
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Projects</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +1 new project
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Success Rate</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">
              +0.5% from last month
            </p>
          </div>
        </div>
      </div>

      {/* Alert Dialog Controls */}
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

      {/* Toast Notification Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBell className="h-5 w-5" />
            Toast Notification Controls
          </CardTitle>
          <CardDescription>
            Test different types of toast notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button onClick={handleSuccessToast} variant="outline" className="justify-start">
              <IconCheck className="h-4 w-4 mr-2 text-green-600" />
              Success Toast
            </Button>
            
            <Button onClick={handleErrorToast} variant="outline" className="justify-start">
              <IconAlertTriangle className="h-4 w-4 mr-2 text-red-600" />
              Error Toast
            </Button>
            
            <Button onClick={handleWarningToast} variant="outline" className="justify-start">
              <IconAlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
              Warning Toast
            </Button>
            
            <Button onClick={handleInfoToast} variant="outline" className="justify-start">
              <IconInfoCircle className="h-4 w-4 mr-2 text-blue-600" />
              Info Toast
            </Button>
            
            <Button onClick={handleLoadingToast} variant="outline" className="justify-start">
              <IconBell className="h-4 w-4 mr-2" />
              Loading Toast
            </Button>
            
            <Button onClick={handlePromiseToast} variant="outline" className="justify-start">
              <IconPlus className="h-4 w-4 mr-2" />
              Promise Toast
            </Button>
            
            <Button onClick={handleWithActionToast} variant="outline" className="justify-start">
              <IconSettings className="h-4 w-4 mr-2" />
              Toast with Actions
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
