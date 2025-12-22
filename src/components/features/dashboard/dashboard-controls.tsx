"use client";

import { useState } from "react";
import { QuickActions } from "./QuickActions";
import { DashboardMetrics } from "./DashboardMetrics";
import { NotificationsDialog } from "./NotificationsDialog";
import { AlertDialogDemo } from "./AlertDialogDemo";
import { ToastDemo } from "./ToastDemo";
import { toastService } from "@/lib/services/toast-service";

/**
 * Dashboard Controls Component
 * 
 * Single responsibility: Manages dialog state and coordinates quick actions
 * Delegates UI rendering to child components
 */
interface DashboardControlsProps {
  showDemo?: boolean;
}

export function DashboardControls({
  showDemo = false,
}: DashboardControlsProps) {
  const [isNotificationsDialogOpen, setIsNotificationsDialogOpen] = useState(false);

  const handleShowToastNotifications = () => {
    // Show sample toast notifications
    toastService.info("New workflow execution completed", {
      description: "Workflow 'Data Processing' finished successfully.",
    });

    setTimeout(() => {
      toastService.success("Workflow updated", {
        description: "Your changes have been saved.",
      });
    }, 1000);

    setTimeout(() => {
      toastService.warning("Workflow execution pending", {
        description: "Workflow 'Email Automation' is waiting for dependencies.",
      });
    }, 2000);
  };

  const handleOpenNotificationsDialog = () => {
    setIsNotificationsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <QuickActions
        onShowToastNotifications={handleShowToastNotifications}
        onOpenNotificationsDialog={handleOpenNotificationsDialog}
      />

      <DashboardMetrics />

      {/* Dialogs */}
      <NotificationsDialog
        open={isNotificationsDialogOpen}
        onOpenChange={setIsNotificationsDialogOpen}
      />

      {showDemo && (
        <>
          <AlertDialogDemo />
          <ToastDemo />
        </>
      )}
    </div>
  );
}
