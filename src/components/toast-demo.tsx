"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export function ToastDemo() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success("Operation completed successfully!", {
      description: "Your data has been saved.",
    });
  };

  const handleError = () => {
    toast.error("Something went wrong!", {
      description: "Please try again later.",
    });
  };

  const handleWarning = () => {
    toast.warning("Please review your input", {
      description: "Some fields may need attention.",
    });
  };

  const handleInfo = () => {
    toast.info("New feature available!", {
      description: "Check out the latest updates.",
    });
  };

  const handleLoading = () => {
    const loadingToast = toast.loading("Processing your request...");
    
    // Simulate async operation
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success("Request completed!");
    }, 3000);
  };

  const handlePromise = () => {
    const fetchData = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          Math.random() > 0.5 ? resolve("Data fetched!") : reject("Network error");
        }, 2000);
      });
    };

    toast.promise(fetchData(), {
      loading: "Fetching data...",
      success: "Data loaded successfully!",
      error: "Failed to load data. Please try again.",
    });
  };

  const handleWithAction = () => {
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
    <div className="space-y-4 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Toast Notifications Demo</h3>
      <p className="text-sm text-muted-foreground">
        Click the buttons below to test different types of toast notifications.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Button onClick={handleSuccess} variant="default">
          Success Toast
        </Button>
        
        <Button onClick={handleError} variant="destructive">
          Error Toast
        </Button>
        
        <Button onClick={handleWarning} variant="outline">
          Warning Toast
        </Button>
        
        <Button onClick={handleInfo} variant="secondary">
          Info Toast
        </Button>
        
        <Button onClick={handleLoading} variant="outline">
          Loading Toast
        </Button>
        
        <Button onClick={handlePromise} variant="outline">
          Promise Toast
        </Button>
        
        <Button onClick={handleWithAction} variant="outline" className="col-span-2 md:col-span-1">
          Toast with Action
        </Button>
      </div>
    </div>
  );
}
