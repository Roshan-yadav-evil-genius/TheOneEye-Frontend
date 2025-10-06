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
  IconDots,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconColumns,
  IconSearch,
  IconFilter,
  IconPlus,
} from "@tabler/icons-react";
import { nodeTypes } from "@/types";
import { BackendNodeType } from "@/types/api/backend";

interface NodesTableHeaderProps {
  nodes: BackendNodeType[];
  filteredNodes: BackendNodeType[];
  searchTerm: string;
  typeFilter: string;
  nodeGroupFilter: string;
  nodeGroups: string[];
  columns: Array<{ id: string; label: string; visible: boolean }>;
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onNodeGroupFilterChange: (value: string) => void;
  onToggleColumnVisibility: (columnId: string) => void;
  onCreate?: () => void;
}

export function NodesTableHeader({
  nodes,
  filteredNodes,
  searchTerm,
  typeFilter,
  nodeGroupFilter,
  nodeGroups,
  columns,
  onSearchChange,
  onTypeFilterChange,
  onNodeGroupFilterChange,
  onToggleColumnVisibility,
  onCreate,
}: NodesTableHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left side - Search and Results count */}
      <div className="flex items-center gap-4">
        {/* Search Field */}
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
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
                <Select value={typeFilter} onValueChange={onTypeFilterChange}>
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
              
              {nodeGroups.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Group</label>
                  <Select value={nodeGroupFilter} onValueChange={onNodeGroupFilterChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Groups</SelectItem>
                      {nodeGroups.map(nodeGroup => (
                        <SelectItem key={nodeGroup} value={nodeGroup}>
                          {nodeGroup}
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

        {/* Create Node */}
        <Button onClick={onCreate} size="sm" className="h-8">
          <IconPlus className="mr-2 h-4 w-4" />
          Create Node
        </Button>
      </div>
    </div>
  );
}
