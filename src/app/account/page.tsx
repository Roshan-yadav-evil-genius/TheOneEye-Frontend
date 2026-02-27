"use client";

import { useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/stores";
import { AccountPage } from "@/components/features/account/AccountPage";

/**
 * Account route page.
 * Wraps AccountPage in DashboardLayout and refreshes user on mount.
 */
export default function AccountRoutePage() {
  const { user, isAuthenticated, isLoading, getCurrentUser } = useAuthStore();

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <DashboardLayout>
      <AccountPage
        user={user}
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
      />
    </DashboardLayout>
  );
}
