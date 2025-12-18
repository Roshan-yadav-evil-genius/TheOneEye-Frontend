/**
 * Store Index
 * 
 * Re-exports all stores from their feature-based modules.
 * This file provides backward compatibility for existing imports.
 */

// ============================================================================
// Feature-based store exports
// ============================================================================

// Workflow stores
export {
  useWorkflowListStore,
  useWorkflowCanvasStore,
  workflowCanvasSelectors,
  useWorkflowSelectionStore,
  workflowSelectionSelectors,
  useWorkflowExecutionStore,
  workflowExecutionSelectors,
} from './workflow';

// Auth stores
export { useAuthStore } from './auth';

// UI stores
export { useUIStore, uiHelpers, uiSelectors } from './ui';

// ============================================================================
// Legacy store exports (for backward compatibility)
// ============================================================================

// Re-export with old names for backward compatibility
// useTWorkflowStore provides backward-compatible method names (loadTWorkflows, createTWorkflow, etc.)
export { useTWorkflowStore, useTWorkflowStore as useWorkflowStore } from './workflow-store';
export { useTUserStore as useUserStore } from './user-store';
export { useFormStore } from './form-store';
export { useWorkflowLayoutStore, useWorkflowLayout } from './workflow-layout-store';
export { useWorkflowTableStore, useWorkflowTable } from './workflow-table-store';
export { useBrowserSessionStore } from './browser-session-store';

// Legacy imports for internal use
import { useTUserStore } from './user-store';
import { useWorkflowListStore } from './workflow';
import { useFormStore } from './form-store';
import { useUIStore } from './ui';

// Export all types
export type {
  TUser,
  TWorkflow,
  TWorkflowConnection,
  TFormConfiguration,
  TUIState,
  TBreadcrumb,
  TNotification,
  TUserState,
  TWorkflowState,
  TFormState,
  TUIStoreState,
} from './types';

// ============================================================================
// Store initialization utilities
// ============================================================================

export const initializeStores = async () => {
  const { loadWorkflows } = useWorkflowListStore.getState();

  try {
    await loadWorkflows();
  } catch (error) {
    console.error('Failed to initialize stores:', error);
  }
};

// ============================================================================
// Store reset utilities
// ============================================================================

export const resetAllStores = () => {
  useTUserStore.getState().logout();
  useWorkflowListStore.getState().reset();
  useFormStore.setState({
    configurations: [],
    activeConfiguration: null,
    isLoading: false,
    error: null,
  });
  useUIStore.getState().resetUI();
};

// ============================================================================
// Store selectors for common use cases
// ============================================================================

export const storeSelectors = {
  // User selectors
  getCurrentUser: () => useTUserStore.getState().user,
  isAuthenticated: () => useTUserStore.getState().isAuthenticated,
  
  // Workflow selectors
  getActiveWorkflow: () => useWorkflowListStore.getState().activeWorkflow,
  getWorkflowsByStatus: (status: string) => 
    useWorkflowListStore.getState().workflows.filter((workflow) => workflow.status === status),
  
  // Form selectors
  getFormConfigurationsByNode: (nodeId: string) => 
    useFormStore.getState().configurations.filter((config) => config.nodeId === nodeId),
  
  // UI selectors
  getUnreadNotifications: () => 
    useUIStore.getState().notifications.filter((notification) => !notification.read),
  getOpenModals: () => {
    const { modals } = useUIStore.getState();
    return Object.entries(modals)
      .filter(([, isOpen]) => isOpen)
      .map(([modalName]) => modalName);
  },
};

// ============================================================================
// Store actions for common operations
// ============================================================================

export const storeActions = {
  createWorkflowWithNodes: async (workflowData: Partial<TWorkflow>, nodeIds: string[]) => {
    const { createWorkflow } = useWorkflowListStore.getState();
    
    const workflow = await createWorkflow(workflowData as TWorkflow);
    
    return { workflow };
  },
  
  deleteWorkflow: async (workflowId: string) => {
    const { deleteWorkflow } = useWorkflowListStore.getState();
    await deleteWorkflow(workflowId);
  },
};

// Import TWorkflow type for storeActions
import type { TWorkflow } from './types';
