import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardControls } from "@/components/dashboard-controls"

export default function Page() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="px-4 lg:px-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your application and key metrics. Test dialog and notification functionality.
            </p>
          </div>
          
          <DashboardControls />
        </div>
      </div>
    </DashboardLayout>
  )
}
