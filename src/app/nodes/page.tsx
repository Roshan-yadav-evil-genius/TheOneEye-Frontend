"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NodeList } from "@/components/features/nodes";
import { ApiService } from "@/lib/api/api-service";
import { TNodeMetadata } from "@/types";

export default function NodesPage() {
  const [nodes, setNodes] = useState<TNodeMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleViewForm = async (node: TNodeMetadata) => {
    // For now, log the form data - can be extended to show in a modal
    try {
      const formData = await ApiService.getNodeForm(node.identifier);
      console.log("Node form:", formData);
      // TODO: Open form modal/dialog
    } catch (error) {
      console.error("Failed to fetch node form:", error);
    }
  };

  const handleExecute = async (node: TNodeMetadata) => {
    // For now, execute with empty data - can be extended to collect form input
    try {
      const result = await ApiService.executeNode(node.identifier, {
        input_data: {},
        form_data: {},
      });
      console.log("Node execution result:", result);
      // TODO: Show result in a modal/toast
    } catch (error) {
      console.error("Failed to execute node:", error);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Available Nodes</h1>
          <p className="text-muted-foreground">
            Browse and manage all available node types in the system
          </p>
        </div>
        <NodeList
          nodes={nodes}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onViewForm={handleViewForm}
          onExecute={handleExecute}
        />
      </div>
    </DashboardLayout>
  );
}

