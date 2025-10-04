"use client";

import { WorkflowPageContainer } from "@/components/features/workflow/WorkflowPageContainer";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function Page() {
  return (
    <DashboardLayout>
      <WorkflowPageContainer />
    </DashboardLayout>
  )
}