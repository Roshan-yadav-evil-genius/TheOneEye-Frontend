import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { TNodesState, TNodeCreateData, TNodeUpdateData, TNodeFilters, TApiError } from '@/types';
import { BackendNodeType } from '@/types/api/backend';
import { ApiService } from '@/lib/api/api-service';
import { toastSuccess, toastError, toastWarning, toastInfo } from '@/hooks/use-toast';

// Enhanced state interface with additional features
interface EnhancedNodesState extends TNodesState {
  // Explicitly include base properties to ensure they're available
  nodes: BackendNodeType[];
  selectedNode: BackendNodeType | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    type?: string;
    nodeGroup?: string;
    search?: string;
  };
  // Pagination state
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  
  
  // Selection state
  selectedNodes: string[]; // Array of selected node IDs
  isMultiSelectMode: boolean;
  
  // Search and filtering
  searchQuery: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  
  // Statistics
  stats: {
    total: number;
    active: number;
    inactive: number;
    byType: Record<string, number>;
    byNodeGroup: Record<string, number>;
    lastUpdated: number;
  } | null;
}

interface EnhancedNodesActions {
  // CRUD operations with enhanced error handling
  createNode: (nodeData: TNodeCreateData, options?: { showToast?: boolean; optimistic?: boolean }) => Promise<TNode>;
  updateNode: (id: string, nodeData: TNodeUpdateData, options?: { showToast?: boolean; optimistic?: boolean }) => Promise<TNode>;
  deleteNode: (id: string, options?: { showToast?: boolean; optimistic?: boolean }) => Promise<void>;
  getNode: (id: string, options?: { forceRefresh?: boolean }) => Promise<TNode | null>;
  
  // Bulk operations
  loadNodes: (filters?: TNodeFilters, options?: { showToast?: boolean; forceRefresh?: boolean }) => Promise<void>;
  createMultipleNodes: (nodes: TNodeCreateData[], options?: { showToast?: boolean; optimistic?: boolean }) => Promise<TNode[]>;
  deleteMultipleNodes: (ids: string[], options?: { showToast?: boolean; optimistic?: boolean }) => Promise<void>;
  
  // Selection and filtering
  selectNode: (node: TNode | null) => void;
  selectNodes: (nodeIds: string[]) => void;
  toggleNodeSelection: (nodeId: string) => void;
  clearSelection: () => void;
  setMultiSelectMode: (enabled: boolean) => void;
  
  setFilters: (filters: Partial<TNodesState['filters']>) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  
  // Pagination
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  
  
  // Statistics
  loadStats: (forceRefresh?: boolean) => Promise<void>;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

type EnhancedNodesStore = EnhancedNodesState & EnhancedNodesActions;

const initialState: EnhancedNodesState = {
  nodes: [],
  selectedNode: null,
  isLoading: false,
  error: null,
  filters: {
    type: undefined,
    nodeGroup: undefined,
    search: undefined,
  },
  pagination: {
    currentPage: 1,
    pageSize: 20,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
  selectedNodes: [],
  isMultiSelectMode: false,
  searchQuery: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  stats: null,
};


export const useEnhancedNodesStore = create<EnhancedNodesStore>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,

        // CRUD operations with enhanced error handling
        createNode: async (nodeData: TNodeCreateData, options = {}) => {
          const { showToast = true, optimistic = false } = options;
          
          if (optimistic) {
            // Optimistic update - add temporary node
            const tempNode: TNode = {
              id: `temp-${Date.now()}`,
              ...nodeData,
              is_active: nodeData.is_active ?? true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: 'Current User', // TODO: Get from user store
            };
            
            set((state) => {
              // Ensure nodes array exists before calling unshift
              if (!state.nodes) {
                state.nodes = [];
              }
              state.nodes.unshift(tempNode);
              state.pagination.totalCount += 1;
            });
          }
          
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });
          
