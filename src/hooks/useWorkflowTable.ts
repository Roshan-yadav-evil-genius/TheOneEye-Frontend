import { useState, useMemo } from "react";
import { TWorkflow } from "@/types";

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

interface UseWorkflowTableProps {
  workflows: TWorkflow[];
}

export const useWorkflowTable = ({ workflows }: UseWorkflowTableProps) => {
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
  const filteredWorkflows = useMemo(() => {
    return workflows.filter(workflow => {
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
  }, [workflows, searchTerm, statusFilter, categoryFilter]);

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

  return {
    // State
    selectedRows,
    currentPage,
    rowsPerPage,
    searchTerm,
    statusFilter,
    categoryFilter,
    columns,
    categories,
    filteredWorkflows,
    currentWorkflows,
    totalPages,
    isAllSelected,
    isIndeterminate,
    
    // Actions
    setSearchTerm,
    setStatusFilter,
    setCategoryFilter,
    handleSelectAll,
    handleSelectRow,
    handlePageChange,
    handleRowsPerPageChange,
    toggleColumnVisibility,
  };
};
