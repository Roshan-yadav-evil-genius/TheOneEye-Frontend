import { WorkflowList } from "@/components/workflow/workflow-list"
import { mockWorkflows } from "@/data/mock-workflows"

export function WorkflowPage() {
    return (
        <div className="px-4 lg:px-6">
            <main>
                <WorkflowList workflows={mockWorkflows} />
            </main>
        </div>
    )
}