          try {
            const newNode = await ApiService.createNode(nodeData);
            
            set((state) => {
              if (optimistic) {
                // Replace temporary node with real one
                const tempIndex = state.nodes?.findIndex(n => n.id.startsWith('temp-')) ?? -1;
                if (tempIndex !== -1) {
                  state.nodes[tempIndex] = newNode;
                }
              } else {
                // Ensure nodes array exists before calling unshift
                if (!state.nodes) {
                  state.nodes = [];
                }
                state.nodes.unshift(newNode);
                state.pagination.totalCount += 1;
              }
              state.isLoading = false;
              state.error = null;
            });

            if (showToast) {
              toastSuccess('Node created successfully!', {
                description: `"${newNode.name}" has been created.`,
              });
            }

            return newNode;
          } catch (error) {
            const errorMessage = error instanceof TApiError 
              ? error.message 
              : error instanceof Error 
              ? error.message 
              : 'Failed to create node';
            
            set((state) => {
              if (optimistic) {
                // Remove temporary node on error
                state.nodes = state.nodes?.filter(n => !n.id.startsWith('temp-')) ?? [];
                state.pagination.totalCount -= 1;
              }
              state.isLoading = false;
              state.error = errorMessage;
            });

            if (showToast) {
              toastError('Failed to create node', {
                description: errorMessage,
              });
            }
            
            throw error;
          }
        },

        updateNode: async (id: string, nodeData: TNodeUpdateData, options = {}) => {
          const { showToast = true, optimistic = false } = options;
          
          if (optimistic) {
            // Optimistic update
            set((state) => {
              const nodeIndex = state.nodes?.findIndex(n => n.id === id) ?? -1;
              if (nodeIndex !== -1) {
                state.nodes[nodeIndex] = { ...state.nodes[nodeIndex], ...nodeData };
              }
              if (state.selectedNode?.id === id) {
                state.selectedNode = { ...state.selectedNode, ...nodeData };
              }
            });
          }
          
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });
          
          try {
            const updatedNode = await ApiService.updateNode(id, nodeData);
            
            set((state) => {
              const nodeIndex = state.nodes?.findIndex(n => n.id === id) ?? -1;
              if (nodeIndex !== -1) {
                state.nodes[nodeIndex] = updatedNode;
              }
              if (state.selectedNode?.id === id) {
                state.selectedNode = updatedNode;
              }
              state.isLoading = false;
              state.error = null;
            });

            if (showToast) {
              toastSuccess('Node updated successfully!', {
                description: `"${updatedNode.name}" has been updated.`,
              });
            }

            return updatedNode;
          } catch (error) {
            const errorMessage = error instanceof TApiError 
              ? error.message 
              : error instanceof Error 
              ? error.message 
              : 'Failed to update node';
            
            set((state) => {
              state.isLoading = false;
              state.error = errorMessage;
            });

            if (showToast) {
              toastError('Failed to update node', {
                description: errorMessage,
              });
            }
            
            throw error;
          }
        },

        deleteNode: async (id: string, options = {}) => {
          const { showToast = true, optimistic = false } = options;
          
          const nodeToDelete = get().nodes.find(node => node.id === id);
          const nodeName = nodeToDelete?.name || 'Node';
          
          if (optimistic) {
            // Optimistic update
            set((state) => {
              state.nodes = state.nodes?.filter(n => n.id !== id) ?? [];
              state.selectedNodes = state.selectedNodes.filter(nId => nId !== id);
              if (state.selectedNode?.id === id) {
                state.selectedNode = null;
              }
              state.pagination.totalCount -= 1;
            });
          }
          
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });
          
          try {
            await ApiService.deleteNode(id);
            
            if (!optimistic) {
              set((state) => {
                state.nodes = state.nodes?.filter(n => n.id !== id) ?? [];
                state.selectedNodes = state.selectedNodes.filter(nId => nId !== id);
                if (state.selectedNode?.id === id) {
                  state.selectedNode = null;
                }
                state.pagination.totalCount -= 1;
                state.isLoading = false;
                state.error = null;
              });
            } else {
              set((state) => {
                state.isLoading = false;
                state.error = null;
              });
            }

            if (showToast) {
              toastSuccess('Node deleted successfully!', {
                description: `"${nodeName}" has been deleted.`,
              });
            }
          } catch (error) {
            const errorMessage = error instanceof TApiError 
              ? error.message 
              : error instanceof Error 
              ? error.message 
              : 'Failed to delete node';
            
            set((state) => {
              state.isLoading = false;
              state.error = errorMessage;
            });

            if (showToast) {
              toastError('Failed to delete node', {
                description: errorMessage,
              });
            }
            
            throw error;
          }
        },

        getNode: async (id: string, options = {}) => {
          const { forceRefresh = false } = options;
          const { nodes, cache } = get();
          
          // Check cache first
          if (!forceRefresh) {
            const cachedNode = nodes.find((n) => n.id === id);
            if (cachedNode && !cache.isStale) {
              return cachedNode;
            }
          }

          set((state) => {
            state.isLoading = true;
            state.error = null;
          });
          
          try {
            const fetchedNode = await ApiService.getNode(id);
            
            set((state) => {
              const nodeIndex = state.nodes?.findIndex(n => n.id === id) ?? -1;
              if (nodeIndex !== -1) {
                state.nodes[nodeIndex] = fetchedNode;
              } else {
                if (!state.nodes) {
                  state.nodes = [];
                }
                state.nodes.push(fetchedNode);
              }
              state.isLoading = false;
              state.error = null;
            });
            
            return fetchedNode;
          } catch (error) {
            set((state) => {
              state.isLoading = false;
              state.error = error instanceof Error ? error.message : 'Failed to fetch node';
            });
            return null;
          }
        },

        // Bulk operations
        loadNodes: async (filters: TNodeFilters = {}, options = {}) => {
          const { showToast = false } = options;
          const { pagination } = get();
          
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });
          
          try {
            const response = await ApiService.getNodes({
              ...filters,
              page: pagination.currentPage,
              page_size: pagination.pageSize,
            });

            set((state) => {
              state.nodes = response.results;
              state.pagination.totalCount = response.count;
              state.pagination.hasNextPage = !!response.next;
              state.pagination.hasPreviousPage = !!response.previous;
              state.isLoading = false;
              state.error = null;
            });

            if (showToast && response.results.length > 0) {
              toastInfo(`Loaded ${response.results.length} nodes`, {
                description: `Found ${response.count} total nodes.`,
              });
            }
          } catch (error) {
            const errorMessage = error instanceof TApiError 
              ? error.message 
              : error instanceof Error 
              ? error.message 
              : 'Failed to load nodes';
            
            set((state) => {
              state.isLoading = false;
              state.error = errorMessage;
            });

            if (showToast) {
              toastError('Failed to load nodes', {
                description: errorMessage,
              });
            }
          }
        },

        createMultipleNodes: async (nodes: TNodeCreateData[], options = {}) => {
          const { showToast = true, optimistic = false } = options;
          
          if (optimistic) {
            // Optimistic update
            const tempNodes: TNode[] = nodes.map((nodeData, index) => ({
              id: `temp-${Date.now()}-${index}`,
              ...nodeData,
              is_active: nodeData.is_active ?? true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              createdBy: 'Current User',
            }));
            
            set((state) => {
              // Ensure nodes array exists before calling unshift
              if (!state.nodes) {
                state.nodes = [];
              }
              state.nodes.unshift(...tempNodes);
              state.pagination.totalCount += nodes.length;
            });
          }
          
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });
          
          try {
            const newNodes = await ApiService.bulkCreateNodes(nodes);
            
            set((state) => {
              if (optimistic) {
                // Replace temporary nodes with real ones
                state.nodes = state.nodes?.filter(n => !n.id.startsWith('temp-')) ?? [];
              }
              // Ensure nodes array exists before calling unshift
              if (!state.nodes) {
                state.nodes = [];
              }
              state.nodes.unshift(...newNodes);
              state.pagination.totalCount += newNodes.length;
              state.isLoading = false;
              state.error = null;
            });

            if (showToast) {
              toastSuccess(`${newNodes.length} nodes created successfully!`, {
                description: `Created ${newNodes.length} new nodes.`,
              });
            }

            return newNodes;
          } catch (error) {
            const errorMessage = error instanceof TApiError 
              ? error.message 
              : error instanceof Error 
              ? error.message 
              : 'Failed to create nodes';
            
            set((state) => {
              if (optimistic) {
                // Remove temporary nodes on error
                state.nodes = state.nodes?.filter(n => !n.id.startsWith('temp-')) ?? [];
                state.pagination.totalCount -= nodes.length;
              }
              state.isLoading = false;
              state.error = errorMessage;
            });

            if (showToast) {
              toastError('Failed to create nodes', {
                description: errorMessage,
              });
            }
            
            throw error;
          }
        },

        deleteMultipleNodes: async (ids: string[], options = {}) => {
          const { showToast = true, optimistic = false } = options;
          
          if (optimistic) {
            // Optimistic update
            set((state) => {
              state.nodes = state.nodes?.filter(n => !ids.includes(n.id)) ?? [];
              state.selectedNodes = state.selectedNodes.filter(nId => !ids.includes(nId));
              if (state.selectedNode && ids.includes(state.selectedNode.id)) {
                state.selectedNode = null;
              }
              state.pagination.totalCount -= ids.length;
            });
          }
          
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });
          
          try {
            await ApiService.bulkDeleteNodes(ids);
            
            if (!optimistic) {
              set((state) => {
                state.nodes = state.nodes?.filter(n => !ids.includes(n.id)) ?? [];
                state.selectedNodes = state.selectedNodes.filter(nId => !ids.includes(nId));
                if (state.selectedNode && ids.includes(state.selectedNode.id)) {
                  state.selectedNode = null;
                }
                state.pagination.totalCount -= ids.length;
                state.isLoading = false;
                state.error = null;
              });
            } else {
              set((state) => {
                state.isLoading = false;
                state.error = null;
              });
            }

            if (showToast) {
              toastSuccess(`${ids.length} nodes deleted successfully!`, {
                description: `Deleted ${ids.length} nodes.`,
              });
            }
          } catch (error) {
            const errorMessage = error instanceof TApiError 
              ? error.message 
              : error instanceof Error 
              ? error.message 
              : 'Failed to delete nodes';
            
            set((state) => {
              state.isLoading = false;
              state.error = errorMessage;
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
          set((state) => {
            state.selectedNode = node;
            state.selectedNodes = node ? [node.id] : [];
          });
        },

        selectNodes: (nodeIds: string[]) => {
          set((state) => {
            state.selectedNodes = nodeIds;
            state.selectedNode = nodeIds.length === 1 
              ? state.nodes?.find(n => n.id === nodeIds[0]) || null
              : null;
          });
        },

        toggleNodeSelection: (nodeId: string) => {
          set((state) => {
            const isSelected = state.selectedNodes.includes(nodeId);
            if (isSelected) {
              state.selectedNodes = state.selectedNodes.filter(id => id !== nodeId);
            } else {
              state.selectedNodes.push(nodeId);
            }
            
            // Update selectedNode based on selection
            if (state.selectedNodes.length === 1) {
              state.selectedNode = state.nodes?.find(n => n.id === state.selectedNodes[0]) || null;
            } else {
              state.selectedNode = null;
            }
          });
        },

        clearSelection: () => {
          set((state) => {
            state.selectedNode = null;
            state.selectedNodes = [];
          });
        },

        setMultiSelectMode: (enabled: boolean) => {
          set((state) => {
            state.isMultiSelectMode = enabled;
            if (!enabled) {
              state.selectedNodes = [];
            }
          });
        },

        setFilters: (filters: Partial<TNodesState['filters']>) => {
          set((state) => {
            state.filters = { ...state.filters, ...filters };
            state.cache.isStale = true; // Invalidate cache when filters change
          });
        },

        clearFilters: () => {
          set((state) => {
            state.filters = {
              type: undefined,
              nodeGroup: undefined,
              search: undefined,
            };
            state.searchQuery = '';
            state.cache.isStale = true;
          });
        },

        setSearchQuery: (query: string) => {
          set((state) => {
            state.searchQuery = query;
            state.filters.search = query || undefined;
            state.cache.isStale = true;
          });
        },

        setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => {
          set((state) => {
            state.sortBy = sortBy;
            state.sortOrder = sortOrder;
            state.cache.isStale = true;
          });
        },

        // Pagination
        setPage: (page: number) => {
          set((state) => {
            state.pagination.currentPage = page;
            state.cache.isStale = true;
          });
        },

        setPageSize: (size: number) => {
          set((state) => {
            state.pagination.pageSize = size;
            state.pagination.currentPage = 1; // Reset to first page
            state.cache.isStale = true;
          });
        },

        nextPage: () => {
          const { pagination } = get();
          if (pagination.hasNextPage) {
            get().setPage(pagination.currentPage + 1);
          }
        },

        previousPage: () => {
          const { pagination } = get();
          if (pagination.hasPreviousPage) {
            get().setPage(pagination.currentPage - 1);
          }
        },


        // Statistics
        loadStats: async (forceRefresh = false) => {
          const { stats } = get();
          
          if (!forceRefresh && stats && Date.now() - stats.lastUpdated < 5 * 60 * 1000) {
            return; // Use cached stats if less than 5 minutes old
          }
          
          try {
            const statsData = await ApiService.getNodeStats();
            
            set((state) => {
              state.stats = {
                total: statsData.total_nodes,
                active: statsData.active_nodes,
                inactive: statsData.inactive_nodes,
                byType: statsData.by_type,
                byNodeGroup: statsData.by_node_group || {},
                lastUpdated: Date.now(),
              };
            });
          } catch (error) {
            console.error('Failed to load stats:', error);
          }
        },

        // Utility actions
        setLoading: (loading: boolean) => {
          set((state) => {
            state.isLoading = loading;
          });
        },

        setError: (error: string | null) => {
          set((state) => {
            state.error = error;
          });
        },

        clearError: () => {
          set((state) => {
            state.error = null;
          });
        },

        reset: () => {
          set(initialState);
        },
      }))
    ),
    {
      name: 'enhanced-nodes-store',
    }
  )
);


