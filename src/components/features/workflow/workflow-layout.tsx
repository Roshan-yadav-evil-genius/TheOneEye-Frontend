"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { WorkflowSidebar } from "./workflow-sidebar";
import { WorkflowStatsHeader } from "./workflow-stats-header";
import { WorkflowCanvas } from "./workflow-canvas";
import { useWorkflowLayout } from "@/hooks/useWorkflowLayout";
import { useWorkflowExecution } from "@/hooks/useWorkflowExecution";
import { cn } from "@/lib/utils";

interface WorkflowLayoutProps {
  workflowId?: string;
}

const MIN_SIDEBAR_WIDTH = 320;
const MAX_SIDEBAR_WIDTH = 600;

export function WorkflowLayout({ workflowId }: WorkflowLayoutProps = {}) {
  const {
    selectedNodes,
    searchTerm,
    filters,
    isSidebarCollapsed,
    lineType,
    showMinimap,
    setSearchTerm,
    setFilters,
    handleNodeSelect,
    handleLineTypeChange,
    handleMinimapToggle,
    handleToggleSidebar,
  } = useWorkflowLayout({ workflowId });

  const {
    isRunning,
    startExecution,
    stopExecution,
  } = useWorkflowExecution({ workflowId });

  // Sidebar resize state
  const [sidebarWidth, setSidebarWidth] = useState(MIN_SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [sidebarWidth]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - startXRef.current;
    const newWidth = Math.max(
      MIN_SIDEBAR_WIDTH,
      Math.min(MAX_SIDEBAR_WIDTH, startWidthRef.current + deltaX)
    );
    setSidebarWidth(newWidth);
  }, [isResizing]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  return (
    <div className="flex h-[calc(100vh-var(--header-height))] bg-background">
      {/* Left Sidebar */}
      {!isSidebarCollapsed && (
        <div 
          className="relative border-r border-border bg-card h-full flex flex-col flex-shrink-0"
          style={{ width: sidebarWidth }}
        >
          <WorkflowSidebar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFiltersChange={setFilters}
            selectedNodes={selectedNodes}
            onNodeSelect={handleNodeSelect}
            isExecuting={isRunning}
          />
          
          {/* Resize Handle */}
          <div
            onMouseDown={handleResizeStart}
            className={cn(
              "absolute top-0 right-0 w-1 h-full cursor-col-resize z-10",
              "hover:bg-primary/50 transition-colors",
              isResizing && "bg-primary"
            )}
          >
            {/* Wider hit area */}
            <div className="absolute inset-y-0 -left-1 -right-1" />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Stats Header */}
        <div className="border-b border-border bg-card">
          <WorkflowStatsHeader
            isRunning={isRunning}
            onStart={startExecution}
            onStop={stopExecution}
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
              isRunning={isRunning}
            />
          )}
        </div>
      </div>
    </div>
  );
}
