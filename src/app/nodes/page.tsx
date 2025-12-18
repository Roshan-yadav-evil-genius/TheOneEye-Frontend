"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NodesTable, NodeExecuteDialog } from "@/components/features/nodes";
import { ApiService } from "@/lib/api/api-service";
import { TNodeMetadata } from "@/types";

export default function NodesPage() {
  const [nodes, setNodes] = useState<TNodeMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Execute dialog state
  const [executeDialogOpen, setExecuteDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TNodeMetadata | null>(null);

  const fetchNodes = async () => {
    setIsLoading(true);
    try {
      const data = await ApiService.getNodesFlat();
      setNodes(data);
    } catch (error) {
      console.error("Failed to fetch nodes:", error);
      setNodes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await ApiService.refreshNodeCache();
      await fetchNodes();
    } catch (error) {
      console.error("Failed to refresh nodes:", error);
    }
  };

  const handleViewForm = (node: TNodeMetadata) => {
    // Open execute dialog to view form
    setSelectedNode(node);
    setExecuteDialogOpen(true);
  };

  const handleExecute = (node: TNodeMetadata) => {
    // Open execute dialog
    setSelectedNode(node);
    setExecuteDialogOpen(true);
  };

  const handleViewDetails = (node: TNodeMetadata) => {
    console.log("View details for node:", node);
    // TODO: Open details modal/dialog
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6 py-6">
        <NodesTable
          nodes={nodes}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onViewForm={handleViewForm}
          onExecute={handleExecute}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* Execute Dialog */}
      {selectedNode && (
        <NodeExecuteDialog
          isOpen={executeDialogOpen}
          onOpenChange={setExecuteDialogOpen}
          node={selectedNode}
        />
      )}
    </DashboardLayout>
  );
}
