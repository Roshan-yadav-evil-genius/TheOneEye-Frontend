import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TWorkflow, TWorkflowState, TWorkflowConnection, TNode } from './types';
import { ApiService } from '@/lib/api/api-service';

interface TWorkflowActions {
  // CRUD operations
  createTWorkflow: (workflowData: Omit<TWorkflow, 'id' | 'createdAt' | 'updatedAt'>) => Promise<TWorkflow>;
  updateTWorkflow: (id: string, workflowData: Partial<TWorkflow>) => Promise<TWorkflow>;
  deleteTWorkflow: (id: string) => Promise<void>;
  getTWorkflow: (id: string) => Promise<TWorkflow | null>;
  
  // Bulk operations
  loadTWorkflows: () => Promise<void>;
  
  // TWorkflow management
  setActiveTWorkflow: (workflow: TWorkflow | null) => void;
  addNodeToTWorkflow: (workflowId: string, node: TNode) => Promise<void>;
  removeNodeFromTWorkflow: (workflowId: string, nodeId: string) => Promise<void>;
  updateTWorkflowNodes: (workflowId: string, nodes: TNode[]) => Promise<void>;
  
  // Connection management
  addConnection: (workflowId: string, connection: TTWorkflowConnection) => Promise<void>;
  removeConnection: (workflowId: string, connectionId: string) => Promise<void>;
  updateConnections: (workflowId: string, connections: TTWorkflowConnection[]) => Promise<void>;
  
  // Selection management
  selectNodes: (nodeIds: string[]) => void;
  selectConnections: (connectionIds: string[]) => void;
  clearSelection: () => void;
  
