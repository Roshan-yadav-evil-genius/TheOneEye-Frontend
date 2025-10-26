"use client";

import { BrowserSessionPageContainer } from "@/components/features/browser-sessions/BrowserSessionPageContainer";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function Page() {
  return (
    <DashboardLayout>
      <BrowserSessionPageContainer />
    </DashboardLayout>
  )
}
