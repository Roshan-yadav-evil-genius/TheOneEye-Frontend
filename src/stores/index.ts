// Store management utilities and middleware
// Import stores for internal use
import { useTUserStore } from './user-store';
import { useEnhancedNodesStore, nodesSelectors } from './enhanced-nodes-store';
import { useTWorkflowStore } from './workflow-store';
import { useFormStore } from './form-store';
import { useUIStore, uiHelpers } from './ui-store';
import { useTProjectsStore } from './projects-store';
import { useWorkflowCanvasStore, workflowCanvasSelectors } from './workflow-canvas-store';

// Re-export stores for external use
export { useTUserStore as useUserStore } from './user-store';
export { useEnhancedNodesStore as useNodesStore, nodesSelectors } from './enhanced-nodes-store';
export { useTWorkflowStore as useWorkflowStore } from './workflow-store';
export { useFormStore } from './form-store';
export { useUIStore, uiHelpers } from './ui-store';
export { useTProjectsStore as useProjectsStore } from './projects-store';
export { useWorkflowCanvasStore, workflowCanvasSelectors } from './workflow-canvas-store';

// Export all types
export type {
  TUser,
  TNode,
  TWorkflow,
  TWorkflowConnection,
  TProject,
  TFormConfiguration,
  TUIState,
  TBreadcrumb,
  TNotification,
  TUserState,
  TNodesState,
  TWorkflowState,
  TProjectsState,
  TFormState,
  TUIStoreState,
} from './types';

// Store initialization utilities
export const initializeStores = async () => {
  // Initialize stores with default data if needed
  const { loadNodes } = useEnhancedNodesStore.getState();
  const { loadTWorkflows } = useTWorkflowStore.getState();
  const { loadTFormConfigurations } = useFormStore.getState();
  const { loadTProjects } = useTProjectsStore.getState();

  try {
    // Load initial data in parallel
    await Promise.all([
      loadNodes({}, { showToast: false }), // Don't show toast on initial load
      loadTWorkflows(),
      loadTFormConfigurations(),
      loadTProjects(),
    ]);
  } catch (error) {
    console.error('Failed to initialize stores:', error);
  }
};

// Store reset utilities
export const resetAllStores = () => {
  // Reset all stores to initial state
  useTUserStore.getState().logout();
  useEnhancedNodesStore.getState().reset();
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
  useTProjectsStore.setState({
    projects: [],
    activeProject: null,
    isLoading: false,
    error: null,
  });
  useUIStore.getState().resetUI();
};

// Store synchronization utilities
export const syncStores = () => {
  // Sync related data between stores
  const { workflows } = useTWorkflowStore.getState();
  const { projects } = useTProjectsStore.getState();
  
  // Update project workflows if needed
  projects.forEach((project) => {
    const projectWorkflows = workflows.filter((workflow) => 
      project.workflows.includes(workflow.id)
    );
    
    // If project has workflows that no longer exist, remove them
    const validWorkflowIds = projectWorkflows.map((w) => w.id);
    const invalidWorkflowIds = project.workflows.filter((id) => !validWorkflowIds.includes(id));
    
    if (invalidWorkflowIds.length > 0) {
      invalidWorkflowIds.forEach((workflowId) => {
        useTProjectsStore.getState().removeWorkflowFromProject(project.id, workflowId);
      });
    }
  });
};

// Store selectors for common use cases
export const storeSelectors = {
  // User selectors
  getCurrentUser: () => useTUserStore.getState().user,
  isAuthenticated: () => useTUserStore.getState().isAuthenticated,
  
  // Node selectors
  getNodesByType: (type: string) => 
    useEnhancedNodesStore.getState().nodes.filter((node) => node.type === type),
  getNodesByCategory: (category: string) => 
    useEnhancedNodesStore.getState().nodes.filter((node) => node.category === category),
  getFilteredNodes: () => {
    const { nodes, filters } = useEnhancedNodesStore.getState();
    return nodes.filter((node) => {
      if (filters.type && node.type !== filters.type) return false;
      if (filters.category && node.category !== filters.category) return false;
      if (filters.search && !node.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  },
  
  // Workflow selectors
  getActiveWorkflow: () => useTWorkflowStore.getState().activeWorkflow,
  getWorkflowsByStatus: (status: string) => 
    useTWorkflowStore.getState().workflows.filter((workflow) => workflow.status === status),
  
  // Project selectors
  getActiveProject: () => useTProjectsStore.getState().activeProject,
  getProjectsByStatus: (status: string) => 
    useTProjectsStore.getState().projects.filter((project) => project.status === status),
  
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
  // Create new entities with proper relationships
  createNodeWithForm: async (nodeData: Partial<TNode>, formData: Partial<TFormConfiguration>) => {
    const { createNode } = useEnhancedNodesStore.getState();
    const { createFormConfiguration } = useFormStore.getState();
    
    const node = await createNode(nodeData as TNodeCreateData);
    const formConfig = await createFormConfiguration({
      ...(formData as TFormConfiguration),
      nodeId: node.id,
    });
    
    return { node, formConfig };
  },
  
  createWorkflowWithNodes: async (workflowData: Partial<TWorkflow>, nodeIds: string[]) => {
    const { createWorkflow } = useTWorkflowStore.getState();
    const { nodes } = useEnhancedNodesStore.getState();
    
    const workflow = await createWorkflow(workflowData as TWorkflow);
    const workflowNodes = nodes.filter((node) => nodeIds.includes(node.id));
    
    // Add nodes to workflow
    for (const node of workflowNodes) {
      await useTWorkflowStore.getState().addNodeToWorkflow(workflow.id, node);
    }
    
    return { workflow, nodes: workflowNodes };
  },
  
  createProjectWithWorkflows: async (projectData: Partial<TProject>, workflowIds: string[]) => {
    const { createProject } = useTProjectsStore.getState();
    
    const project = await createProject(projectData);
    
    // Add workflows to project
    for (const workflowId of workflowIds) {
      await useTProjectsStore.getState().addWorkflowToProject(project.id, workflowId);
    }
    
    return project;
  },
  
  // Bulk operations
  deleteNodeAndForm: async (nodeId: string) => {
    const { deleteNode } = useEnhancedNodesStore.getState();
    const { configurations } = useFormStore.getState();
    const { deleteFormConfiguration } = useFormStore.getState();
    
    // Find and delete associated form configuration
    const formConfig = configurations.find((config) => config.nodeId === nodeId);
    if (formConfig) {
      await deleteFormConfiguration(formConfig.id);
    }
    
    // Delete the node
    await deleteNode(nodeId);
  },
  
  deleteWorkflowAndNodes: async (workflowId: string) => {
    const { workflows } = useTWorkflowStore.getState();
    const { deleteWorkflow } = useTWorkflowStore.getState();
    const { deleteNode } = useEnhancedNodesStore.getState();
    
    const workflow = workflows.find((w) => w.id === workflowId);
    if (workflow) {
      // Delete all nodes in the workflow
      for (const node of workflow.nodes) {
        await deleteNode(node.id);
      }
      
      // Delete the workflow
      await deleteWorkflow(workflowId);
    }
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