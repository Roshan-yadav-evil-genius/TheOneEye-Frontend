"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  IconBell, 
  IconAlertTriangle, 
  IconCheck, 
  IconInfoCircle, 
  IconPlus,
  IconSettings
} from "@tabler/icons-react";

export function ToastDemo() {
  const toast = useToast();

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
  );
}
