"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconBell, IconCheck, IconAlertTriangle, IconInfoCircle } from "@tabler/icons-react";

/**
 * Notifications Dialog Component
 * 
 * Single responsibility: Displays notifications in a dialog
 */
interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  description: string;
  timestamp: string;
}

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Sample notifications - in production, these would come from an API
const sampleNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Workflow execution completed",
    description: "Workflow 'Data Processing' finished successfully.",
    timestamp: "2 minutes ago",
  },
  {
    id: "2",
    type: "info",
    title: "Workflow updated",
    description: "Your changes have been saved.",
    timestamp: "5 minutes ago",
  },
  {
    id: "3",
    type: "warning",
    title: "Workflow execution pending",
    description: "Workflow 'Email Automation' is waiting for dependencies.",
    timestamp: "10 minutes ago",
  },
  {
    id: "4",
    type: "success",
    title: "New workflow created",
    description: "Workflow 'Automated Report' has been created.",
    timestamp: "1 hour ago",
  },
];

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return <IconCheck className="h-5 w-5 text-green-600" />;
    case "error":
      return <IconAlertTriangle className="h-5 w-5 text-red-600" />;
    case "warning":
      return <IconAlertTriangle className="h-5 w-5 text-yellow-600" />;
    case "info":
      return <IconInfoCircle className="h-5 w-5 text-blue-600" />;
  }
};

export function NotificationsDialog({ open, onOpenChange }: NotificationsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconBell className="h-5 w-5" />
            Notifications
          </DialogTitle>
          <DialogDescription>
            View your recent notifications and updates.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
          {sampleNotifications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No notifications.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sampleNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

