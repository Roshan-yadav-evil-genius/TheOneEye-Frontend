"use client";

import { useState, useEffect, memo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNodesStore, useUIStore } from "@/stores";
import { NodesList } from "@/components/nodes/nodes-list";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

const NodesPageContent = memo(function NodesPageContent() {
  const router = useRouter();
  
  // Zustand store hooks - optimized selectors
  const nodes = useNodesStore((state) => state.nodes);
  const selectedNode = useNodesStore((state) => state.selectedNode);
  
  const loadNodes = useNodesStore((state) => state.loadNodes);
  const deleteNode = useNodesStore((state) => state.deleteNode);
  const selectNode = useNodesStore((state) => state.selectNode);
  
  const setActivePage = useUIStore((state) => state.setActivePage);

  // Local state for UI
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Load nodes on component mount
  useEffect(() => {
    loadNodes();
    setActivePage("Nodes");
  }, [loadNodes, setActivePage]);



  const handleDeleteNode = async () => {
    if (!selectedNode) return;

    try {
      await deleteNode(selectedNode.id, true); // showToast = true
      setIsDeleteDialogOpen(false);
      selectNode(null);
    } catch {
      // Error toast is handled by the store
      // Delete node error
    }
  };

  const openEditDialog = (nodeId: string) => {
    // Navigate to the edit page instead of opening a dialog
    router.push(`/nodes/edit/${nodeId}`);
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
        onView={() => {
          // TODO: Implement node view functionality
        }}
        onDelete={openDeleteDialog}
      />


      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Node</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedNode?.name}&quot;? This action cannot be undone.
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

export default function Page() {
  return (
    <DashboardLayout>
      <NodesPageContent />
    </DashboardLayout>
  )
}