"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { IconPlus, IconKey, IconBrandGoogle } from "@tabler/icons-react";
import { CreateOAuth2Dialog } from "./CreateOAuth2Dialog";
import { ConnectGoogleDialog } from "./ConnectGoogleDialog";
import { GoogleAccountCard } from "./GoogleAccountCard";
import { useGoogleOAuthStore, uiHelpers } from "@/stores";

interface AuthPageProps {
  // Add props here when needed
}

export function AuthPage({}: AuthPageProps) {
  const [isOAuth2DialogOpen, setIsOAuth2DialogOpen] = useState(false);
  const [isGoogleDialogOpen, setIsGoogleDialogOpen] = useState(false);

  const { accounts, isLoading, error, loadAccounts, deleteAccount } =
    useGoogleOAuthStore();

  // Load accounts on mount
  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const handleOAuth2Click = () => {
    setIsOAuth2DialogOpen(true);
  };

  const handleGoogleClick = () => {
    setIsGoogleDialogOpen(true);
  };

  const handleBasicAuthClick = () => {
    // TODO: Implement Basic Auth dialog
    console.log("Basic Auth clicked");
  };

  const handleBearerAuthClick = () => {
    // TODO: Implement Bearer Auth dialog
    console.log("Bearer Auth clicked");
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      await deleteAccount(accountId);
      uiHelpers.showSuccess(
        "Account Disconnected",
        "Google account has been disconnected successfully"
      );
    } catch (error) {
      uiHelpers.showError(
        "Error",
        error instanceof Error ? error.message : "Failed to disconnect account"
      );
    }
  };

  return (
    <div className="space-y-6 mx-4 my-2">
      {/* Header with Create Auth button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Auth</h2>
          <p className="text-muted-foreground">
            Manage authentication configurations
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              Create Auth
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleGoogleClick}>
              <IconBrandGoogle className="mr-2 h-4 w-4 text-blue-500" />
              Connect Google Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleOAuth2Click}>
              <IconKey className="mr-2 h-4 w-4" />
              OAuth2
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <IconKey className="mr-2 h-4 w-4" />
                Generic Credentials
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={handleBasicAuthClick}>
                  Basic Auth
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBearerAuthClick}>
                  Bearer Auth
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Google Connected Accounts Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <IconBrandGoogle className="h-5 w-5 text-blue-500" />
            Google Accounts
          </h3>
          <p className="text-sm text-muted-foreground">
            Connected Google accounts for accessing Sheets, Drive, and Gmail
          </p>
        </div>

        {/* Loading State */}
        {isLoading && accounts.length === 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3 p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="border border-destructive/50 bg-destructive/10 text-destructive rounded-lg p-4">
            <p className="font-medium">Failed to load accounts</p>
            <p className="text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => loadAccounts()}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Accounts Grid */}
        {!isLoading && !error && accounts.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
              <GoogleAccountCard
                key={account.id}
                account={account}
                onDelete={handleDeleteAccount}
                isDeleting={isLoading}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && accounts.length === 0 && (
          <div className="border border-dashed rounded-lg p-8 text-center">
            <IconBrandGoogle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h4 className="font-medium mb-2">No Google accounts connected</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Connect a Google account to enable workflows to access Google
              Sheets, Drive, and other services.
            </p>
            <Button onClick={handleGoogleClick}>
              <IconBrandGoogle className="mr-2 h-4 w-4" />
              Connect Google Account
            </Button>
          </div>
        )}
      </div>

      {/* OAuth2 Dialog */}
      <CreateOAuth2Dialog
        open={isOAuth2DialogOpen}
        onOpenChange={setIsOAuth2DialogOpen}
      />

      {/* Google Connect Dialog */}
      <ConnectGoogleDialog
        open={isGoogleDialogOpen}
        onOpenChange={setIsGoogleDialogOpen}
      />
    </div>
  );
}
