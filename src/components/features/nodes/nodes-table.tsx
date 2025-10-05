"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TNode } from "@/types";
import { useNodesTable } from "@/hooks/useNodesTable";
import { NodesTableHeader } from "./NodesTableHeader";
import { NodesTableRow } from "./NodesTableRow";
import { NodesTablePagination } from "./NodesTablePagination";

interface NodesTableProps {
  nodes: TNode[];
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCreate?: () => void;
}

export function NodesTable({
  nodes,
  onEdit,
  onView,
  onDelete,
  onCreate,
}: NodesTableProps) {
  const {
    selectedRows,
    currentPage,
    rowsPerPage,
    searchTerm,
    typeFilter,
    nodeGroupFilter,
    columns,
    nodeGroups,
    filteredNodes,
    currentNodes,
    totalPages,
    isAllSelected,
    isIndeterminate,
    setSearchTerm,
    setTypeFilter,
    setNodeGroupFilter,
    handleSelectAll,
    handleSelectRow,
    handlePageChange,
    handleRowsPerPageChange,
    toggleColumnVisibility,
  } = useNodesTable({ nodes });

  return (
    <div className="space-y-4">
      <NodesTableHeader
        nodes={nodes}
        filteredNodes={filteredNodes}
        searchTerm={searchTerm}
        typeFilter={typeFilter}
        nodeGroupFilter={nodeGroupFilter}
        nodeGroups={nodeGroups}
        columns={columns}
        onSearchChange={setSearchTerm}
        onTypeFilterChange={setTypeFilter}
        onNodeGroupFilterChange={setNodeGroupFilter}
        onToggleColumnVisibility={toggleColumnVisibility}
        onCreate={onCreate}
      />

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 min-w-[48px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  ref={(el) => {
                    if (el) (el as HTMLInputElement).indeterminate = isIndeterminate;
                  }}
                />
              </TableHead>
              {columns.find(col => col.id === "name")?.visible && <TableHead className="min-w-[200px]">Name</TableHead>}
              {columns.find(col => col.id === "type")?.visible && <TableHead className="min-w-[100px]">Type</TableHead>}
              {columns.find(col => col.id === "nodeGroup")?.visible && <TableHead className="min-w-[120px]">Group</TableHead>}
              {columns.find(col => col.id === "description")?.visible && <TableHead className="min-w-[200px]">Description</TableHead>}
              {columns.find(col => col.id === "version")?.visible && <TableHead className="min-w-[80px]">Version</TableHead>}
              {columns.find(col => col.id === "updatedAt")?.visible && <TableHead className="min-w-[100px]">Updated</TableHead>}
              {columns.find(col => col.id === "tags")?.visible && <TableHead className="min-w-[150px]">Tags</TableHead>}
              <TableHead className="w-12 min-w-[48px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentNodes.map((node) => (
              <NodesTableRow
                key={node.id}
                node={node}
                columns={columns}
                isSelected={selectedRows.includes(node.id)}
                onSelect={(checked) => handleSelectRow(node.id, checked)}
                onEdit={onEdit}
                onView={onView}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <NodesTablePagination
        selectedRowsCount={selectedRows.length}
        filteredNodesCount={filteredNodes.length}
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  );
}