"use client";
import { useState } from "react"
import { useRouter } from "next/navigation"
import { WorkflowCard } from "@/components/workflow/workflow-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconPlus, IconSearch, IconFilter } from "@tabler/icons-react"

export interface Workflow {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  lastRun?: string
  nextRun?: string
  runsCount: number
  successRate: number
  category?: string
  tags?: string[]
}

interface WorkflowListProps {
  workflows: Workflow[]
}

export function WorkflowList({
  workflows,
}: WorkflowListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Get unique categories from workflows
  const categories = Array.from(
    new Set(workflows.map(w => w.category).filter((category): category is string => Boolean(category)))
  )

  // Filter workflows based on search and filters
  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      workflow.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || workflow.status === statusFilter
    const matchesCategory = categoryFilter === "all" || workflow.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleRun = (id: string) => {
    console.log(`Running workflow: ${id}`)
    // TODO: Implement workflow execution
  }

  const handleEdit = (id: string) => {
    console.log(`Editing workflow: ${id}`)
    // TODO: Navigate to workflow editor
  }

  const handleView = (id: string) => {
    router.push(`/workflow/${id}/details`)
  }

  const handleCreate = () => {
    console.log("Creating new workflow")
    // TODO: Navigate to workflow creation
  }

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            {categories.length > 0 && (
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        
        <Button onClick={handleCreate} className="w-full sm:w-auto">
          <IconPlus className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <IconFilter className="h-4 w-4" />
        <span>
          {filteredWorkflows.length} of {workflows.length} workflows
        </span>
      </div>

      {/* Workflow cards grid */}
      {filteredWorkflows.length > 0 ? (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:grid-cols-2 xl:grid-cols-3">
          {filteredWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              {...workflow}
              onRun={handleRun}
              onEdit={handleEdit}
              onView={handleView}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <IconSearch className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No workflows found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by creating your first workflow"}
          </p>
          {(!searchTerm && statusFilter === "all" && categoryFilter === "all") && (
            <Button onClick={handleCreate}>
              <IconPlus className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