// Selectors for common use cases
export const nodesSelectors = {
  getFilteredNodes: (state: EnhancedNodesStore) => {
    const { nodes, filters, searchQuery, sortBy, sortOrder } = state;
    
    const filtered = (nodes || []).filter((node) => {
      if (filters.type && node.type !== filters.type) return false;
      if (filters.nodeGroup && node.node_group?.id !== filters.nodeGroup) return false;
      if (searchQuery && !node.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
    
    // Sort nodes
    filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof TNode];
      const bValue = b[sortBy as keyof TNode];
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  },
  
  getSelectedNodes: (state: EnhancedNodesStore) => {
    return (state.nodes || []).filter(node => state.selectedNodes.includes(node.id));
  },
  
  getNodesByType: (state: EnhancedNodesStore, type: string) => {
    return (state.nodes || []).filter(node => node.type === type);
  },
  
  getNodesByNodeGroup: (state: EnhancedNodesStore, nodeGroup: string) => {
    return (state.nodes || []).filter(node => node.node_group?.id === nodeGroup);
  },
  
  getActiveNodes: (state: EnhancedNodesStore) => {
    return (state.nodes || []).filter(node => node.is_active);
  },
  
  getInactiveNodes: (state: EnhancedNodesStore) => {
    return (state.nodes || []).filter(node => !node.is_active);
  },
};
