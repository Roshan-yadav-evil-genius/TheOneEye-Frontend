import { DashboardLayout } from "@/components/dashboard-layout"
import { ProposalPage } from "@/components/pages/proposal-page"

export default function Page() {
  return (
    <DashboardLayout title="Proposal">
      <ProposalPage />
    </DashboardLayout>
  )
}
