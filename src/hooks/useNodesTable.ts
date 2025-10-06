import { useState, useMemo } from "react";
import { nodeTypes } from "@/types";
import { BackendNodeType } from "@/types/api/backend";

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

interface UseNodesTableProps {
  nodes: BackendNodeType[];
}

export const useNodesTable = ({ nodes }: UseNodesTableProps) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [nodeGroupFilter, setNodeGroupFilter] = useState<string>("all");
  
  // Column configuration state
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: "name", label: "Name", visible: true },
    { id: "type", label: "Type", visible: true },
    { id: "nodeGroup", label: "Group", visible: true },
    { id: "description", label: "Description", visible: true },
    { id: "version", label: "Version", visible: true },
    { id: "updatedAt", label: "Updated", visible: true },
    { id: "tags", label: "Tags", visible: true },
  ]);

  // Get unique node groups from nodes
  const nodeGroups = Array.from(
    new Set(nodes.map(n => n.nodeGroupName).filter((nodeGroupName): nodeGroupName is string => Boolean(nodeGroupName)))
  );

  // Filter nodes based on search and filters
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchesSearch = node.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        node.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      
      const matchesType = typeFilter === "all" || node.type === typeFilter
      const matchesNodeGroup = nodeGroupFilter === "all" || node.node_group?.name === nodeGroupFilter
      
      return matchesSearch && matchesType && matchesNodeGroup
    });
  }, [nodes, searchTerm, typeFilter, nodeGroupFilter]);

  const totalPages = Math.ceil(filteredNodes.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentNodes = filteredNodes.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(currentNodes.map((node) => node.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (nodeId: string, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, nodeId]);
    } else {
      setSelectedRows((prev) => prev.filter((id) => id !== nodeId));
    }
  };

  const isAllSelected = currentNodes.length > 0 && selectedRows.length === currentNodes.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < currentNodes.length;

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
    typeFilter,
    nodeGroupFilter,
    columns,
    nodeGroups,
    filteredNodes,
    currentNodes,
    totalPages,
    isAllSelected,
    isIndeterminate,
    
    // Actions
    setSearchTerm,
    setTypeFilter,
    setNodeGroupFilter,
    handleSelectAll,
    handleSelectRow,
    handlePageChange,
    handleRowsPerPageChange,
    toggleColumnVisibility,
  };
};
