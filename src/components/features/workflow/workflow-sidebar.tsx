"use client";

import { useState, useEffect } from "react";
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
  IconChevronDown,
  IconChevronRight,
  IconLoader2,
  IconAlertCircle,
  IconPhotoOff
} from "@tabler/icons-react";
import { useNodesByNodeGroup } from "@/hooks/useSharedNodes";
import { TNode } from "@/types";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { NodeLogo } from "@/components/common/node-logo";

interface WorkflowSidebarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: {
    nodeGroup: string;
  };
  onFiltersChange: (filters: { nodeGroup: string }) => void;
  selectedNodes: string[];
  onNodeSelect: (nodeId: string) => void;
}

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
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  // Use the shared nodes hook for better performance
  const { 
    nodesByNodeGroup,
    nodeGroups,
    totalNodes,
    isLoading, 
    error, 
    clearError 
  } = useNodesByNodeGroup();

  // Filter nodes based on search and nodeGroup filters
  const filteredNodesByNodeGroup = Object.entries(nodesByNodeGroup).reduce((acc, [nodeGroup, nodes]) => {
    const filteredNodes = nodes.filter(node => {
      const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           node.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesNodeGroup = filters.nodeGroup === "all" || node.nodeGroupName === filters.nodeGroup;
      
      return matchesSearch && matchesNodeGroup;
    });
    
    if (filteredNodes.length > 0) {
      acc[nodeGroup] = filteredNodes;
    }
    return acc;
  }, {} as Record<string, TNode[]>);
  
  const toggleGroup = (nodeGroup: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(nodeGroup)) {
      newExpanded.delete(nodeGroup);
    } else {
      newExpanded.add(nodeGroup);
    }
    setExpandedGroups(newExpanded);
  };

  // Get the first node from each group to extract the nodeGroupIcon
  const getNodeGroupIcon = (nodeGroup: string) => {
    const nodes = nodesByNodeGroup[nodeGroup] || [];
    const firstNode = nodes[0];
    return firstNode?.nodeGroupIcon;
  };

  // Handle retry on error
  const handleRetry = () => {
    clearError();
    // The hook will automatically reload when error is cleared
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
                onClick={() => onFiltersChange({ ...filters, nodeGroup: "all" })}
                className={filters.nodeGroup === "all" ? "bg-accent" : ""}
              >
                All Groups
              </DropdownMenuItem>
              {nodeGroups.map(nodeGroup => (
                <DropdownMenuItem 
                  key={nodeGroup}
                  onClick={() => onFiltersChange({ ...filters, nodeGroup })}
                  className={filters.nodeGroup === nodeGroup ? "bg-accent" : ""}
                >
                  {nodeGroup}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Node List - Scrollable */}
      <div className="flex-1 overflow-y-auto p-1 min-h-0 sidebar-scrollbar">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <IconLoader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Loading nodes...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <IconAlertCircle className="h-8 w-8 text-destructive mb-2" />
            <p className="text-sm text-destructive mb-2">Failed to load nodes</p>
            <p className="text-xs text-muted-foreground mb-4">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              className="text-xs"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Nodes List */}
        {!isLoading && !error && (
          <div className="space-y-3">
          {Object.entries(filteredNodesByNodeGroup).map(([nodeGroup, nodes]) => {
            const isExpanded = expandedGroups.has(nodeGroup);
            const nodeGroupIcon = getNodeGroupIcon(nodeGroup);
            
            return (
              <div key={nodeGroup} className="space-y-2">
                {/* NodeGroup Header */}
                <div 
                  className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleGroup(nodeGroup)}
                >
                  {isExpanded ? (
                    <IconChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <IconChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <ImageWithFallback
                    src={nodeGroupIcon}
                    alt={nodeGroup}
                    width={16}
                    height={16}
                    className="h-4 w-4 object-contain"
                    fallbackIcon={<IconPhotoOff className="h-4 w-4 text-muted-foreground" />}
                  />
                  <span className="font-medium text-sm">{nodeGroup}</span>
                  <span className="text-xs text-muted-foreground ml-auto">({nodes.length})</span>
                </div>
                
                {/* NodeGroup Nodes */}
                {isExpanded && (
                  <div className="ml-4 space-y-2">
                    {nodes.map((node) => {
                      const isSelected = selectedNodes.includes(node.id);
                      
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
                              nodeGroup: node.nodeGroup,
                              nodeGroupName: node.nodeGroupName,
                              nodeGroupIcon: node.nodeGroupIcon,
                              description: node.description,
                              logo: node.logo
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
                              <NodeLogo node={node} size="md" />
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
          
          {Object.keys(filteredNodesByNodeGroup).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <IconSearch className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No nodes found</p>
              <p className="text-xs">Try adjusting your search or filters</p>
            </div>
          )}
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
