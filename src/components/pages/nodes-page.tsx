"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  IconPlus, 
  IconSearch, 
  IconFilter, 
  IconEdit, 
  IconTrash, 
  IconEye,
  IconDots,
  IconNetwork,
  IconClock,
  IconSettings,
  IconCheck,
  IconDatabase,
  IconMail,
  IconApi,
  IconFileText,
  IconTag,
  IconArrowUp,
  IconArrowDown,
  IconChevronLeft,
  IconChevronRight
} from "@tabler/icons-react";
import { mockNodes, Node, nodeTypes, nodeCategories } from "@/data/nodes";
import { getNodeColors } from "@/constants/node-styles";

export function NodesPage() {
  const router = useRouter();
  const [nodes, setNodes] = useState<Node[]>(mockNodes);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [editingNode, setEditingNode] = useState<Partial<Node>>({});
  
  // Table state
  const [sortField, setSortField] = useState<keyof Node>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter and sort nodes
  const filteredAndSortedNodes = useMemo(() => {
    let filtered = nodes.filter(node => {
      const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           node.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           node.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || node.category === selectedCategory;
      const matchesType = selectedType === "all" || node.type === selectedType;
      
      return matchesSearch && matchesCategory && matchesType;
    });

    // Sort nodes
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      return 0;
    });

    return filtered;
  }, [nodes, searchTerm, selectedCategory, selectedType, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedNodes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNodes = filteredAndSortedNodes.slice(startIndex, endIndex);

  const handleSort = (field: keyof Node) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Reset pagination when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setCurrentPage(1);
  };

  const nodeIcons = {
    trigger: IconClock,
    action: IconSettings,
    logic: IconCheck,
    system: IconDatabase,
  };

  const categoryIcons = {
    system: IconDatabase,
    email: IconMail,
    database: IconDatabase,
    api: IconApi,
    logic: IconCheck,
    control: IconClock,
    file: IconFileText,
  };


  const handleUpdateNode = () => {
    if (!selectedNode) return;

    const updatedNode = {
      ...selectedNode,
      ...editingNode,
      updatedAt: new Date(),
    };

    setNodes(prev => prev.map(node => 
      node.id === selectedNode.id ? updatedNode : node
    ));
    setIsEditDialogOpen(false);
    setSelectedNode(null);
    setEditingNode({});
  };

  const handleDeleteNode = () => {
    if (!selectedNode) return;

    setNodes(prev => prev.filter(node => node.id !== selectedNode.id));
    setIsDeleteDialogOpen(false);
    setSelectedNode(null);
  };

  const openEditDialog = (node: Node) => {
    setSelectedNode(node);
    setEditingNode(node);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (node: Node) => {
    setSelectedNode(node);
    setIsDeleteDialogOpen(true);
  };

  const getNodeIcon = (type: string) => {
    const IconComponent = nodeIcons[type as keyof typeof nodeIcons] || IconSettings;
    return <IconComponent className="h-4 w-4" />;
  };

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || IconSettings;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Manage and configure workflow nodes
          </p>
        </div>
        <Button onClick={() => router.push("/nodes/create")}>
          <IconPlus className="h-4 w-4 mr-2" />
          Create Node
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search nodes..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {nodeCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-[180px]">
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
        </CardContent>
      </Card>

      {/* Nodes Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <CardTitle>Nodes</CardTitle>
              <CardDescription>
                Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedNodes.length)} of {filteredAndSortedNodes.length} nodes
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Inline Stats */}
              <div className="flex items-center gap-4 lg:gap-6">
                <div className="flex items-center gap-2">
                  <IconNetwork className="h-4 w-4 text-blue-600" />
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-lg font-bold">{nodes.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IconCheck className="h-4 w-4 text-green-600" />
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Active</p>
                    <p className="text-lg font-bold">{nodes.filter(n => n.isActive).length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IconSettings className="h-4 w-4 text-purple-600" />
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Actions</p>
                    <p className="text-lg font-bold">{nodes.filter(n => n.type === 'action').length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <IconClock className="h-4 w-4 text-orange-600" />
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Triggers</p>
                    <p className="text-lg font-bold">{nodes.filter(n => n.type === 'trigger').length}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="items-per-page" className="text-sm">Items per page:</Label>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? <IconArrowUp className="h-4 w-4" /> : <IconArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center gap-2">
                      Type
                      {sortField === 'type' && (
                        sortDirection === 'asc' ? <IconArrowUp className="h-4 w-4" /> : <IconArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center gap-2">
                      Category
                      {sortField === 'category' && (
                        sortDirection === 'asc' ? <IconArrowUp className="h-4 w-4" /> : <IconArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('version')}
                  >
                    <div className="flex items-center gap-2">
                      Version
                      {sortField === 'version' && (
                        sortDirection === 'asc' ? <IconArrowUp className="h-4 w-4" /> : <IconArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('updatedAt')}
                  >
                    <div className="flex items-center gap-2">
                      Updated
                      {sortField === 'updatedAt' && (
                        sortDirection === 'asc' ? <IconArrowUp className="h-4 w-4" /> : <IconArrowDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="w-[50px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedNodes.map((node) => {
                  const { colorClass } = getNodeColors(node.type);
                  
                  return (
                    <TableRow key={node.id} className="hover:bg-muted/50">
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
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {node.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(node.category)}
                          <span className="capitalize">{node.category}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate" title={node.description}>
                          {node.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {node.version}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {node.updatedAt?.toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {node.tags?.slice(0, 2).map((tag, index) => (
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
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <IconDots className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(node)}>
                              <IconEdit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => openDeleteDialog(node)}
                              className="text-destructive"
                            >
                              <IconTrash className="h-4 w-4 mr-2" />
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
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <IconChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <IconChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {filteredAndSortedNodes.length === 0 && (
            <div className="text-center py-8">
              <IconSearch className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No nodes found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or create a new node.
              </p>
            </div>
          )}
        </CardContent>
      </Card>


      {/* Edit Node Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
            <DialogDescription>
              Update the node configuration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingNode.name || ""}
                  onChange={(e) => setEditingNode(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Node name"
                />
              </div>
              <div>
                <Label htmlFor="edit-version">Version</Label>
                <Input
                  id="edit-version"
                  value={editingNode.version || ""}
                  onChange={(e) => setEditingNode(prev => ({ ...prev, version: e.target.value }))}
                  placeholder="1.0.0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-type">Type</Label>
                <Select 
                  value={editingNode.type || "action"} 
                  onValueChange={(value) => setEditingNode(prev => ({ ...prev, type: value as Node['type'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {nodeTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select 
                  value={editingNode.category || "system"} 
                  onValueChange={(value) => setEditingNode(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {nodeCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editingNode.description || ""}
                onChange={(e) => setEditingNode(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Node description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={editingNode.tags?.join(", ") || ""}
                onChange={(e) => setEditingNode(prev => ({ 
                  ...prev, 
                  tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                }))}
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateNode}>
              Update Node
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Node</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedNode?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteNode}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
