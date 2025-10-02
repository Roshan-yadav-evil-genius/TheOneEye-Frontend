import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DashboardControls } from "@/components/dashboard/dashboard-controls"

export default function Page() {
  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6">
        <div className="space-y-6">
          <DashboardControls />
        </div>
      </div>
    </DashboardLayout>
  )
}
