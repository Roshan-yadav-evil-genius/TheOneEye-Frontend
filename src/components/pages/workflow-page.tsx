import { WorkflowList } from "@/components/workflow/workflow-list"
import { mockWorkflows } from "@/data/mock-workflows"

export function WorkflowPage() {
    return (
        <div className="px-4 lg:px-6">
            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Workflow</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your workflow processes and automation.
                    </p>
                </div>
                <main>
                    <WorkflowList workflows={mockWorkflows} />
                </main>
            </div>
        </div>
    )
}
