"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AuthPageContainer } from "@/components/features/auth/AuthPageContainer";

export default function Page() {
  return (
    <DashboardLayout>
      <AuthPageContainer />
    </DashboardLayout>
  );
}

