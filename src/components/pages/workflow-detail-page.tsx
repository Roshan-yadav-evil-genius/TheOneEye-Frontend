import { Workflow } from "@/components/workflow-list"
import { mockWorkflows } from "@/data/mock-workflows"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconArrowLeft, IconSettings, IconClock, IconPray } from "@tabler/icons-react"
import Link from "next/link"

interface WorkflowDetailPageProps {
  workflowId: string
}

export function WorkflowDetailPage({ workflowId }: WorkflowDetailPageProps) {
  // Find the workflow by ID
  const workflow = mockWorkflows.find(w => w.id === workflowId)

  if (!workflow) {
    return (
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
              The workflow with ID "{workflowId}" could not be found.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return "text-green-600 dark:text-green-400"
    if (rate >= 70) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="px-4 lg:px-6">
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Link href="/workflow">
            <Button variant="outline" size="sm">
              <IconArrowLeft className="mr-2 h-4 w-4" />
              Back to Workflows
            </Button>
          </Link>
        </div>

        {/* Workflow Details */}
        <div className="space-y-6">
          {/* Title and Status */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">{workflow.name}</h1>
              <p className="text-muted-foreground text-lg">{workflow.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getStatusColor(workflow.status)}>
                {workflow.status}
              </Badge>
              <Button variant="outline" size="sm">
                <IconSettings className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>

          {/* Workflow ID */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Workflow ID</h3>
            <code className="text-sm bg-background px-2 py-1 rounded border">
              {workflow.id}
            </code>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <IconPray className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Total Runs</span>
              </div>
              <div className="text-2xl font-bold">{workflow.runsCount.toLocaleString()}</div>
            </div>

            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-muted-foreground">Success Rate</span>
              </div>
              <div className={`text-2xl font-bold ${getSuccessRateColor(workflow.successRate)}`}>
                {workflow.successRate}%
              </div>
            </div>

            {workflow.lastRun && (
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconClock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Last Run</span>
                </div>
                <div className="text-lg font-semibold">{workflow.lastRun}</div>
              </div>
            )}

            {workflow.nextRun && workflow.status === "active" && (
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <IconClock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Next Run</span>
                </div>
                <div className="text-lg font-semibold">{workflow.nextRun}</div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workflow.category && (
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Category</h3>
                <Badge variant="secondary">{workflow.category}</Badge>
              </div>
            )}

            {workflow.tags && workflow.tags.length > 0 && (
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {workflow.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline">
              View Logs
            </Button>
            {workflow.status === "inactive" && (
              <Button>
                Run Now
              </Button>
            )}
            <Button variant="outline">
              Duplicate
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
