import { DashboardLayout } from "@/components/dashboard-layout"
import { ReportsPage } from "@/components/pages/reports-page"

export default function Page() {
  return (
    <DashboardLayout title="Reports">
      <ReportsPage />
    </DashboardLayout>
  )
}
