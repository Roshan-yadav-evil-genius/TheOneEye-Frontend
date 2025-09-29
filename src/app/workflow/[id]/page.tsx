import { DashboardLayout } from "@/components/dashboard-layout"
import { WorkflowDetailPage } from "@/components/pages/workflow-detail-page"

interface WorkflowDetailPageProps {
  params: {
    id: string
  }
}

export default function Page({ params }: WorkflowDetailPageProps) {
  return (
    <DashboardLayout title="Workflow Details">
      <WorkflowDetailPage workflowId={params.id} />
    </DashboardLayout>
  )
}
