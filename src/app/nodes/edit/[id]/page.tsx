import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { EditNodePage } from "@/components/pages/edit-node-page";

export default function EditNodeRoute() {
  return (
    <DashboardLayout>
      <EditNodePage />
    </DashboardLayout>
  );
}
