"use client";

import { useState, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Node, nodeTypes, nodeCategories } from "@/data/nodes";
import { useNodesStore, useUIStore, uiHelpers } from "@/stores";
import { NodesList } from "@/components/nodes/nodes-list";

export const NodesPage = memo(function NodesPage() {
  // Zustand store hooks - optimized selectors
  const nodes = useNodesStore((state) => state.nodes);
  const selectedNode = useNodesStore((state) => state.selectedNode);
  
  const loadNodes = useNodesStore((state) => state.loadNodes);
  const updateNode = useNodesStore((state) => state.updateNode);
  const deleteNode = useNodesStore((state) => state.deleteNode);
  const selectNode = useNodesStore((state) => state.selectNode);
  
  const setActivePage = useUIStore((state) => state.setActivePage);

  // Local state for UI
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<Partial<Node>>({});

  // Load nodes on component mount
  useEffect(() => {
    loadNodes();
    setActivePage("Nodes");
  }, [loadNodes, setActivePage]);


  const handleUpdateNode = async () => {
    if (!selectedNode) return;

    try {
      await updateNode(selectedNode.id, editingNode);
      uiHelpers.showSuccess("Success!", "Node updated successfully");
      setIsEditDialogOpen(false);
      selectNode(null);
      setEditingNode({});
    } catch (error) {
      uiHelpers.showError("Error", "Failed to update node. Please try again.");
    }
  };

  const handleDeleteNode = async () => {
    if (!selectedNode) return;

    try {
      await deleteNode(selectedNode.id);
      uiHelpers.showSuccess("Success!", "Node deleted successfully");
      setIsDeleteDialogOpen(false);
      selectNode(null);
    } catch (error) {
      uiHelpers.showError("Error", "Failed to delete node. Please try again.");
    }
  };

  const openEditDialog = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
    selectNode(node);
    setEditingNode(node);
    setIsEditDialogOpen(true);
    }
  };

  const openDeleteDialog = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
    selectNode(node);
    setIsDeleteDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Nodes Table */}
      <NodesList 
        nodes={nodes} 
        onEdit={openEditDialog}
        onView={(id) => {
          // TODO: Implement node view functionality
        }}
        onDelete={openDeleteDialog}
      />

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
});
