/**
 * @deprecated Import from '@/stores/workflow' or '@/stores' instead.
 * 
 * This file is kept for backward compatibility.
 * The workflow store has been split into:
 * - workflow-list-store.ts (CRUD operations)
 * - workflow-canvas-store.ts (canvas state)
 * - workflow-selection-store.ts (selection state)
 * - workflow-execution-store.ts (execution state)
 */
import { useWorkflowListStore, workflowListSelectors } from './workflow/workflow-list-store';

// Create a wrapper that provides backward-compatible method names
export const useTWorkflowStore = () => {
  const store = useWorkflowListStore();
  
  return {
    ...store,
    // Backward-compatible method names
    loadTWorkflows: store.loadWorkflows,
    createTWorkflow: store.createWorkflow,
    updateTWorkflow: store.updateWorkflow,
    deleteTWorkflow: store.deleteWorkflow,
    getTWorkflow: store.getWorkflow,
    setActiveTWorkflow: store.setActiveWorkflow,
    activeTWorkflow: store.activeWorkflow,
  };
};

// Re-export the new store for direct usage
export { useWorkflowListStore, workflowListSelectors };
