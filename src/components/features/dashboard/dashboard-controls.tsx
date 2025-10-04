import { QuickActions } from "./QuickActions";
import { DashboardMetrics } from "./DashboardMetrics";
import { AlertDialogDemo } from "./AlertDialogDemo";
import { ToastDemo } from "./ToastDemo";

interface DashboardControlsProps {
  onCreateWorkflow?: () => void;
  onEditWorkflow?: () => void;
  onConfigureSettings?: () => void;
  onViewNotifications?: () => void;
  showDemo?: boolean;
}

export function DashboardControls({
  onCreateWorkflow,
  onEditWorkflow,
  onConfigureSettings,
  onViewNotifications,
  showDemo = false,
}: DashboardControlsProps) {
  return (
    <div className="space-y-6">
      <QuickActions
        onCreateWorkflow={onCreateWorkflow}
        onEditWorkflow={onEditWorkflow}
        onConfigureSettings={onConfigureSettings}
        onViewNotifications={onViewNotifications}
      />

      <DashboardMetrics />

      {showDemo && (
        <>
          <AlertDialogDemo />
          <ToastDemo />
        </>
      )}
    </div>
  );
}
