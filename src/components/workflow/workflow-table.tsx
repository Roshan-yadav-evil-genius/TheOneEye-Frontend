"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconDots,
  IconPlayerPlay,
  IconPlayerStop,
  IconEdit,
  IconEye,
  IconTrash,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconColumns,
  IconSearch,
  IconFilter,
  IconPlus,
} from "@tabler/icons-react";
import { TWorkflow } from "@/types";

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

interface WorkflowTableProps {
  workflows: TWorkflow[];
  onRun?: (id: string) => void;
  onStop?: (id: string) => void;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCreate?: () => void;
}

export function WorkflowTable({
  workflows,
  onRun,
  onStop,
  onEdit,
  onView,
  onDelete,
  onCreate,
}: WorkflowTableProps) {
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  // Column configuration state
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: "name", label: "Name", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "category", label: "Category", visible: true },
    { id: "lastRun", label: "Last Run", visible: true },
    { id: "nextRun", label: "Next Run", visible: true },
    { id: "runsCount", label: "Runs Count", visible: true },
    { id: "successRate", label: "Success Rate", visible: true },
  ]);

  // Get unique categories from workflows
  const categories = Array.from(
    new Set(workflows.map(w => w.category).filter((category): category is string => Boolean(category)))
  );

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
  });

  const totalPages = Math.ceil(filteredWorkflows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentWorkflows = filteredWorkflows.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(currentWorkflows.map((workflow) => workflow.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (workflowId: string, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, workflowId]);
    } else {
      setSelectedRows((prev) => prev.filter((id) => id !== workflowId));
    }
  };

  const isAllSelected = currentWorkflows.length > 0 && selectedRows.length === currentWorkflows.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < currentWorkflows.length;

  const getStatusBadge = (status: "active" | "inactive" | "error") => {
    if (status === "active") {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
          Active
        </Badge>
      );
    }
    if (status === "error") {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
          Error
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-gray-600 border-gray-300 dark:text-gray-400 dark:border-gray-600">
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-1" />
        Inactive
      </Badge>
    );
  };

  const formatSuccessRate = (rate: number) => {
    return `${rate.toFixed(1)}%`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRows([]); // Clear selection when changing pages
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page
    setSelectedRows([]); // Clear selection
  };

  const toggleColumnVisibility = (columnId: string) => {
    setColumns(prev => 
      prev.map(col => 
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Control Buttons Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side - Search and Results count */}
        <div className="flex items-center gap-4">
          {/* Search Field */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64 h-8"
            />
          </div>
          
          {/* Results count */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconFilter className="h-4 w-4" />
            <span>
              {filteredWorkflows.length} of {workflows.length} workflows
            </span>
          </div>
        </div>
        
        {/* Right side - Control buttons */}
        <div className="flex flex-wrap gap-2">

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <IconFilter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="p-2 space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {categories.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full">
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
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Customize Columns */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <IconColumns className="mr-2 h-4 w-4" />
                Customize Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {columns.map((column) => (
                <DropdownMenuItem
                  key={column.id}
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    checked={column.visible}
                    onCheckedChange={() => toggleColumnVisibility(column.id)}
                  />
                  <span>{column.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Create Workflow */}
          <Button onClick={onCreate} size="sm" className="h-8">
            <IconPlus className="mr-2 h-4 w-4" />
            Create Workflow
          </Button>
        </div>
      </div>

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
                    if (el) (el as any).indeterminate = isIndeterminate;
                  }}
                />
              </TableHead>
              {columns.find(col => col.id === "name")?.visible && <TableHead>Name</TableHead>}
              {columns.find(col => col.id === "status")?.visible && <TableHead>Status</TableHead>}
              {columns.find(col => col.id === "category")?.visible && <TableHead>Category</TableHead>}
              {columns.find(col => col.id === "lastRun")?.visible && <TableHead>Last Run</TableHead>}
              {columns.find(col => col.id === "nextRun")?.visible && <TableHead>Next Run</TableHead>}
              {columns.find(col => col.id === "runsCount")?.visible && <TableHead>Runs Count</TableHead>}
              {columns.find(col => col.id === "successRate")?.visible && <TableHead>Success Rate</TableHead>}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentWorkflows.map((workflow) => (
              <TableRow key={workflow.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(workflow.id)}
                    onCheckedChange={(checked) => handleSelectRow(workflow.id, checked as boolean)}
                  />
                </TableCell>
                {columns.find(col => col.id === "name")?.visible && (
                  <TableCell>
                    <div>
                      <div className="font-medium">{workflow.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {workflow.description}
                      </div>
                    </div>
                  </TableCell>
                )}
                {columns.find(col => col.id === "status")?.visible && (
                  <TableCell>{getStatusBadge(workflow.status)}</TableCell>
                )}
                {columns.find(col => col.id === "category")?.visible && (
                  <TableCell>
                    <Badge variant="secondary">{workflow.category || "Uncategorized"}</Badge>
                  </TableCell>
                )}
                {columns.find(col => col.id === "lastRun")?.visible && (
                  <TableCell className="text-sm text-muted-foreground">
                    {workflow.lastRun || "Never"}
                  </TableCell>
                )}
                {columns.find(col => col.id === "nextRun")?.visible && (
                  <TableCell className="text-sm text-muted-foreground">
                    {workflow.nextRun || "Not scheduled"}
                  </TableCell>
                )}
                {columns.find(col => col.id === "runsCount")?.visible && (
                  <TableCell className="text-sm">
                    {workflow.runsCount.toLocaleString()}
                  </TableCell>
                )}
                {columns.find(col => col.id === "successRate")?.visible && (
                  <TableCell className="text-sm">
                    {formatSuccessRate(workflow.successRate)}
                  </TableCell>
                )}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <IconDots className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {workflow.status === "active" && (
                        <DropdownMenuItem onClick={() => onStop?.(workflow.id)}>
                          <IconPlayerStop className="mr-2 h-4 w-4" />
                          Stop
                        </DropdownMenuItem>
                      )}
                      {(workflow.status === "inactive" || workflow.status === "error") && (
                        <DropdownMenuItem onClick={() => onRun?.(workflow.id)}>
                          <IconPlayerPlay className="mr-2 h-4 w-4" />
                          Run Now
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onView?.(workflow.id)}>
                        <IconEye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(workflow.id)}>
                        <IconEdit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete?.(workflow.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <IconTrash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedRows.length} of {filteredWorkflows.length} row(s) selected.
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select value={rowsPerPage.toString()} onValueChange={handleRowsPerPageChange}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <IconChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <IconChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <IconChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <IconChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
