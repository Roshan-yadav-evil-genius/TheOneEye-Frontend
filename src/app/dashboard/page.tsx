import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DashboardControls } from "@/components/features/dashboard/dashboard-controls"

export default function Page() {
  return (
    <DashboardLayout>
        <div className="space-y-6 p-4">
          <DashboardControls />
        </div>
    </DashboardLayout>
  )
}
