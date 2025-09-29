import { DashboardLayout } from "@/components/dashboard-layout"
import { AnalyticsPage } from "@/components/pages/analytics-page"

export default function Page() {
  return (
    <DashboardLayout title="Analytics">
      <AnalyticsPage />
    </DashboardLayout>
  )
}
