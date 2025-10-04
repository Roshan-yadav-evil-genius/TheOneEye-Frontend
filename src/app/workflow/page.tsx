"use client";

import { useEffect } from "react";
import { WorkflowList } from "@/components/workflow/workflow-list"
import { useWorkflowStore } from "@/stores"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

function WorkflowPageContent() {
    const { workflows, loadTWorkflows, isLoading } = useWorkflowStore();

    useEffect(() => {
        loadTWorkflows();
    }, [loadTWorkflows]);

    return (
        <div className="px-4 lg:px-6">
            <main>
                <WorkflowList workflows={workflows} />
            </main>
        </div>
    )
}

export default function Page() {
  return (
    <DashboardLayout>
      <WorkflowPageContent />
    </DashboardLayout>
  )
}