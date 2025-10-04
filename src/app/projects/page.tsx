import { DashboardLayout } from "@/components/layout/dashboard-layout"

function ProjectsPageContent() {
  return (
    <div className="px-4 lg:px-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your projects and track their progress.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <DashboardLayout>
      <ProjectsPageContent />
    </DashboardLayout>
  )
}