  // TWorkflow execution
  startTWorkflow: (workflowId: string) => Promise<void>;
  pauseTWorkflow: (workflowId: string) => Promise<void>;
  stopTWorkflow: (workflowId: string) => Promise<void>;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type TWorkflowStore = TTWorkflowState & TWorkflowActions;

const initialState: TTWorkflowState = {
  workflows: [],
  activeTWorkflow: null,
  isLoading: false,
  error: null,
  selectedNodes: [],
  selectedConnections: [],
};

export const useTWorkflowStore = create<TWorkflowStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // CRUD operations
      createTWorkflow: async (workflowData: Omit<TWorkflow, 'id' | 'createdAt' | 'updatedAt'>) => {
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

          const response = await ApiService.createWorkflow(backendData);
          
          // Transform backend response to frontend format
          const newTWorkflow: TWorkflow = {
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
            workflows: [...state.workflows, newTWorkflow],
            isLoading: false,
            error: null,
          }));

          return newTWorkflow;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to create workflow',
          });
          throw error;
        }
      },

      updateTWorkflow: async (id: string, workflowData: Partial<TWorkflow>) => {
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

          const response = await ApiService.updateWorkflow(id, backendData);
          
          // Transform backend response to frontend format
          const updatedTWorkflow: TWorkflow = {
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
              workflow.id === id ? updatedTWorkflow : workflow
            ),
            activeTWorkflow: state.activeTWorkflow?.id === id ? updatedTWorkflow : state.activeTWorkflow,
            isLoading: false,
            error: null,
          }));

          return updatedTWorkflow;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update workflow',
          });
          throw error;
        }
      },

      deleteTWorkflow: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          await ApiService.deleteWorkflow(id);
          
          set((state) => ({
            workflows: state.workflows.filter((workflow) => workflow.id !== id),
            activeTWorkflow: state.activeTWorkflow?.id === id ? null : state.activeTWorkflow,
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

      getTWorkflow: async (id: string) => {
        const { workflows } = get();
        const workflow = workflows.find((w) => w.id === id);
        
        if (workflow) {
          return workflow;
        }

        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await workflowApi.getTWorkflow(id);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // For now, return null if not found in local state
          set({
            isLoading: false,
            error: null,
          });
          
          return null;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch workflow',
          });
          return null;
        }
      },

      // Bulk operations
      loadTWorkflows: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await ApiService.getWorkflows();
          
          // Transform backend response to frontend format
          const workflows: TWorkflow[] = response.map((workflow: any) => ({
            id: workflow.id,
            name: workflow.name,
            description: workflow.description,
            category: workflow.category,
            nodes: [],
            connections: [],
            status: workflow.status,
            lastRun: workflow.last_run,
            nextRun: workflow.next_run,
            runsCount: workflow.runs_count,
            successRate: workflow.success_rate,
            tags: workflow.tags || [],
            createdAt: new Date(workflow.created_at),
            updatedAt: new Date(workflow.updated_at),
            createdBy: workflow.created_by,
          }));

          set({
            workflows,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load workflows',
          });
        }
      },

      // TWorkflow management
      setActiveTWorkflow: (workflow: TWorkflow | null) => {
        set({ activeTWorkflow: workflow });
      },

      addNodeToTWorkflow: async (workflowId: string, node: TNode) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await workflowApi.addNodeToTWorkflow(workflowId, node);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            workflows: state.workflows.map((workflow) =>
              workflow.id === workflowId
                ? { ...workflow, nodes: [...workflow.nodes, node], updatedAt: new Date() }
                : workflow
            ),
            activeTWorkflow: state.activeTWorkflow?.id === workflowId
              ? { ...state.activeTWorkflow, nodes: [...state.activeTWorkflow.nodes, node], updatedAt: new Date() }
              : state.activeTWorkflow,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to add node to workflow',
          });
          throw error;
        }
      },

      removeNodeFromTWorkflow: async (workflowId: string, nodeId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await workflowApi.removeNodeFromTWorkflow(workflowId, nodeId);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            workflows: state.workflows.map((workflow) =>
              workflow.id === workflowId
                ? { 
                    ...workflow, 
                    nodes: workflow.nodes.filter((node) => node.id !== nodeId),
                    connections: workflow.connections.filter(
                      (conn) => conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId
                    ),
                    updatedAt: new Date()
                  }
                : workflow
            ),
            activeTWorkflow: state.activeTWorkflow?.id === workflowId
              ? { 
                  ...state.activeTWorkflow, 
                  nodes: state.activeTWorkflow.nodes.filter((node) => node.id !== nodeId),
                  connections: state.activeTWorkflow.connections.filter(
                    (conn) => conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId
                  ),
                  updatedAt: new Date()
                }
              : state.activeTWorkflow,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to remove node from workflow',
          });
          throw error;
        }
      },

      updateTWorkflowNodes: async (workflowId: string, nodes: TNode[]) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await workflowApi.updateTWorkflowNodes(workflowId, nodes);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            workflows: state.workflows.map((workflow) =>
              workflow.id === workflowId
                ? { ...workflow, nodes, updatedAt: new Date() }
                : workflow
            ),
            activeTWorkflow: state.activeTWorkflow?.id === workflowId
              ? { ...state.activeTWorkflow, nodes, updatedAt: new Date() }
              : state.activeTWorkflow,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update workflow nodes',
          });
          throw error;
        }
      },

      // Connection management
      addConnection: async (workflowId: string, connection: TTWorkflowConnection) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await workflowApi.addConnection(workflowId, connection);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            workflows: state.workflows.map((workflow) =>
              workflow.id === workflowId
                ? { ...workflow, connections: [...workflow.connections, connection], updatedAt: new Date() }
                : workflow
            ),
            activeTWorkflow: state.activeTWorkflow?.id === workflowId
              ? { ...state.activeTWorkflow, connections: [...state.activeTWorkflow.connections, connection], updatedAt: new Date() }
              : state.activeTWorkflow,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to add connection',
          });
          throw error;
        }
      },

      removeConnection: async (workflowId: string, connectionId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await workflowApi.removeConnection(workflowId, connectionId);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            workflows: state.workflows.map((workflow) =>
              workflow.id === workflowId
                ? { 
                    ...workflow, 
                    connections: workflow.connections.filter((conn) => conn.id !== connectionId),
                    updatedAt: new Date()
                  }
                : workflow
            ),
            activeTWorkflow: state.activeTWorkflow?.id === workflowId
              ? { 
                  ...state.activeTWorkflow, 
                  connections: state.activeTWorkflow.connections.filter((conn) => conn.id !== connectionId),
                  updatedAt: new Date()
                }
              : state.activeTWorkflow,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to remove connection',
          });
          throw error;
        }
      },

      updateConnections: async (workflowId: string, connections: TTWorkflowConnection[]) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await workflowApi.updateConnections(workflowId, connections);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            workflows: state.workflows.map((workflow) =>
              workflow.id === workflowId
                ? { ...workflow, connections, updatedAt: new Date() }
                : workflow
            ),
            activeTWorkflow: state.activeTWorkflow?.id === workflowId
              ? { ...state.activeTWorkflow, connections, updatedAt: new Date() }
              : state.activeTWorkflow,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update connections',
          });
          throw error;
        }
      },

      // Selection management
      selectNodes: (nodeIds: string[]) => {
        set({ selectedNodes: nodeIds });
      },

      selectConnections: (connectionIds: string[]) => {
        set({ selectedConnections: connectionIds });
      },

      clearSelection: () => {
        set({ selectedNodes: [], selectedConnections: [] });
      },

      // TWorkflow execution
      startTWorkflow: async (workflowId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await workflowApi.startTWorkflow(workflowId);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((state) => ({
            workflows: state.workflows.map((workflow) =>
              workflow.id === workflowId
                ? { ...workflow, status: 'active', updatedAt: new Date() }
                : workflow
            ),
            activeTWorkflow: state.activeTWorkflow?.id === workflowId
              ? { ...state.activeTWorkflow, status: 'active', updatedAt: new Date() }
              : state.activeTWorkflow,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to start workflow',
          });
          throw error;
        }
      },

      pauseTWorkflow: async (workflowId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await workflowApi.pauseTWorkflow(workflowId);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            workflows: state.workflows.map((workflow) =>
              workflow.id === workflowId
                ? { ...workflow, status: 'paused', updatedAt: new Date() }
                : workflow
            ),
            activeTWorkflow: state.activeTWorkflow?.id === workflowId
              ? { ...state.activeTWorkflow, status: 'paused', updatedAt: new Date() }
              : state.activeTWorkflow,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to pause workflow',
          });
          throw error;
        }
      },

      stopTWorkflow: async (workflowId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await workflowApi.stopTWorkflow(workflowId);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            workflows: state.workflows.map((workflow) =>
              workflow.id === workflowId
                ? { ...workflow, status: 'archived', updatedAt: new Date() }
                : workflow
            ),
            activeTWorkflow: state.activeTWorkflow?.id === workflowId
              ? { ...state.activeTWorkflow, status: 'archived', updatedAt: new Date() }
              : state.activeTWorkflow,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to stop workflow',
          });
          throw error;
        }
      },

      // Utility actions
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'workflow-store',
    }
  )
);
