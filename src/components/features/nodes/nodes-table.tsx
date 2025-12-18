"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TNodeMetadata } from "@/types";
import { useNodesTable } from "@/hooks/useNodesTable";
import { NodesTableHeader } from "./nodes-table-header";
import { NodesTableRow } from "./nodes-table-row";
import { NodesTablePagination } from "./nodes-table-pagination";
import { IconLoader2, IconSearch } from "@tabler/icons-react";

interface NodesTableProps {
  nodes: TNodeMetadata[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onViewForm?: (node: TNodeMetadata) => void;
  onExecute?: (node: TNodeMetadata) => void;
  onViewDetails?: (node: TNodeMetadata) => void;
}

export function NodesTable({
  nodes,
  isLoading,
  onRefresh,
  onViewForm,
  onExecute,
  onViewDetails,
}: NodesTableProps) {
  const {
    selectedRows,
    currentPage,
    rowsPerPage,
    searchTerm,
    typeFilter,
    categoryFilter,
    columns,
    types,
    categories,
    filteredNodes,
    currentNodes,
    totalPages,
    isAllSelected,
    isIndeterminate,
    setSearchTerm,
    setTypeFilter,
    setCategoryFilter,
    handleSelectAll,
    handleSelectRow,
    handlePageChange,
    handleRowsPerPageChange,
    toggleColumnVisibility,
  } = useNodesTable({ nodes });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading nodes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <NodesTableHeader
        nodes={nodes}
        filteredNodes={filteredNodes}
        searchTerm={searchTerm}
        typeFilter={typeFilter}
        categoryFilter={categoryFilter}
        types={types}
        categories={categories}
        columns={columns}
        onSearchChange={setSearchTerm}
        onTypeFilterChange={setTypeFilter}
        onCategoryFilterChange={setCategoryFilter}
        onToggleColumnVisibility={toggleColumnVisibility}
        onRefresh={onRefresh}
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
              {columns.find(col => col.id === "type")?.visible && <TableHead>Type</TableHead>}
              {columns.find(col => col.id === "category")?.visible && <TableHead>Category</TableHead>}
              {columns.find(col => col.id === "hasForm")?.visible && <TableHead>Has Form</TableHead>}
              {columns.find(col => col.id === "description")?.visible && <TableHead>Description</TableHead>}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentNodes.length === 0 ? (
              <TableRow>
                <td colSpan={columns.filter(c => c.visible).length + 2} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <IconSearch className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-muted-foreground">No nodes found</span>
                  </div>
                </td>
              </TableRow>
            ) : (
              currentNodes.map((node) => (
                <NodesTableRow
                  key={node.identifier}
                  node={node}
                  columns={columns}
                  isSelected={selectedRows.includes(node.identifier)}
                  onSelect={(checked) => handleSelectRow(node.identifier, checked)}
                  onViewForm={onViewForm}
                  onExecute={onExecute}
                  onViewDetails={onViewDetails}
                />
              ))
            )}
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

