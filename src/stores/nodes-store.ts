import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Node, NodesState } from './types';

interface NodesActions {
  // CRUD operations
  createNode: (nodeData: Omit<Node, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Node>;
  updateNode: (id: string, nodeData: Partial<Node>) => Promise<Node>;
  deleteNode: (id: string) => Promise<void>;
  getNode: (id: string) => Promise<Node | null>;
  
  // Bulk operations
  loadNodes: () => Promise<void>;
  createMultipleNodes: (nodes: Omit<Node, 'id' | 'createdAt' | 'updatedAt'>[]) => Promise<Node[]>;
  deleteMultipleNodes: (ids: string[]) => Promise<void>;
  
  // Selection and filtering
  selectNode: (node: Node | null) => void;
  setFilters: (filters: Partial<NodesState['filters']>) => void;
  clearFilters: () => void;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type NodesStore = NodesState & NodesActions;

const initialState: NodesState = {
  nodes: [],
  selectedNode: null,
  isLoading: false,
  error: null,
  filters: {
    type: undefined,
    category: undefined,
    search: undefined,
  },
};

export const useNodesStore = create<NodesStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // CRUD operations
      createNode: async (nodeData: Omit<Node, 'id' | 'createdAt' | 'updatedAt'>) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await nodesApi.createNode(nodeData);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newNode: Node = {
            ...nodeData,
            id: `node-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({
            nodes: [...state.nodes, newNode],
            isLoading: false,
            error: null,
          }));

          return newNode;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to create node',
          });
          throw error;
        }
      },

      updateNode: async (id: string, nodeData: Partial<Node>) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await nodesApi.updateNode(id, nodeData);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const updatedNode: Node = {
            ...nodeData,
            id,
            updatedAt: new Date(),
          } as Node;

          set((state) => ({
            nodes: state.nodes.map((node) =>
              node.id === id ? { ...node, ...updatedNode } : node
            ),
            selectedNode: state.selectedNode?.id === id ? updatedNode : state.selectedNode,
            isLoading: false,
            error: null,
          }));

          return updatedNode;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update node',
          });
          throw error;
        }
      },

      deleteNode: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await nodesApi.deleteNode(id);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set((state) => ({
            nodes: state.nodes.filter((node) => node.id !== id),
            selectedNode: state.selectedNode?.id === id ? null : state.selectedNode,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to delete node',
          });
          throw error;
        }
      },

      getNode: async (id: string) => {
        const { nodes } = get();
        const node = nodes.find((n) => n.id === id);
        
        if (node) {
          return node;
        }

        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await nodesApi.getNode(id);
          
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
            error: error instanceof Error ? error.message : 'Failed to fetch node',
          });
          return null;
        }
      },

      // Bulk operations
      loadNodes: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await nodesApi.getNodes();
          
          // Simulate API call with mock data
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Import mock data from dummy folder
          const { mockNodesStore } = await import('@/dummy');
          const mockNodes = mockNodesStore;

          set({
            nodes: mockNodes,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load nodes',
          });
        }
      },

      createMultipleNodes: async (nodes: Omit<Node, 'id' | 'createdAt' | 'updatedAt'>[]) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // const response = await nodesApi.createMultipleNodes(nodes);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const newNodes: Node[] = nodes.map((nodeData) => ({
            ...nodeData,
            id: `node-${Date.now()}-${Math.random()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          }));

          set((state) => ({
            nodes: [...state.nodes, ...newNodes],
            isLoading: false,
            error: null,
          }));

          return newNodes;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to create nodes',
          });
          throw error;
        }
      },

      deleteMultipleNodes: async (ids: string[]) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Replace with actual API call
          // await nodesApi.deleteMultipleNodes(ids);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((state) => ({
            nodes: state.nodes.filter((node) => !ids.includes(node.id)),
            selectedNode: state.selectedNode && ids.includes(state.selectedNode.id) 
              ? null 
              : state.selectedNode,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to delete nodes',
          });
          throw error;
        }
      },

      // Selection and filtering
      selectNode: (node: Node | null) => {
        set({ selectedNode: node });
      },

      setFilters: (filters: Partial<NodesState['filters']>) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      clearFilters: () => {
        set({
          filters: {
            type: undefined,
            category: undefined,
            search: undefined,
          },
        });
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
      name: 'nodes-store',
    }
  )
);
