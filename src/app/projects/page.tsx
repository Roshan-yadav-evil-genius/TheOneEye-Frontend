import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProjectsPage } from "@/components/pages/projects-page"

export default function Page() {
  return (
    <DashboardLayout title="Projects">
      <ProjectsPage />
    </DashboardLayout>
  )
}
