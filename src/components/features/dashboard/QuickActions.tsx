"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBell, IconMessage } from "@tabler/icons-react";

/**
 * Quick Actions Component
 * 
 * Single responsibility: Displays action buttons and triggers handlers
 */
interface QuickActionsProps {
  onShowToastNotifications?: () => void;
  onOpenNotificationsDialog?: () => void;
}

export function QuickActions({
  onShowToastNotifications,
  onOpenNotificationsDialog,
}: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconBell className="h-5 w-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          View your notifications and updates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {onShowToastNotifications && (
            <Button 
              variant="default" 
              className="justify-start"
              onClick={onShowToastNotifications}
            >
              <IconBell className="h-4 w-4 mr-2" />
              Show Toast Notifications
            </Button>
          )}
          {onOpenNotificationsDialog && (
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={onOpenNotificationsDialog}
            >
              <IconMessage className="h-4 w-4 mr-2" />
              Open Notifications Dialog
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
