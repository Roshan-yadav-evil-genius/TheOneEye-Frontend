"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IconTrash, IconBrandGoogle } from "@tabler/icons-react";
import { TGoogleConnectedAccount, GOOGLE_OAUTH_SCOPES } from "@/types";

interface GoogleAccountCardProps {
  account: TGoogleConnectedAccount;
  onDelete: (accountId: string) => Promise<void>;
  isDeleting?: boolean;
}

export function GoogleAccountCard({
  account,
  onDelete,
  isDeleting = false,
}: GoogleAccountCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete(account.id);
    setIsDeleteDialogOpen(false);
  };

  // Get scope labels for display
  const getScopeLabel = (scopeKey: string): string => {
    const scope = GOOGLE_OAUTH_SCOPES[scopeKey as keyof typeof GOOGLE_OAUTH_SCOPES];
    return scope?.label || scopeKey;
  };

  // Get initials from email for avatar fallback
  const getInitials = (email: string): string => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={account.picture || undefined} alt={account.email} />
              <AvatarFallback className="bg-primary/10">
                {getInitials(account.email)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <IconBrandGoogle className="h-4 w-4 text-blue-500" />
                {account.name}
              </CardTitle>
              <CardDescription className="text-sm">
                {account.email}
              </CardDescription>
            </div>
          </div>

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                disabled={isDeleting}
              >
                <IconTrash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Disconnect Google Account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove access to {account.email}. Workflows using this
                  account will no longer be able to access Google services.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Disconnect
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Permissions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {account.scopes.map((scope) => (
                <Badge key={scope} variant="secondary" className="text-xs">
                  {getScopeLabel(scope)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Connected {new Date(account.created_at).toLocaleDateString()}
            </span>
            <Badge
              variant={account.is_active ? "default" : "secondary"}
              className="text-xs"
            >
              {account.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

