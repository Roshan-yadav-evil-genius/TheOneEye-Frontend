import { DashboardLayout } from "@/components/dashboard-layout"
import { DataLibraryPage } from "@/components/pages/data-library-page"

export default function Page() {
  return (
    <DashboardLayout title="Data Library">
      <DataLibraryPage />
    </DashboardLayout>
  )
}
