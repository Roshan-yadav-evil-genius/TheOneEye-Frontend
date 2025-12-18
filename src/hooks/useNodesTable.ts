import { useMemo, useState } from "react";
import { TNodeMetadata } from "@/types";

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

interface UseNodesTableProps {
  nodes: TNodeMetadata[];
}

const defaultColumns: ColumnConfig[] = [
  { id: "name", label: "Name", visible: true },
  { id: "type", label: "Type", visible: true },
  { id: "category", label: "Category", visible: true },
  { id: "hasForm", label: "Has Form", visible: true },
  { id: "description", label: "Description", visible: false },
];

export const useNodesTable = ({ nodes }: UseNodesTableProps) => {
  // State
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);

  // Get unique types and categories
  const types = useMemo(() => {
    const t = new Set<string>();
    nodes.forEach((node) => {
      if (node.type) t.add(node.type);
    });
    return Array.from(t).sort();
  }, [nodes]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    nodes.forEach((node) => {
      if (node.category) cats.add(node.category);
    });
    return Array.from(cats).sort();
  }, [nodes]);

  // Filter nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchesSearch =
        searchTerm === "" ||
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (node.label?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (node.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesType = typeFilter === "all" || node.type === typeFilter;
      const matchesCategory = categoryFilter === "all" || node.category === categoryFilter;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [nodes, searchTerm, typeFilter, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredNodes.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentNodes = filteredNodes.slice(startIndex, endIndex);

  // Selection helpers
  const isAllSelected = currentNodes.length > 0 && selectedRows.length === currentNodes.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < currentNodes.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(currentNodes.map((node) => node.identifier));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (identifier: string, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, identifier]);
    } else {
      setSelectedRows((prev) => prev.filter((id) => id !== identifier));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRows([]);
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
    setSelectedRows([]);
  };

  const toggleColumnVisibility = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    setSelectedRows([]);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
    setSelectedRows([]);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
    setSelectedRows([]);
  };

  return {
    // State
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

    // Actions
    setSearchTerm: handleSearchChange,
    setTypeFilter: handleTypeFilterChange,
    setCategoryFilter: handleCategoryFilterChange,
    handleSelectAll,
    handleSelectRow,
    handlePageChange,
    handleRowsPerPageChange,
    toggleColumnVisibility,
  };
};

