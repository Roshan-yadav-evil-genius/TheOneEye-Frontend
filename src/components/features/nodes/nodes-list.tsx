"use client";
import { useRouter } from "next/navigation"
import { NodesTable } from "@/components/features/nodes/nodes-table"
import { Button } from "@/components/ui/button"
import { IconPlus, IconSearch } from "@tabler/icons-react"
import { TNode } from "@/types"

interface NodesListProps {
  nodes: TNode[]
  onEdit?: (id: string) => void
  onView?: (id: string) => void
  onDelete?: (id: string) => void
}

export function NodesList({
  nodes,
  onEdit,
  onView,
  onDelete,
}: NodesListProps) {
  const router = useRouter()

  const handleEdit = (id: string) => {
    onEdit?.(id)
  }

  const handleView = (id: string) => {
    onView?.(id)
  }

  const handleDelete = (id: string) => {
    onDelete?.(id)
  }

  const handleCreate = () => {
    router.push("/nodes/create")
  }

  return (
    <div className="space-y-6">
      {/* Nodes table */}
      {nodes.length > 0 ? (
        <NodesTable
          nodes={nodes}
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
          <h3 className="text-lg font-semibold mb-2">No nodes found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first node
          </p>
          <Button onClick={handleCreate}>
            <IconPlus className="mr-2 h-4 w-4" />
            Create Node
          </Button>
        </div>
      )}
    </div>
  )
}
