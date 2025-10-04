"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  IconSearch, 
  IconFilter, 
  IconPlus,
  IconDatabase,
  IconSettings,
  IconClock,
  IconCheck,
  IconChevronDown,
  IconChevronRight
} from "@tabler/icons-react";
import { getCategoryIcon } from "@/constants/node-styles";

interface WorkflowSidebarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: {
    category: string;
  };
  onFiltersChange: (filters: { category: string }) => void;
  selectedNodes: string[];
  onNodeSelect: (nodeId: string) => void;
}

import { mockNodes } from "@/data";

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
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['system', 'email', 'database', 'api', 'logic', 'control', 'file']));
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  // Filter nodes based on search and filters
  const filteredNodes = mockNodes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         node.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === "all" || node.category === filters.category;
    
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(mockNodes.map(node => node.category)));
  
  // Group nodes by category
  const groupedNodes = categories.reduce((acc, category) => {
    const categoryNodes = filteredNodes.filter(node => node.category === category);
    if (categoryNodes.length > 0) {
      acc[category] = categoryNodes;
    }
    return acc;
  }, {} as Record<string, typeof mockNodes>);
  
  const toggleGroup = (category: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedGroups(newExpanded);
  };

  
  const renderCategoryIcon = (category: string) => {
    const IconComponent = getCategoryIcon(category);
    return IconComponent;
  };


  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-3 border-b border-border">
        {/* Search Bar with Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          
          {/* Filter Icon Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 p-0 border border-border hover:border-primary/50 transition-colors"
              >
                <IconFilter className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={() => onFiltersChange({ ...filters, category: "all" })}
                className={filters.category === "all" ? "bg-accent" : ""}
              >
                All Categories
              </DropdownMenuItem>
              {categories.map(category => (
                <DropdownMenuItem 
                  key={category}
                  onClick={() => onFiltersChange({ ...filters, category })}
                  className={filters.category === category ? "bg-accent" : ""}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Node List - Scrollable */}
      <div className="flex-1 overflow-y-auto p-1 min-h-0 sidebar-scrollbar">
        <div className="space-y-3">
          {Object.entries(groupedNodes).map(([category, nodes]) => {
            const isExpanded = expandedGroups.has(category);
            const CategoryIconComponent = renderCategoryIcon(category);
            
            return (
              <div key={category} className="space-y-2">
                {/* Category Header */}
                <div 
                  className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleGroup(category)}
                >
                  {isExpanded ? (
                    <IconChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <CategoryIconComponent className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm capitalize">{category}</span>
                  <span className="text-xs text-muted-foreground ml-auto">({nodes.length})</span>
                </div>
                
                {/* Category Nodes */}
                {isExpanded && (
                  <div className="ml-4 space-y-2">
                    {nodes.map((node) => {
                      const isSelected = selectedNodes.includes(node.id);
                      const IconComponent = nodeIcons[node.type as keyof typeof nodeIcons] || IconSettings;
                      
                      return (
                        <div
                          key={node.id}
                          className={`p-3 rounded-lg border cursor-grab transition-all hover:shadow-sm hover:cursor-grabbing ${
                            isSelected 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          } ${
                            draggedNodeId === node.id 
                              ? "opacity-50 scale-95 shadow-lg" 
                              : ""
                          }`}
                          onClick={() => onNodeSelect(node.id)}
                          draggable
                          onDragStart={(e) => {
                            setDraggedNodeId(node.id);
                            e.dataTransfer.setData('application/reactflow', JSON.stringify({
                              id: node.id,
                              name: node.name,
                              type: node.type,
                              category: node.category,
                              description: node.description
                            }));
                            e.dataTransfer.effectAllowed = 'move';
                          }}
                          onDragEnd={(e) => {
                            setDraggedNodeId(null);
                            e.dataTransfer.clearData();
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <IconComponent className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <span className="font-medium text-sm truncate">{node.name}</span>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs flex-shrink-0 ${nodeColors[node.type as keyof typeof nodeColors]}`}
                                >
                                  {node.type}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {node.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {Object.keys(groupedNodes).length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <IconSearch className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No nodes found</p>
            <p className="text-xs">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Footer - Fixed */}
      <div className="flex-shrink-0 p-4 border-t border-border">
        <Button className="w-full" size="sm">
          <IconPlus className="mr-2 h-4 w-4" />
          Add Custom Node
        </Button>
      </div>
    </div>
  );
}
