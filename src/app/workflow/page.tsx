"use client";

import { WorkflowPageContainer } from "@/components/workflow/WorkflowPageContainer";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function Page() {
  return (
    <DashboardLayout>
      <WorkflowPageContainer />
    </DashboardLayout>
  )
}