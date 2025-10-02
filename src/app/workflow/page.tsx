import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { WorkflowPage } from "@/components/pages/workflow-page"

export default function Page() {
  return (
    <DashboardLayout title="Workflow">
      <WorkflowPage />
    </DashboardLayout>
  )
}
