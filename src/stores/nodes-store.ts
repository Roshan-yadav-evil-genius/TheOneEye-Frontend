import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TNode, TNodesState, TNodeCreateData, TNodeUpdateData, TNodeFilters, TApiError } from '@/types';
import { getNodesApi } from '@/lib/api/config';
import { toastSuccess, toastError, toastWarning, toastInfo } from '@/hooks/use-toast';

interface NodesActions {
  // CRUD operations
  createNode: (nodeData: TNodeCreateData, showToast?: boolean) => Promise<TNode>;
  updateNode: (id: string, nodeData: TTNodeUpdateData, showToast?: boolean) => Promise<TNode>;
  deleteNode: (id: string, showToast?: boolean) => Promise<void>;
  getNode: (id: string) => Promise<TNode | null>;
  
  // Bulk operations
  loadNodes: (filters?: TTNodeFilters, showToast?: boolean) => Promise<void>;
  createMultipleNodes: (nodes: TNodeCreateData[], showToast?: boolean) => Promise<TNode[]>;
  deleteMultipleNodes: (ids: string[], showToast?: boolean) => Promise<void>;
  
  // Selection and filtering
  selectNode: (node: TNode | null) => void;
  setFilters: (filters: Partial<TNodesState['filters']>) => void;
  clearFilters: () => void;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type NodesStore = TNodesState & NodesActions;

const initialState: TNodesState = {
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
      createNode: async (nodeData: TNodeCreateData, showToast = true) => {
        set({ isLoading: true, error: null });
        
        try {
          const newNode = await getNodesApi().createNode(nodeData);

          set((state) => ({
            nodes: [...state.nodes, newNode],
            isLoading: false,
            error: null,
          }));

          if (showToast) {
            toastSuccess('Node created successfully!', {
              description: `"${newNode.name}" has been created.`,
            });
          }

          return newNode;
        } catch (error) {
          const errorMessage = error instanceof ApiError 
            ? error.message 
            : error instanceof Error 
            ? error.message 
            : 'Failed to create node';
          
          set({
            isLoading: false,
            error: errorMessage,
          });

          if (showToast) {
            toastError('Failed to create node', {
              description: errorMessage,
            });
          }
          
          throw error;
        }
      },

      updateNode: async (id: string, nodeData: TNodeUpdateData, showToast = true) => {
        set({ isLoading: true, error: null });
        
        try {
          const updatedNode = await getNodesApi().updateNode(id, nodeData);

          set((state) => ({
            nodes: state.nodes.map((node) =>
              node.id === id ? updatedNode : node
            ),
            selectedNode: state.selectedNode?.id === id ? updatedNode : state.selectedNode,
            isLoading: false,
            error: null,
          }));

          if (showToast) {
            toastSuccess('Node updated successfully!', {
              description: `"${updatedNode.name}" has been updated.`,
            });
          }

          return updatedNode;
        } catch (error) {
          const errorMessage = error instanceof ApiError 
            ? error.message 
            : error instanceof Error 
            ? error.message 
            : 'Failed to update node';
          
          set({
            isLoading: false,
            error: errorMessage,
          });

          if (showToast) {
            toastError('Failed to update node', {
              description: errorMessage,
            });
          }
          
          throw error;
        }
      },

      deleteNode: async (id: string, showToast = true) => {
        set({ isLoading: true, error: null });
        
        try {
          // Get node name before deletion for toast message
          const nodeToDelete = get().nodes.find(node => node.id === id);
          const nodeName = nodeToDelete?.name || 'Node';
          
          await getNodesApi().deleteNode(id);
          
          set((state) => ({
            nodes: state.nodes.filter((node) => node.id !== id),
            selectedNode: state.selectedNode?.id === id ? null : state.selectedNode,
            isLoading: false,
            error: null,
          }));

          if (showToast) {
            toastSuccess('Node deleted successfully!', {
              description: `"${nodeName}" has been deleted.`,
            });
          }
        } catch (error) {
          const errorMessage = error instanceof ApiError 
            ? error.message 
            : error instanceof Error 
            ? error.message 
            : 'Failed to delete node';
          
          set({
            isLoading: false,
            error: errorMessage,
          });

          if (showToast) {
            toastError('Failed to delete node', {
              description: errorMessage,
            });
          }
          
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
          const fetchedNode = await getNodesApi().getNode(id);
          
          set({
            isLoading: false,
            error: null,
          });
          
          return fetchedNode;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch node',
          });
          return null;
        }
      },

      // Bulk operations
      loadNodes: async (filters: TNodeFilters = {}, showToast = false) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await getNodesApi().getNodes(filters);

          set({
            nodes: response.results,
            isLoading: false,
            error: null,
          });

          if (showToast && response.results.length > 0) {
            toastInfo(`Loaded ${response.results.length} nodes`, {
              description: `Found ${response.count} total nodes.`,
            });
          }
        } catch (error) {
          const errorMessage = error instanceof ApiError 
            ? error.message 
            : error instanceof Error 
            ? error.message 
            : 'Failed to load nodes';
          
          set({
            isLoading: false,
            error: errorMessage,
          });

          if (showToast) {
            toastError('Failed to load nodes', {
              description: errorMessage,
            });
          }
        }
      },

      createMultipleNodes: async (nodes: TNodeCreateData[], showToast = true) => {
        set({ isLoading: true, error: null });
        
        try {
          const newNodes = await getNodesApi().bulkCreateNodes(nodes);

          set((state) => ({
            nodes: [...state.nodes, ...newNodes],
            isLoading: false,
            error: null,
          }));

          if (showToast) {
            toastSuccess(`${newNodes.length} nodes created successfully!`, {
              description: `Created ${newNodes.length} new nodes.`,
            });
          }

          return newNodes;
        } catch (error) {
          const errorMessage = error instanceof ApiError 
            ? error.message 
            : error instanceof Error 
            ? error.message 
            : 'Failed to create nodes';
          
          set({
            isLoading: false,
            error: errorMessage,
          });

          if (showToast) {
            toastError('Failed to create nodes', {
              description: errorMessage,
            });
          }
          
          throw error;
        }
      },

      deleteMultipleNodes: async (ids: string[], showToast = true) => {
        set({ isLoading: true, error: null });
        
        try {
          await getNodesApi().bulkDeleteNodes(ids);
          
          set((state) => ({
            nodes: state.nodes.filter((node) => !ids.includes(node.id)),
            selectedNode: state.selectedNode && ids.includes(state.selectedNode.id) 
              ? null 
              : state.selectedNode,
            isLoading: false,
            error: null,
          }));

          if (showToast) {
            toastSuccess(`${ids.length} nodes deleted successfully!`, {
              description: `Deleted ${ids.length} nodes.`,
            });
          }
        } catch (error) {
          const errorMessage = error instanceof ApiError 
            ? error.message 
            : error instanceof Error 
            ? error.message 
            : 'Failed to delete nodes';
          
          set({
            isLoading: false,
            error: errorMessage,
          });

          if (showToast) {
            toastError('Failed to delete nodes', {
              description: errorMessage,
            });
          }
          
          throw error;
        }
      },

      // Selection and filtering
      selectNode: (node: TNode | null) => {
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
