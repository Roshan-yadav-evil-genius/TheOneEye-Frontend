import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { NodesPage } from "@/components/pages/nodes-page"

export default function Page() {
  return (
    <DashboardLayout title="Nodes">
      <NodesPage />
    </DashboardLayout>
  )
}
