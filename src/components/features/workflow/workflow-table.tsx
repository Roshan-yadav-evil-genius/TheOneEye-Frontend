"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TWorkflow } from "@/types";
import { useWorkflowTable } from "@/hooks/useWorkflowTable";
import { WorkflowTableHeader } from "./WorkflowTableHeader";
import { WorkflowTableRow } from "./WorkflowTableRow";
import { WorkflowTablePagination } from "./WorkflowTablePagination";

interface WorkflowTableProps {
  workflows: TWorkflow[];
  onRun?: (id: string) => void;
  onStop?: (id: string) => void;
  onEditInfo?: (workflow: TWorkflow) => void;
  onEditWorkflow?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCreate?: () => void;
}

export function WorkflowTable({
  workflows,
  onRun,
  onStop,
  onEditInfo,
  onEditWorkflow,
  onDuplicate,
  onDelete,
  onCreate,
}: WorkflowTableProps) {
  const {
    selectedRows,
    currentPage,
    rowsPerPage,
    searchTerm,
    statusFilter,
    categoryFilter,
    tagFilter,
    workflowTypeFilter,
    columns,
    categories,
    tags,
    filteredWorkflows,
    currentWorkflows,
    totalPages,
    isAllSelected,
    isIndeterminate,
    setSearchTerm,
    setStatusFilter,
    setCategoryFilter,
    setTagFilter,
    setWorkflowTypeFilter,
    clearFilters,
    handleSelectAll,
    handleSelectRow,
    handlePageChange,
    handleRowsPerPageChange,
    toggleColumnVisibility,
  } = useWorkflowTable({ workflows });

  return (
    <div className="space-y-4">
      <WorkflowTableHeader
        workflows={workflows}
        filteredWorkflows={filteredWorkflows}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        tagFilter={tagFilter}
        workflowTypeFilter={workflowTypeFilter}
        categories={categories}
        tags={tags}
        columns={columns}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onCategoryFilterChange={setCategoryFilter}
        onTagFilterChange={setTagFilter}
        onWorkflowTypeFilterChange={setWorkflowTypeFilter}
        onClearFilters={clearFilters}
        onToggleColumnVisibility={toggleColumnVisibility}
        onCreate={onCreate}
      />

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  ref={(el) => {
                    if (el) (el as HTMLInputElement).indeterminate = isIndeterminate;
                  }}
                />
              </TableHead>
              {columns.find(col => col.id === "name")?.visible && <TableHead>Name</TableHead>}
              {columns.find(col => col.id === "status")?.visible && <TableHead>Status</TableHead>}
              {columns.find(col => col.id === "category")?.visible && <TableHead>Category</TableHead>}
              {columns.find(col => col.id === "workflowType")?.visible && <TableHead>Type</TableHead>}
              {columns.find(col => col.id === "tags")?.visible && <TableHead>Tags</TableHead>}
              {columns.find(col => col.id === "lastRun")?.visible && <TableHead>Last Run</TableHead>}
              {columns.find(col => col.id === "nextRun")?.visible && <TableHead>Next Run</TableHead>}
              {columns.find(col => col.id === "runsCount")?.visible && <TableHead>Runs Count</TableHead>}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentWorkflows.map((workflow) => (
              <WorkflowTableRow
                key={workflow.id}
                workflow={workflow}
                columns={columns}
                isSelected={selectedRows.includes(workflow.id)}
                onSelect={(checked) => handleSelectRow(workflow.id, checked)}
                onRun={onRun}
                onStop={onStop}
                onEditInfo={onEditInfo}
                onEditWorkflow={onEditWorkflow}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <WorkflowTablePagination
        selectedRowsCount={selectedRows.length}
        filteredWorkflowsCount={filteredWorkflows.length}
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  );
}