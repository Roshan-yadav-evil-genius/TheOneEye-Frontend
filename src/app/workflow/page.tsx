"use client";

import { WorkflowPageContainer } from "@/components/features/workflow/WorkflowPageContainer";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { WorkflowsStoreInitializer } from "@/components/common/workflows-store-initializer";

export default function Page() {
  return (
    <WorkflowsStoreInitializer>
      <DashboardLayout>
        <WorkflowPageContainer />
      </DashboardLayout>
    </WorkflowsStoreInitializer>
  )
}