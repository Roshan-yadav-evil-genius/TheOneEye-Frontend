// Store management utilities and middleware
// Import stores for internal use
import { useTUserStore } from './user-store';
import { useTWorkflowStore } from './workflow-store';
import { useFormStore } from './form-store';
import { useUIStore, uiHelpers } from './ui-store';
import { useWorkflowCanvasStore, workflowCanvasSelectors } from './workflow-canvas-store';
import { TFormConfiguration } from '@/types';

// Re-export stores for external use
export { useTUserStore as useUserStore } from './user-store';
export { useTWorkflowStore as useWorkflowStore } from './workflow-store';
export { useFormStore } from './form-store';
export { useUIStore, uiHelpers } from './ui-store';
export { useWorkflowCanvasStore, workflowCanvasSelectors } from './workflow-canvas-store';
export { useWorkflowLayoutStore, useWorkflowLayout } from './workflow-layout-store';
export { useWorkflowTableStore, useWorkflowTable } from './workflow-table-store';
export { useBrowserSessionStore } from './browser-session-store';

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

// Store initialization utilities
export const initializeStores = async () => {
  // Initialize stores with default data if needed
  const { loadTWorkflows } = useTWorkflowStore.getState();

  try {
    // Load initial data
    await loadTWorkflows();
  } catch (error) {
    console.error('Failed to initialize stores:', error);
  }
};

// Store reset utilities
export const resetAllStores = () => {
  // Reset all stores to initial state
  useTUserStore.getState().logout();
  useTWorkflowStore.setState({
    workflows: [],
    activeWorkflow: null,
    isLoading: false,
    error: null,
    selectedNodes: [],
    selectedConnections: [],
  });
  useFormStore.setState({
    configurations: [],
    activeConfiguration: null,
    isLoading: false,
    error: null,
  });

  useUIStore.getState().resetUI();
};



// Store selectors for common use cases
export const storeSelectors = {
  // User selectors
  getCurrentUser: () => useTUserStore.getState().user,
  isAuthenticated: () => useTUserStore.getState().isAuthenticated,
  
  // Workflow selectors
  getActiveWorkflow: () => useTWorkflowStore.getState().activeWorkflow,
  getWorkflowsByStatus: (status: string) => 
    useTWorkflowStore.getState().workflows.filter((workflow) => workflow.status === status),
  
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

// Store actions for common operations
export const storeActions = {
  createWorkflowWithNodes: async (workflowData: Partial<TWorkflow>, nodeIds: string[]) => {
    const { createWorkflow } = useTWorkflowStore.getState();
    
    const workflow = await createWorkflow(workflowData as TWorkflow);
    
    return { workflow };
  },
  
  deleteWorkflow: async (workflowId: string) => {
    const { deleteWorkflow } = useTWorkflowStore.getState();
    await deleteWorkflow(workflowId);
  },
};

// Store middleware for logging and debugging
export const storeMiddleware = {
  logStateChanges: (storeName: string) => {
    return <T>(config: (set: (...args: unknown[]) => void, get: () => T, api: unknown) => T) => (set: (...args: unknown[]) => void, get: () => T, api: unknown) =>
      config(
        (...args: unknown[]) => {
          console.log(`${storeName} state changed:`, get());
          set(...args);
        },
        get,
        api
      );
  },
  
  persistToLocalStorage: (storeName: string, keys: string[]) => {
    return <T>(config: (set: (...args: unknown[]) => void, get: () => T, api: unknown) => T) => (set: (...args: unknown[]) => void, get: () => T, api: unknown) => {
      const store = config(set, get, api);
      
      // Load from localStorage on initialization
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`${storeName}-store`);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const partialState = keys.reduce((acc, key) => {
              if (key in parsed && parsed[key] !== undefined) {
                acc[key] = parsed[key];
              }
              return acc;
            }, {} as Record<string, unknown>);
            
            if (Object.keys(partialState).length > 0) {
              set(partialState);
            }
          } catch (error) {
            console.error(`Failed to load ${storeName} from localStorage:`, error);
          }
        }
      }
      
      // Save to localStorage on changes
      const originalSet = set;
      set = (...args: unknown[]) => {
        originalSet(...args);
        
        if (typeof window !== 'undefined') {
          const state = get();
          const partialState = keys.reduce((acc, key) => {
            if (key in state) {
              acc[key] = (state as Record<string, unknown>)[key];
            }
            return acc;
          }, {} as Record<string, unknown>);
          
          localStorage.setItem(`${storeName}-store`, JSON.stringify(partialState));
        }
      };
      
      return store;
    };
  },
};
