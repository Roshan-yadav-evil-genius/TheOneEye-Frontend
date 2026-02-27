/**
 * Store Index
 * 
 * Re-exports all stores from their feature-based modules.
 */

// ============================================================================
// Workflow stores
// ============================================================================
export {
  useWorkflowListStore,
  workflowListSelectors,
  useWorkflowCanvasStore,
  workflowCanvasSelectors,
  useWorkflowSelectionStore,
  workflowSelectionSelectors,
  useWorkflowExecutionStore,
  workflowExecutionSelectors,
} from './workflow';

// ============================================================================
// Auth stores
// ============================================================================
export { useAuthStore } from './auth';

// ============================================================================
// UI stores
// ============================================================================
export { useUIStore, uiHelpers, uiSelectors } from './ui';

// ============================================================================
// Other stores
// ============================================================================
export { useUserStore } from './user-store';
export { useFormStore } from './form-store';
export { useWorkflowLayoutStore, useWorkflowLayout } from './workflow-layout-store';
export { useWorkflowTableStore, useWorkflowTable } from './workflow-table-store';
export { useBrowserSessionStore } from './browser-session-store';
export { useBrowserPoolStore } from './browser-pool-store';
export { usePoolDomainThrottleStore } from './pool-domain-throttle-store';
export { useDomainThrottleStore } from './domain-throttle-store';
export { useGoogleOAuthStore } from './google-oauth-store';

// ============================================================================
// Types
// ============================================================================
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
// Store utilities
// ============================================================================
import { useUserStore } from './user-store';
import { useWorkflowListStore } from './workflow';
import { useFormStore } from './form-store';
import { useUIStore } from './ui';
import type { TWorkflow } from './types';

export const initializeStores = async () => {
  const { loadWorkflows } = useWorkflowListStore.getState();

  try {
    await loadWorkflows();
  } catch (error) {
    // Use logger if available, fallback to console
    if (typeof window !== 'undefined') {
      const { logger } = await import('@/lib/logging');
      logger.error('Failed to initialize stores', error, 'store-initialization');
    }
  }
};

export const resetAllStores = () => {
  useUserStore.getState().logout();
  useWorkflowListStore.getState().reset();
  useFormStore.setState({
    configurations: [],
    activeConfiguration: null,
    isLoading: false,
    error: null,
  });
  useUIStore.getState().resetUI();
};

export const storeSelectors = {
  getCurrentUser: () => useUserStore.getState().user,
  isAuthenticated: () => useUserStore.getState().isAuthenticated,
  getActiveWorkflow: () => useWorkflowListStore.getState().activeWorkflow,
  getWorkflowsByStatus: (status: string) => 
    useWorkflowListStore.getState().workflows.filter((workflow) => workflow.status === status),
  getFormConfigurationsByNode: (nodeId: string) => 
    useFormStore.getState().configurations.filter((config) => config.nodeId === nodeId),
  getUnreadNotifications: () => 
    useUIStore.getState().notifications.filter((notification) => !notification.read),
  getOpenModals: () => {
    const { modals } = useUIStore.getState();
    return Object.entries(modals)
      .filter(([, isOpen]) => isOpen)
      .map(([modalName]) => modalName);
  },
};

export const storeActions = {
  createWorkflowWithNodes: async (workflowData: Partial<TWorkflow>) => {
    const { createWorkflow } = useWorkflowListStore.getState();
    const workflow = await createWorkflow(workflowData as TWorkflow);
    return { workflow };
  },
  
  deleteWorkflow: async (workflowId: string) => {
    const { deleteWorkflow } = useWorkflowListStore.getState();
    await deleteWorkflow(workflowId);
  },
};
