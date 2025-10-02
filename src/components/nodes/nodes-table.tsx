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
  IconNetwork,
  IconCheck,
  IconSettings,
  IconClock,
  IconDatabase,
  IconMail,
  IconApi,
  IconFileText,
  IconTag,
} from "@tabler/icons-react";
import { Node, nodeTypes, nodeCategories } from "@/data/nodes";
import { getNodeColors } from "@/constants/node-styles";

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

interface NodesTableProps {
  nodes: Node[];
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
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  // Column configuration state
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: "name", label: "Name", visible: true },
    { id: "type", label: "Type", visible: true },
    { id: "category", label: "Category", visible: true },
    { id: "description", label: "Description", visible: true },
    { id: "version", label: "Version", visible: true },
    { id: "updatedAt", label: "Updated", visible: true },
    { id: "tags", label: "Tags", visible: true },
  ]);

  // Get unique categories from nodes
  const categories = Array.from(
    new Set(nodes.map(n => n.category).filter((category): category is string => Boolean(category)))
  );

  // Filter nodes based on search and filters
  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      node.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === "all" || node.type === typeFilter
    const matchesCategory = categoryFilter === "all" || node.category === categoryFilter
    
    return matchesSearch && matchesType && matchesCategory
  });

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

  const getTypeBadge = (type: string) => {
    const typeColors = {
      trigger: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
      action: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
      logic: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
      system: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
    };
    
    return (
      <Badge variant="outline" className={typeColors[type as keyof typeof typeColors] || "text-gray-600 border-gray-300 dark:text-gray-400 dark:border-gray-600"}>
        {type}
      </Badge>
    );
  };

  const getNodeIcon = (type: string) => {
    const nodeIcons = {
      trigger: IconClock,
      action: IconSettings,
      logic: IconCheck,
      system: IconDatabase,
    };
    const IconComponent = nodeIcons[type as keyof typeof nodeIcons] || IconSettings;
    return <IconComponent className="h-4 w-4" />;
  };

  const getCategoryIcon = (category: string) => {
    const categoryIcons = {
      system: IconDatabase,
      email: IconMail,
      database: IconDatabase,
      api: IconApi,
      logic: IconCheck,
      control: IconClock,
      file: IconFileText,
    };
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || IconSettings;
    return <IconComponent className="h-4 w-4" />;
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
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64 h-8"
            />
          </div>
          
          {/* Results count */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconFilter className="h-4 w-4" />
            <span>
              {filteredNodes.length} of {nodes.length} nodes
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
                  <label className="text-sm font-medium mb-1 block">Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {nodeTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
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
                            {category.charAt(0).toUpperCase() + category.slice(1)}
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

          {/* Create Node */}
          <Button onClick={onCreate} size="sm" className="h-8">
            <IconPlus className="mr-2 h-4 w-4" />
            Create Node
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
              {columns.find(col => col.id === "type")?.visible && <TableHead>Type</TableHead>}
              {columns.find(col => col.id === "category")?.visible && <TableHead>Category</TableHead>}
              {columns.find(col => col.id === "description")?.visible && <TableHead>Description</TableHead>}
              {columns.find(col => col.id === "version")?.visible && <TableHead>Version</TableHead>}
              {columns.find(col => col.id === "updatedAt")?.visible && <TableHead>Updated</TableHead>}
              {columns.find(col => col.id === "tags")?.visible && <TableHead>Tags</TableHead>}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentNodes.map((node) => {
              const { colorClass } = getNodeColors(node.type);
              
              return (
                <TableRow key={node.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(node.id)}
                      onCheckedChange={(checked) => handleSelectRow(node.id, checked as boolean)}
                    />
                  </TableCell>
                  {columns.find(col => col.id === "name")?.visible && (
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          {getNodeIcon(node.type)}
                        </div>
                        <div>
                          <div className="font-medium">{node.name}</div>
                          <div className="text-sm text-muted-foreground">ID: {node.id}</div>
                        </div>
                      </div>
                    </TableCell>
                  )}
                  {columns.find(col => col.id === "type")?.visible && (
                    <TableCell>{getTypeBadge(node.type)}</TableCell>
                  )}
                  {columns.find(col => col.id === "category")?.visible && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(node.category)}
                        <span className="capitalize">{node.category}</span>
                      </div>
                    </TableCell>
                  )}
                  {columns.find(col => col.id === "description")?.visible && (
                    <TableCell>
                      <div className="max-w-[200px] truncate" title={node.description}>
                        {node.description}
                      </div>
                    </TableCell>
                  )}
                  {columns.find(col => col.id === "version")?.visible && (
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {node.version}
                      </Badge>
                    </TableCell>
                  )}
                  {columns.find(col => col.id === "updatedAt")?.visible && (
                    <TableCell className="text-sm text-muted-foreground">
                      {node.updatedAt?.toLocaleDateString() || "Never"}
                    </TableCell>
                  )}
                  {columns.find(col => col.id === "tags")?.visible && (
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {node.tags?.slice(0, 2).map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <IconTag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {node.tags && node.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{node.tags.length - 2}
                          </Badge>
                        )}
                      </div>
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
                        <DropdownMenuItem onClick={() => onView?.(node.id)}>
                          <IconEye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit?.(node.id)}>
                          <IconEdit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete?.(node.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <IconTrash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedRows.length} of {filteredNodes.length} row(s) selected.
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
