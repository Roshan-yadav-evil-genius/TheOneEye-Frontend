import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { EditNodePage } from "@/components/pages/edit-node-page"

export default function Page() {
  return (
    <DashboardLayout title="Edit Node">
      <EditNodePage />
    </DashboardLayout>
  )
}
