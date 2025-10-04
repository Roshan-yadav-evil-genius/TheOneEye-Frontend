import { mockWorkflows } from "@/data"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { WorkflowLayout } from "@/components/features/workflow/workflow-layout"

interface WorkflowDetailPageProps {
  params: {
    id: string
  }
}

export default function Page({ params }: WorkflowDetailPageProps) {
  const workflowId = params.id;
  // Find the workflow by ID
  const workflow = mockWorkflows.find(w => w.id === workflowId)

  if (!workflow) {
    return (
      <DashboardLayout>
        <div className="px-4 lg:px-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Link href="/workflow">
                <Button variant="outline" size="sm">
                  <IconArrowLeft className="mr-2 h-4 w-4" />
                  Back to Workflows
                </Button>
              </Link>
            </div>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-2">Workflow Not Found</h1>
              <p className="text-muted-foreground">
                The workflow with ID &quot;{workflowId}&quot; could not be found.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }


  return (
    <div className="h-screen">
      <WorkflowLayout workflowId={workflowId} />
    </div>
  )
}