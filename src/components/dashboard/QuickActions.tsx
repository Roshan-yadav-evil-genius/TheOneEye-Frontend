import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  IconBell, 
  IconDeviceFloppy, 
  IconSettings,
  IconPlus,
  IconEdit
} from "@tabler/icons-react";

interface QuickActionsProps {
  onCreateWorkflow?: () => void;
  onEditWorkflow?: () => void;
  onConfigureSettings?: () => void;
  onViewNotifications?: () => void;
}

export function QuickActions({
  onCreateWorkflow,
  onEditWorkflow,
  onConfigureSettings,
  onViewNotifications,
}: QuickActionsProps) {
  return (
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
          <Button 
            variant="default" 
            className="justify-start"
            onClick={onCreateWorkflow}
          >
            <IconPlus className="h-4 w-4 mr-2" />
            Create New Workflow
          </Button>
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={onEditWorkflow}
          >
            <IconEdit className="h-4 w-4 mr-2" />
            Edit Existing Workflow
          </Button>
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={onConfigureSettings}
          >
            <IconSettings className="h-4 w-4 mr-2" />
            Configure Settings
          </Button>
          <Button 
            variant="outline" 
            className="justify-start"
            onClick={onViewNotifications}
          >
            <IconBell className="h-4 w-4 mr-2" />
            View Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
