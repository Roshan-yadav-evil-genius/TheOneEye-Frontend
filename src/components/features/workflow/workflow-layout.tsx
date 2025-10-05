"use client";

import { WorkflowSidebar } from "./workflow-sidebar";
import { WorkflowStatsHeader } from "./workflow-stats-header";
import { WorkflowCanvas } from "./workflow-canvas";
import { useWorkflowLayout } from "@/hooks/useWorkflowLayout";

interface WorkflowLayoutProps {
  workflowId?: string;
}

export function WorkflowLayout({ workflowId }: WorkflowLayoutProps = {}) {
  const {
    isRunning,
    selectedNodes,
    searchTerm,
    filters,
    isSidebarCollapsed,
    lineType,
    showMinimap,
    setSearchTerm,
    setFilters,
    handleRunStop,
    handleNodeSelect,
    handleLineTypeChange,
    handleMinimapToggle,
    handleToggleSidebar,
  } = useWorkflowLayout({ workflowId });

  return (
    <div className="flex h-[calc(100vh-var(--header-height))] bg-background">
      {/* Left Sidebar */}
      {!isSidebarCollapsed && (
        <div className="w-80 border-r border-border bg-card transition-all duration-300 h-full flex flex-col">
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
            onToggleSidebar={handleToggleSidebar}
            lineType={lineType}
            onLineTypeChange={handleLineTypeChange}
            showMinimap={showMinimap}
            onMinimapToggle={handleMinimapToggle}
            workflowId={workflowId}
          />
        </div>

        {/* Center Canvas */}
        <div className="flex-1">
          {workflowId && (
            <WorkflowCanvas
              workflowId={workflowId}
              selectedNodes={selectedNodes}
              searchTerm={searchTerm}
              filters={filters}
              lineType={lineType}
              showMinimap={showMinimap}
            />
          )}
        </div>
      </div>
    </div>
  );
}
