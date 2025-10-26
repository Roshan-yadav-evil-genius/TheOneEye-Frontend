import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNodesStore, useUIStore } from "@/stores";

export const useNodesPage = () => {
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

  // Set active page on component mount
  useEffect(() => {
    setActivePage("Nodes");
  }, [setActivePage]);

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

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  return {
    nodes,
    selectedNode,
    isDeleteDialogOpen,
    handleDeleteNode,
    openEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
  };
};
