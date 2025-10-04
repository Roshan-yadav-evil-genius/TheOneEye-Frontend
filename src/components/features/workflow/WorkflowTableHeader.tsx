import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  IconColumns,
  IconSearch,
  IconFilter,
  IconPlus,
} from "@tabler/icons-react";
import { TWorkflow } from "@/types";

interface WorkflowTableHeaderProps {
  workflows: TWorkflow[];
  filteredWorkflows: TWorkflow[];
  searchTerm: string;
  statusFilter: string;
  categoryFilter: string;
  categories: string[];
  columns: Array<{ id: string; label: string; visible: boolean }>;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onToggleColumnVisibility: (columnId: string) => void;
  onCreate?: () => void;
}

export function WorkflowTableHeader({
  workflows,
  filteredWorkflows,
  searchTerm,
  statusFilter,
  categoryFilter,
  categories,
  columns,
  onSearchChange,
  onStatusFilterChange,
  onCategoryFilterChange,
  onToggleColumnVisibility,
  onCreate,
}: WorkflowTableHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left side - Search and Results count */}
      <div className="flex items-center gap-4">
        {/* Search Field */}
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
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
                <Select value={statusFilter} onValueChange={onStatusFilterChange}>
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
                  <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
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
                <input
                  type="checkbox"
                  checked={column.visible}
                  onChange={() => onToggleColumnVisibility(column.id)}
                  className="rounded"
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
  );
}
