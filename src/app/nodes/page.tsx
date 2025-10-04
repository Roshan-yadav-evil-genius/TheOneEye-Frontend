"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NodesList } from "@/components/nodes/nodes-list";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useNodesPage } from "@/hooks/useNodesPage";

const NodesPageContent = memo(function NodesPageContent() {
  const {
    nodes,
    selectedNode,
    isDeleteDialogOpen,
    handleDeleteNode,
    openEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
  } = useNodesPage();

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
      <Dialog open={isDeleteDialogOpen} onOpenChange={closeDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Node</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedNode?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
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