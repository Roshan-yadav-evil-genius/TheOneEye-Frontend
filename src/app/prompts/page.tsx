import { DashboardLayout } from "@/components/dashboard-layout"
import { PromptsPage } from "@/components/pages/prompts-page"

export default function Page() {
  return (
    <DashboardLayout title="Prompts">
      <PromptsPage />
    </DashboardLayout>
  )
}
