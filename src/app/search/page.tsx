import { DashboardLayout } from "@/components/dashboard-layout"
import { SearchPage } from "@/components/pages/search-page"

export default function Page() {
  return (
    <DashboardLayout title="Search">
      <SearchPage />
    </DashboardLayout>
  )
}
