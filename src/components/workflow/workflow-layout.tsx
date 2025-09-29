"use client";

import { useState } from "react";
import { WorkflowSidebar } from "./workflow-sidebar";
import { WorkflowStatsHeader } from "./workflow-stats-header";
import { WorkflowCanvas } from "./workflow-canvas";

interface WorkflowLayoutProps {
  workflowId?: string;
}

export function WorkflowLayout({ workflowId }: WorkflowLayoutProps = {}) {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  // TODO: Load workflow data based on workflowId
  // const { data: workflow } = useWorkflow(workflowId);

  const handleRunStop = () => {
    setIsRunning(!isRunning);
  };

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  return (
    <div className="flex h-full bg-background">
      {/* Left Sidebar */}
      {!isSidebarCollapsed && (
        <div className="w-80 border-r border-border bg-card transition-all duration-300">
          <WorkflowSidebar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFiltersChange={setFilters}
            selectedNodes={selectedNodes}
            onNodeSelect={handleNodeSelect}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Stats Header */}
        <div className="border-b border-border bg-card">
          <WorkflowStatsHeader
            isRunning={isRunning}
            onRunStop={handleRunStop}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* Center Canvas */}
        <div className="flex-1">
          <WorkflowCanvas
            selectedNodes={selectedNodes}
            searchTerm={searchTerm}
            filters={filters}
          />
        </div>
      </div>
    </div>
  );
}
