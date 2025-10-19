import { useWorkflowLayout as useWorkflowLayoutStore } from "@/stores/workflow-layout-store";

interface UseWorkflowLayoutProps {
  workflowId?: string;
}

export const useWorkflowLayout = ({ workflowId }: UseWorkflowLayoutProps = {}) => {
  const storeHook = useWorkflowLayoutStore(workflowId);

  const handleNodeSelect = (nodeId: string) => {
    storeHook.toggleNodeSelection(nodeId);
  };

  const handleLineTypeChange = (type: string) => {
    storeHook.setLineType(type);
  };

  const handleMinimapToggle = () => {
    storeHook.toggleMinimap();
  };

  const handleToggleSidebar = () => {
    storeHook.toggleSidebar();
  };

  return {
    // State
    selectedNodes: storeHook.selectedNodes,
    searchTerm: storeHook.searchTerm,
    filters: storeHook.filters,
    isSidebarCollapsed: storeHook.isSidebarCollapsed,
    lineType: storeHook.lineType,
    showMinimap: storeHook.showMinimap,
    
    // Actions
    setSearchTerm: storeHook.setSearchTerm,
    setFilters: storeHook.setFilters,
    handleNodeSelect,
    handleLineTypeChange,
    handleMinimapToggle,
    handleToggleSidebar,
  };
};
