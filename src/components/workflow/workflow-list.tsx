"use client";
import { useRouter } from "next/navigation"
import { WorkflowTable } from "@/components/workflow/workflow-table"
import { Button } from "@/components/ui/button"
import { IconPlus, IconSearch } from "@tabler/icons-react"
import { TWorkflow } from "@/types"

interface WorkflowListProps {
  workflows: TWorkflow[]
}

export function WorkflowList({
  workflows,
}: WorkflowListProps) {
  const router = useRouter()

  const handleRun = (id: string) => {
    // TODO: Implement workflow execution
  }

  const handleStop = (id: string) => {
    // TODO: Implement workflow stop
  }

  const handleEdit = (id: string) => {
    router.push(`/workflow/${id}`)
  }

  const handleView = (id: string) => {
    router.push(`/workflow/${id}/details`)
  }

  const handleDelete = (id: string) => {
    // TODO: Implement workflow deletion
  }

  const handleCreate = () => {
    // TODO: Navigate to workflow creation
  }

  return (
    <div className="space-y-6">
      {/* Workflow table */}
      {workflows.length > 0 ? (
        <WorkflowTable
          workflows={workflows}
          onRun={handleRun}
          onStop={handleStop}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <IconSearch className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No workflows found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first workflow
          </p>
          <Button onClick={handleCreate}>
            <IconPlus className="mr-2 h-4 w-4" />
            Create Workflow
          </Button>
        </div>
      )}
    </div>
  )
}
