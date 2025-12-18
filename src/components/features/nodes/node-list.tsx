"use client";

import { useState, useMemo } from "react";
import { TNodeMetadata } from "@/types";
import { NodeCard } from "./node-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconSearch, IconRefresh, IconLayoutGrid, IconList, IconLoader2 } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

interface NodeListProps {
  nodes: TNodeMetadata[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onViewForm?: (node: TNodeMetadata) => void;
  onExecute?: (node: TNodeMetadata) => void;
}

export function NodeList({ 
  nodes, 
  isLoading, 
  onRefresh,
  onViewForm,
  onExecute 
}: NodeListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Get unique categories and types
  const categories = useMemo(() => {
    const cats = new Set<string>();
    nodes.forEach((node) => {
      if (node.category) cats.add(node.category);
    });
    return Array.from(cats).sort();
  }, [nodes]);

  const types = useMemo(() => {
    const t = new Set<string>();
    nodes.forEach((node) => {
      if (node.type) t.add(node.type);
    });
    return Array.from(t).sort();
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

      const matchesCategory =
        categoryFilter === "all" || node.category === categoryFilter;

      const matchesType = typeFilter === "all" || node.type === typeFilter;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [nodes, searchTerm, categoryFilter, typeFilter]);

  // Group nodes by category
  const groupedNodes = useMemo(() => {
    const groups: Record<string, TNodeMetadata[]> = {};
    filteredNodes.forEach((node) => {
      const category = node.category || "Uncategorized";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(node);
    });
    return groups;
  }, [filteredNodes]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading nodes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {filteredNodes.length} of {nodes.length} nodes
          </Badge>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <IconRefresh className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Node grid grouped by category */}
      {Object.keys(groupedNodes).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <IconSearch className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No nodes found</h3>
          <p className="text-muted-foreground">
            {searchTerm || categoryFilter !== "all" || typeFilter !== "all"
              ? "Try adjusting your filters"
              : "No nodes are available"}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedNodes)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([category, categoryNodes]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-semibold">{category}</h2>
                  <Badge variant="secondary">{categoryNodes.length}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categoryNodes.map((node) => (
                    <NodeCard
                      key={node.identifier}
                      node={node}
                      onViewForm={onViewForm}
                      onExecute={onExecute}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

