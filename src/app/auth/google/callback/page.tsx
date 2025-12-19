"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconBrandGoogle, IconLoader2, IconCheck, IconX } from "@tabler/icons-react";
import { useGoogleOAuthStore } from "@/stores";

type CallbackStatus = "loading" | "success" | "error";

export default function GoogleOAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { handleCallback } = useGoogleOAuthStore();

  useEffect(() => {
    const processCallback = async () => {
      // Get code and state from URL params
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const error = searchParams.get("error");

      // Check for OAuth error from Google
      if (error) {
        setStatus("error");
        setErrorMessage(
          error === "access_denied"
            ? "You denied access to your Google account"
            : `Google OAuth error: ${error}`
        );
        return;
      }

      // Validate required params
      if (!code) {
        setStatus("error");
        setErrorMessage("No authorization code received from Google");
        return;
      }

      // Get pending OAuth data from sessionStorage
      const pendingData = sessionStorage.getItem("google_oauth_pending");
      if (!pendingData) {
        setStatus("error");
        setErrorMessage("OAuth session data not found. Please try connecting again.");
        return;
      }

      try {
        const pending = JSON.parse(pendingData);

        // Validate state matches (CSRF protection)
        if (state !== pending.state) {
          setStatus("error");
          setErrorMessage("Security validation failed. Please try again.");
          return;
        }

        // Exchange code for tokens
        await handleCallback({
          code,
          state: state || "",
          name: pending.name,
          scopes: pending.scopes,
        });

        setStatus("success");

        // Redirect to auth page after short delay
        setTimeout(() => {
          router.push("/auth");
        }, 2000);
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to complete OAuth"
        );
      }
    };

    processCallback();
  }, [searchParams, handleCallback, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === "loading" && (
              <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <IconLoader2 className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <IconCheck className="h-8 w-8 text-green-500" />
              </div>
            )}
            {status === "error" && (
              <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <IconX className="h-8 w-8 text-red-500" />
              </div>
            )}
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <IconBrandGoogle className="h-5 w-5 text-blue-500" />
            {status === "loading" && "Connecting Google Account..."}
            {status === "success" && "Google Account Connected!"}
            {status === "error" && "Connection Failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Please wait while we complete the authorization..."}
            {status === "success" && "Redirecting you back to the Auth page..."}
            {status === "error" && errorMessage}
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center">
          {status === "error" && (
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => router.push("/auth")}
                className="w-full"
              >
                Back to Auth
              </Button>
              <Button
                onClick={() => {
                  // Clear any stale data and try again
                  sessionStorage.removeItem("google_oauth_pending");
                  router.push("/auth");
                }}
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          )}

          {status === "success" && (
            <p className="text-sm text-muted-foreground">
              You can now use this account in your workflows.
            </p>
          )}

          {status === "loading" && (
            <p className="text-sm text-muted-foreground">
              This may take a few seconds...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

