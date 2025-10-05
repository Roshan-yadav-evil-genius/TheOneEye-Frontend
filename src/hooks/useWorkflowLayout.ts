import { useState } from "react";

interface UseWorkflowLayoutProps {
  workflowId?: string;
}

export const useWorkflowLayout = ({ workflowId }: UseWorkflowLayoutProps = {}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    nodeGroup: "all",
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [lineType, setLineType] = useState("step");
  const [showMinimap, setShowMinimap] = useState(true);

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

  const handleLineTypeChange = (type: string) => {
    setLineType(type);
  };

  const handleMinimapToggle = () => {
    setShowMinimap(!showMinimap);
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return {
    // State
    isRunning,
    selectedNodes,
    searchTerm,
    filters,
    isSidebarCollapsed,
    lineType,
    showMinimap,
    
    // Actions
    setSearchTerm,
    setFilters,
    handleRunStop,
    handleNodeSelect,
    handleLineTypeChange,
    handleMinimapToggle,
    handleToggleSidebar,
  };
};
