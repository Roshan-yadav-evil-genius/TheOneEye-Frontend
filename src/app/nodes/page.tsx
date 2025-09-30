import { DashboardLayout } from "@/components/dashboard-layout"
import { NodesPage } from "@/components/pages/nodes-page"

export default function Page() {
  return (
    <DashboardLayout title="Nodes">
      <NodesPage />
    </DashboardLayout>
  )
}
