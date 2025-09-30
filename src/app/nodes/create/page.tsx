import { DashboardLayout } from "@/components/dashboard-layout"
import { CreateNodePage } from "@/components/pages/create-node-page"

export default function Page() {
  return (
    <DashboardLayout title="Create Node">
      <CreateNodePage />
    </DashboardLayout>
  )
}
