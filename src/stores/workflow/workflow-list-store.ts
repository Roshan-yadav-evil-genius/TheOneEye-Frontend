/**
 * Workflow List Store
 * 
 * Single responsibility: Managing the list of workflows and CRUD operations.
 * Does NOT handle canvas state, selection, or execution.
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { workflowApi } from '@/lib/api/services/workflow-api';
import { TWorkflow } from '../types';

interface WorkflowListState {
  // Data
  workflows: TWorkflow[];
  activeWorkflow: TWorkflow | null;
  
  // Loading and Error States
  isLoading: boolean;
  error: string | null;
}

interface WorkflowListActions {
  // CRUD operations
  loadWorkflows: () => Promise<void>;
  createWorkflow: (workflowData: Omit<TWorkflow, 'id' | 'createdAt' | 'updatedAt'>) => Promise<TWorkflow>;
  updateWorkflow: (id: string, workflowData: Partial<TWorkflow>) => Promise<TWorkflow>;
  deleteWorkflow: (id: string) => Promise<void>;
  getWorkflow: (id: string) => Promise<TWorkflow | null>;
  
  // Active workflow management
  setActiveWorkflow: (workflow: TWorkflow | null) => void;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

type WorkflowListStore = WorkflowListState & WorkflowListActions;

const initialState: WorkflowListState = {
  workflows: [],
  activeWorkflow: null,
  isLoading: false,
  error: null,
};

export const useWorkflowListStore = create<WorkflowListStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // CRUD operations
      loadWorkflows: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { logger } = await import('@/lib/logging');
          logger.debug('Loading workflows from API', undefined, 'workflow-list-store');
          
          const response = await workflowApi.getWorkflows();
          
          logger.debug(`Received ${response.length} workflows from API`, { count: response.length }, 'workflow-list-store');
          
          // Transform backend response to frontend format
          const workflows: TWorkflow[] = response.map((workflow: Record<string, unknown>) => ({
            id: workflow.id as string,
            name: workflow.name as string,
            description: workflow.description as string,
            category: workflow.category as string,
            nodes: [],
            connections: [],
            status: workflow.status as string,
            lastRun: workflow.last_run as string | undefined,
            nextRun: workflow.next_run as string | undefined,
            runsCount: workflow.runs_count as number,
            successRate: workflow.success_rate as number,
            tags: (workflow.tags as string[]) || [],
            createdAt: new Date(workflow.created_at as string),
            updatedAt: new Date(workflow.updated_at as string),
            createdBy: workflow.created_by as string,
          }));

          logger.info(`Successfully loaded ${workflows.length} workflows`, { count: workflows.length }, 'workflow-list-store');

          set({
            workflows,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const { logger } = await import('@/lib/logging');
          logger.error('Failed to load workflows', error, 'workflow-list-store');
          
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load workflows',
          });
        }
      },

      createWorkflow: async (workflowData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Transform frontend data to backend format
          const backendData = {
            name: workflowData.name,
            description: workflowData.description,
            category: workflowData.category,
            status: workflowData.status,
            runs_count: workflowData.runsCount,
            success_rate: workflowData.successRate,
            tags: workflowData.tags,
            created_by: workflowData.createdBy,
          };

          const response = await workflowApi.createWorkflow(backendData);
          
          // Transform backend response to frontend format
          const newWorkflow: TWorkflow = {
            id: response.id,
            name: response.name,
            description: response.description,
            category: response.category,
            nodes: [],
            connections: [],
            status: response.status,
            lastRun: response.last_run,
            nextRun: response.next_run,
            runsCount: response.runs_count,
            successRate: response.success_rate,
            tags: response.tags || [],
            createdAt: new Date(response.created_at),
            updatedAt: new Date(response.updated_at),
            createdBy: response.created_by,
          };

          set((state) => ({
            workflows: [...state.workflows, newWorkflow],
            isLoading: false,
            error: null,
          }));

          return newWorkflow;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to create workflow',
          });
          throw error;
        }
      },

      updateWorkflow: async (id, workflowData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Transform frontend data to backend format
          const backendData = {
            name: workflowData.name,
            description: workflowData.description,
            category: workflowData.category,
            status: workflowData.status,
            runs_count: workflowData.runsCount,
            success_rate: workflowData.successRate,
            tags: workflowData.tags,
            created_by: workflowData.createdBy,
          };

          const response = await workflowApi.updateWorkflow(id, backendData);
          
          // Transform backend response to frontend format
          const updatedWorkflow: TWorkflow = {
            id: response.id,
            name: response.name,
            description: response.description,
            category: response.category,
            nodes: workflowData.nodes || [],
            connections: workflowData.connections || [],
            status: response.status,
            lastRun: response.last_run,
            nextRun: response.next_run,
            runsCount: response.runs_count,
            successRate: response.success_rate,
            tags: response.tags || [],
            createdAt: new Date(response.created_at),
            updatedAt: new Date(response.updated_at),
            createdBy: response.created_by,
          };

          set((state) => ({
            workflows: state.workflows.map((workflow) =>
              workflow.id === id ? updatedWorkflow : workflow
            ),
            activeWorkflow: state.activeWorkflow?.id === id ? updatedWorkflow : state.activeWorkflow,
            isLoading: false,
            error: null,
          }));

          return updatedWorkflow;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update workflow',
          });
          throw error;
        }
      },

      deleteWorkflow: async (id) => {
        set({ isLoading: true, error: null });
        
        try {
          await workflowApi.deleteWorkflow(id);
          
          set((state) => ({
            workflows: state.workflows.filter((workflow) => workflow.id !== id),
            activeWorkflow: state.activeWorkflow?.id === id ? null : state.activeWorkflow,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to delete workflow',
          });
          throw error;
        }
      },

      getWorkflow: async (id) => {
        const { workflows } = get();
        const workflow = workflows.find((w) => w.id === id);
        
        if (workflow) {
          return workflow;
        }

        // If not found locally, we could fetch from API
        // For now, return null if not in local state
        return null;
      },

      // Active workflow management
      setActiveWorkflow: (workflow) => {
        set({ activeWorkflow: workflow });
      },

      // Utility actions
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'workflow-list-store',
    }
  )
);

// Selectors
export const workflowListSelectors = {
  getWorkflowById: (state: WorkflowListStore, id: string) => {
    return state.workflows.find(workflow => workflow.id === id);
  },
  
  getWorkflowsByStatus: (state: WorkflowListStore, status: string) => {
    return state.workflows.filter(workflow => workflow.status === status);
  },
  
  getWorkflowsByCategory: (state: WorkflowListStore, category: string) => {
    return state.workflows.filter(workflow => workflow.category === category);
  },
};

