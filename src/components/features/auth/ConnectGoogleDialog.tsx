"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { IconBrandGoogle, IconLoader2 } from "@tabler/icons-react";
import { GOOGLE_OAUTH_SCOPES, TGoogleOAuthScopeKey } from "@/types";
import { useGoogleOAuthStore } from "@/stores";
import { uiHelpers } from "@/stores";

interface ConnectGoogleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectGoogleDialog({
  open,
  onOpenChange,
}: ConnectGoogleDialogProps) {
  const [name, setName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<TGoogleOAuthScopeKey[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { initiateOAuth } = useGoogleOAuthStore();

  const handleScopeToggle = (scopeKey: TGoogleOAuthScopeKey) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeKey)
        ? prev.filter((s) => s !== scopeKey)
        : [...prev, scopeKey]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      uiHelpers.showError("Validation Error", "Please enter a name for this account");
      return;
    }

    if (selectedScopes.length === 0) {
      uiHelpers.showError("Validation Error", "Please select at least one permission");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await initiateOAuth({
        name: name.trim(),
        scopes: selectedScopes,
      });

      // Redirect to Google OAuth consent screen
      window.location.href = response.auth_url;
    } catch (error) {
      uiHelpers.showError(
        "OAuth Error",
        error instanceof Error ? error.message : "Failed to initiate OAuth"
      );
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setName("");
      setSelectedScopes([]);
      onOpenChange(false);
    }
  };

  // Filter scopes to show sheets and drive (required for Google Sheets nodes)
  const availableScopes = Object.entries(GOOGLE_OAUTH_SCOPES).filter(
    ([key]) => key.startsWith("sheets") || key.startsWith("drive")
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconBrandGoogle className="h-5 w-5 text-blue-500" />
            Connect Google Account
          </DialogTitle>
          <DialogDescription>
            Connect your Google account to enable workflows to access Google
            services like Sheets, Drive, and Gmail.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="account-name">Account Name *</Label>
            <Input
              id="account-name"
              placeholder="e.g., Work Account, Personal Gmail"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              A friendly name to identify this account in your workflows
            </p>
          </div>

          <div className="space-y-3">
            <Label>Permissions *</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Select the Google services you want to access
            </p>

            <div className="space-y-3 border rounded-md p-4 bg-muted/30">
              {availableScopes.map(([key, scope]) => (
                <div key={key} className="flex items-start space-x-3">
                  <Checkbox
                    id={key}
                    checked={selectedScopes.includes(key as TGoogleOAuthScopeKey)}
                    onCheckedChange={() =>
                      handleScopeToggle(key as TGoogleOAuthScopeKey)
                    }
                    disabled={isSubmitting}
                  />
                  <div className="space-y-0.5">
                    <Label
                      htmlFor={key}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {scope.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {scope.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <IconBrandGoogle className="mr-2 h-4 w-4" />
                  Connect with Google
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

