"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NodesTable } from "@/components/features/nodes";
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
    try {
      const formData = await ApiService.getNodeForm(node.identifier);
      console.log("Node form:", formData);
      // TODO: Open form modal/dialog
    } catch (error) {
      console.error("Failed to fetch node form:", error);
    }
  };

  const handleExecute = async (node: TNodeMetadata) => {
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
    </DashboardLayout>
  );
}
