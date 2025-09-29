"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  IconSearch, 
  IconFilter, 
  IconPlus,
  IconDatabase,
  IconApi,
  IconSettings,
  IconMail,
  IconFileText,
  IconClock,
  IconCheck
} from "@tabler/icons-react";

interface WorkflowSidebarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: {
    category: string;
    status: string;
  };
  onFiltersChange: (filters: { category: string; status: string }) => void;
  selectedNodes: string[];
  onNodeSelect: (nodeId: string) => void;
}

// Mock node data - in a real app this would come from props or API
const mockNodes = [
  { id: "start", name: "Start", type: "trigger", category: "system", status: "active" },
  { id: "email", name: "Send Email", type: "action", category: "communication", status: "active" },
  { id: "database", name: "Database Query", type: "action", category: "data", status: "active" },
  { id: "api", name: "API Call", type: "action", category: "integration", status: "inactive" },
  { id: "condition", name: "Condition", type: "logic", category: "control", status: "active" },
  { id: "delay", name: "Delay", type: "action", category: "control", status: "active" },
  { id: "file", name: "File Process", type: "action", category: "data", status: "active" },
  { id: "end", name: "End", type: "trigger", category: "system", status: "active" },
];

const nodeIcons = {
  trigger: IconClock,
  action: IconSettings,
  logic: IconCheck,
  system: IconDatabase,
};

const nodeColors = {
  trigger: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  action: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  logic: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  system: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export function WorkflowSidebar({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  selectedNodes,
  onNodeSelect,
}: WorkflowSidebarProps) {

  // Filter nodes based on search and filters
  const filteredNodes = mockNodes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === "all" || node.category === filters.category;
    const matchesStatus = filters.status === "all" || node.status === filters.status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(mockNodes.map(node => node.category)));

  const getNodeIcon = (type: string) => {
    const IconComponent = nodeIcons[type as keyof typeof nodeIcons] || IconSettings;
    return <IconComponent className="h-4 w-4" />;
  };


  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Workflow Nodes</h2>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="space-y-2">
          <Select 
            value={filters.category} 
            onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
          >
            <SelectTrigger>
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

          <Select 
            value={filters.status} 
            onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Node List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredNodes.map((node) => {
            const isSelected = selectedNodes.includes(node.id);
            const IconComponent = nodeIcons[node.type as keyof typeof nodeIcons] || IconSettings;
            
            return (
              <div
                key={node.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                  isSelected 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => onNodeSelect(node.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">{node.name}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${nodeColors[node.type as keyof typeof nodeColors]}`}
                      >
                        {node.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          node.status === "active" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                        }`}
                      >
                        {node.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground capitalize">
                        {node.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredNodes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <IconSearch className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No nodes found</p>
            <p className="text-xs">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button className="w-full" size="sm">
          <IconPlus className="mr-2 h-4 w-4" />
          Add Custom Node
        </Button>
      </div>
    </div>
  );
}
