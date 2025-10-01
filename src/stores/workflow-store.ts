import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Workflow, WorkflowState, WorkflowConnection, Node } from './types';

interface WorkflowActions {
  // CRUD operations
  createWorkflow: (workflowData: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Workflow>;
  updateWorkflow: (id: string, workflowData: Partial<Workflow>) => Promise<Workflow>;
  deleteWorkflow: (id: string) => Promise<void>;
  getWorkflow: (id: string) => Promise<Workflow | null>;
  
  // Bulk operations
  loadWorkflows: () => Promise<void>;
  
  // Workflow management
  setActiveWorkflow: (workflow: Workflow | null) => void;
  addNodeToWorkflow: (workflowId: string, node: Node) => Promise<void>;
  removeNodeFromWorkflow: (workflowId: string, nodeId: string) => Promise<void>;
  updateWorkflowNodes: (workflowId: string, nodes: Node[]) => Promise<void>;
  
  // Connection management
  addConnection: (workflowId: string, connection: WorkflowConnection) => Promise<void>;
  removeConnection: (workflowId: string, connectionId: string) => Promise<void>;
  updateConnections: (workflowId: string, connections: WorkflowConnection[]) => Promise<void>;
  
  // Selection management
  selectNodes: (nodeIds: string[]) => void;
  selectConnections: (connectionIds: string[]) => void;
  clearSelection: () => void;
  
  // Workflow execution
  startWorkflow: (workflowId: string) => Promise<void>;
  pauseWorkflow: (workflowId: string) => Promise<void>;
  stopWorkflow: (workflowId: string) => Promise<void>;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type WorkflowStore = WorkflowState & WorkflowActions;

const initialState: WorkflowState = {
  workflows: [],
  activeWorkflow: null,
  isLoading: false,
  error: null,
  selectedNodes: [],
  selectedConnections: [],
};

export const useWorkflowStore = create<WorkflowStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // CRUD operations
      createWorkflow: async (workflowData: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await workflowApi.createWorkflow(workflowData);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newWorkflow: Workflow = {
            ...workflowData,
            id: `workflow-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
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

      updateWorkflow: async (id: string, workflowData: Partial<Workflow>) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await workflowApi.updateWorkflow(id, workflowData);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedWorkflow: Workflow = {
            ...workflowData,
            id,
            updatedAt: new Date(),
          } as Workflow;

          set((state) => ({
            workflows: state.workflows.map((workflow) =>
              workflow.id === id ? { ...workflow, ...updatedWorkflow } : workflow
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

      deleteWorkflow: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await workflowApi.deleteWorkflow(id);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
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

      getWorkflow: async (id: string) => {
        const { workflows } = get();
        const workflow = workflows.find((w) => w.id === id);
        
        if (workflow) {
          return workflow;
        }

        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await workflowApi.getWorkflow(id);
          
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
      loadWorkflows: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await workflowApi.getWorkflows();
          
          // Simulate API call with mock data
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockWorkflows: Workflow[] = [
            {
              id: 'workflow-1',
              name: 'Email Marketing Campaign',
              description: 'Automated email marketing workflow',
              nodes: [],
              connections: [],
              status: 'draft',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
              createdBy: 'user-1',
            },
            {
              id: 'workflow-2',
              name: 'Data Processing Pipeline',
              description: 'Process and analyze incoming data',
              nodes: [],
              connections: [],
              status: 'active',
              createdAt: new Date('2024-01-02'),
              updatedAt: new Date('2024-01-02'),
              createdBy: 'user-1',
            },
          ];

          set({
            workflows: mockWorkflows,
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

      // Workflow management
      setActiveWorkflow: (workflow: Workflow | null) => {
        set({ activeWorkflow: workflow });
      },

      addNodeToWorkflow: async (workflowId: string, node: Node) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await workflowApi.addNodeToWorkflow(workflowId, node);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            workflows: state.workflows.map((workflow) =>
              workflow.id === workflowId
                ? { ...workflow, nodes: [...workflow.nodes, node], updatedAt: new Date() }
                : workflow
            ),
            activeWorkflow: state.activeWorkflow?.id === workflowId
              ? { ...state.activeWorkflow, nodes: [...state.activeWorkflow.nodes, node], updatedAt: new Date() }
              : state.activeWorkflow,
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

      removeNodeFromWorkflow: async (workflowId: string, nodeId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await workflowApi.removeNodeFromWorkflow(workflowId, nodeId);
          
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
            activeWorkflow: state.activeWorkflow?.id === workflowId
              ? { 
                  ...state.activeWorkflow, 
                  nodes: state.activeWorkflow.nodes.filter((node) => node.id !== nodeId),
                  connections: state.activeWorkflow.connections.filter(
                    (conn) => conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId
                  ),
                  updatedAt: new Date()
                }
              : state.activeWorkflow,
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

      updateWorkflowNodes: async (workflowId: string, nodes: Node[]) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await workflowApi.updateWorkflowNodes(workflowId, nodes);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            workflows: state.workflows.map((workflow) =>
              workflow.id === workflowId
                ? { ...workflow, nodes, updatedAt: new Date() }
                : workflow
            ),
            activeWorkflow: state.activeWorkflow?.id === workflowId
              ? { ...state.activeWorkflow, nodes, updatedAt: new Date() }
              : state.activeWorkflow,
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
      addConnection: async (workflowId: string, connection: WorkflowConnection) => {
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
            activeWorkflow: state.activeWorkflow?.id === workflowId
              ? { ...state.activeWorkflow, connections: [...state.activeWorkflow.connections, connection], updatedAt: new Date() }
              : state.activeWorkflow,
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
            activeWorkflow: state.activeWorkflow?.id === workflowId
              ? { 
                  ...state.activeWorkflow, 
                  connections: state.activeWorkflow.connections.filter((conn) => conn.id !== connectionId),
                  updatedAt: new Date()
                }
              : state.activeWorkflow,
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

      updateConnections: async (workflowId: string, connections: WorkflowConnection[]) => {
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
            activeWorkflow: state.activeWorkflow?.id === workflowId
              ? { ...state.activeWorkflow, connections, updatedAt: new Date() }
              : state.activeWorkflow,
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

      // Workflow execution
      startWorkflow: async (workflowId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await workflowApi.startWorkflow(workflowId);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((state) => ({
            workflows: state.workflows.map((workflow) =>
              workflow.id === workflowId
                ? { ...workflow, status: 'active', updatedAt: new Date() }
                : workflow
            ),
            activeWorkflow: state.activeWorkflow?.id === workflowId
              ? { ...state.activeWorkflow, status: 'active', updatedAt: new Date() }
              : state.activeWorkflow,
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

      pauseWorkflow: async (workflowId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await workflowApi.pauseWorkflow(workflowId);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            workflows: state.workflows.map((workflow) =>
              workflow.id === workflowId
                ? { ...workflow, status: 'paused', updatedAt: new Date() }
                : workflow
            ),
            activeWorkflow: state.activeWorkflow?.id === workflowId
              ? { ...state.activeWorkflow, status: 'paused', updatedAt: new Date() }
              : state.activeWorkflow,
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

      stopWorkflow: async (workflowId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await workflowApi.stopWorkflow(workflowId);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            workflows: state.workflows.map((workflow) =>
              workflow.id === workflowId
                ? { ...workflow, status: 'archived', updatedAt: new Date() }
                : workflow
            ),
            activeWorkflow: state.activeWorkflow?.id === workflowId
              ? { ...state.activeWorkflow, status: 'archived', updatedAt: new Date() }
              : state.activeWorkflow,
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
