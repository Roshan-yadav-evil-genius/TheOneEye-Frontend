import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Workflow layout state for a specific workflow
interface WorkflowLayoutState {
  // Canvas UI preferences
  isSidebarCollapsed: boolean;
  lineType: string;
  showMinimap: boolean;
  
  // Search and filtering
  searchTerm: string;
  filters: {
    nodeGroup: string;
  };
  
  // Node selection
  selectedNodes: string[];
  
  // Canvas viewport (for future persistence)
  viewport: {
    x: number;
    y: number;
    zoom: number;
  } | null;
}

// Store state - maps workflow IDs to their layout state
interface WorkflowLayoutStoreState {
  // Map of workflowId -> layout state
  layouts: Record<string, WorkflowLayoutState>;
  
  // Global defaults
  defaultLineType: string;
  defaultShowMinimap: boolean;
  defaultSidebarCollapsed: boolean;
}

interface WorkflowLayoutStoreActions {
  // Layout management
  initializeLayout: (workflowId: string) => void;
  getLayout: (workflowId: string) => WorkflowLayoutState;
  
  // Sidebar management
  setSidebarCollapsed: (workflowId: string, collapsed: boolean) => void;
  toggleSidebar: (workflowId: string) => void;
  
  // Line type management
  setLineType: (workflowId: string, lineType: string) => void;
  
  // Minimap management
  setShowMinimap: (workflowId: string, show: boolean) => void;
  toggleMinimap: (workflowId: string) => void;
  
  // Search and filtering
  setSearchTerm: (workflowId: string, searchTerm: string) => void;
  setFilters: (workflowId: string, filters: Partial<WorkflowLayoutState['filters']>) => void;
  clearFilters: (workflowId: string) => void;
  
  // Node selection
  setSelectedNodes: (workflowId: string, nodeIds: string[]) => void;
  addSelectedNode: (workflowId: string, nodeId: string) => void;
  removeSelectedNode: (workflowId: string, nodeId: string) => void;
  toggleNodeSelection: (workflowId: string, nodeId: string) => void;
  clearSelection: (workflowId: string) => void;
  
  // Viewport management (for future use)
  setViewport: (workflowId: string, viewport: WorkflowLayoutState['viewport']) => void;
  resetViewport: (workflowId: string) => void;
  
  // Utility
  clearLayout: (workflowId: string) => void;
  clearAllLayouts: () => void;
  setDefaults: (defaults: Partial<Pick<WorkflowLayoutStoreState, 'defaultLineType' | 'defaultShowMinimap' | 'defaultSidebarCollapsed'>>) => void;
}

type WorkflowLayoutStore = WorkflowLayoutStoreState & WorkflowLayoutStoreActions;

const defaultLayoutState: WorkflowLayoutState = {
  isSidebarCollapsed: false,
  lineType: 'step',
  showMinimap: true,
  searchTerm: '',
  filters: {
    nodeGroup: 'all',
  },
  selectedNodes: [],
  viewport: null,
};

const initialState: WorkflowLayoutStoreState = {
  layouts: {},
  defaultLineType: 'step',
  defaultShowMinimap: true,
  defaultSidebarCollapsed: false,
};

export const useWorkflowLayoutStore = create<WorkflowLayoutStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Layout management
        initializeLayout: (workflowId: string) => {
          set((state) => {
            if (!state.layouts[workflowId]) {
              state.layouts[workflowId] = {
                ...defaultLayoutState,
                lineType: state.defaultLineType,
                showMinimap: state.defaultShowMinimap,
                isSidebarCollapsed: state.defaultSidebarCollapsed,
              };
            }
          });
        },

        getLayout: (workflowId: string) => {
          const layout = get().layouts[workflowId];
          if (!layout) {
            get().initializeLayout(workflowId);
            return get().layouts[workflowId];
          }
          return layout;
        },

        // Sidebar management
        setSidebarCollapsed: (workflowId: string, collapsed: boolean) => {
          set((state) => {
            if (!state.layouts[workflowId]) {
              state.layouts[workflowId] = { ...defaultLayoutState };
            }
            state.layouts[workflowId].isSidebarCollapsed = collapsed;
          });
        },

        toggleSidebar: (workflowId: string) => {
          set((state) => {
            if (!state.layouts[workflowId]) {
              state.layouts[workflowId] = { ...defaultLayoutState };
            }
            state.layouts[workflowId].isSidebarCollapsed = !state.layouts[workflowId].isSidebarCollapsed;
          });
        },

        // Line type management
        setLineType: (workflowId: string, lineType: string) => {
          set((state) => {
            if (!state.layouts[workflowId]) {
              state.layouts[workflowId] = { ...defaultLayoutState };
            }
            state.layouts[workflowId].lineType = lineType;
          });
        },

        // Minimap management
        setShowMinimap: (workflowId: string, show: boolean) => {
          set((state) => {
            if (!state.layouts[workflowId]) {
              state.layouts[workflowId] = { ...defaultLayoutState };
            }
            state.layouts[workflowId].showMinimap = show;
          });
        },

        toggleMinimap: (workflowId: string) => {
          set((state) => {
            if (!state.layouts[workflowId]) {
              state.layouts[workflowId] = { ...defaultLayoutState };
            }
            state.layouts[workflowId].showMinimap = !state.layouts[workflowId].showMinimap;
          });
        },

        // Search and filtering
        setSearchTerm: (workflowId: string, searchTerm: string) => {
          set((state) => {
            if (!state.layouts[workflowId]) {
              state.layouts[workflowId] = { ...defaultLayoutState };
            }
            state.layouts[workflowId].searchTerm = searchTerm;
          });
        },

        setFilters: (workflowId: string, filters: Partial<WorkflowLayoutState['filters']>) => {
          set((state) => {
            if (!state.layouts[workflowId]) {
              state.layouts[workflowId] = { ...defaultLayoutState };
            }
            state.layouts[workflowId].filters = {
              ...state.layouts[workflowId].filters,
              ...filters,
            };
          });
        },

        clearFilters: (workflowId: string) => {
          set((state) => {
            if (!state.layouts[workflowId]) {
              state.layouts[workflowId] = { ...defaultLayoutState };
            }
            state.layouts[workflowId].searchTerm = '';
            state.layouts[workflowId].filters = {
              nodeGroup: 'all',
            };
          });
        },

        // Node selection
        setSelectedNodes: (workflowId: string, nodeIds: string[]) => {
          set((state) => {
            if (!state.layouts[workflowId]) {
              state.layouts[workflowId] = { ...defaultLayoutState };
            }
            state.layouts[workflowId].selectedNodes = nodeIds;
          });
        },

        addSelectedNode: (workflowId: string, nodeId: string) => {
          set((state) => {
            if (!state.layouts[workflowId]) {
              state.layouts[workflowId] = { ...defaultLayoutState };
            }
            if (!state.layouts[workflowId].selectedNodes.includes(nodeId)) {
              state.layouts[workflowId].selectedNodes.push(nodeId);
            }
          });
        },

        removeSelectedNode: (workflowId: string, nodeId: string) => {
          set((state) => {
            if (!state.layouts[workflowId]) {
              state.layouts[workflowId] = { ...defaultLayoutState };
            }
            state.layouts[workflowId].selectedNodes = state.layouts[workflowId].selectedNodes.filter(
              id => id !== nodeId
            );
          });
        },

        toggleNodeSelection: (workflowId: string, nodeId: string) => {
          set((state) => {
            if (!state.layouts[workflowId]) {
              state.layouts[workflowId] = { ...defaultLayoutState };
            }
            const selectedNodes = state.layouts[workflowId].selectedNodes;
            const index = selectedNodes.indexOf(nodeId);
            if (index > -1) {
              selectedNodes.splice(index, 1);
            } else {
              selectedNodes.push(nodeId);
            }
          });
        },

        clearSelection: (workflowId: string) => {
          set((state) => {
            if (!state.layouts[workflowId]) {
              state.layouts[workflowId] = { ...defaultLayoutState };
            }
            state.layouts[workflowId].selectedNodes = [];
          });
        },

        // Viewport management
        setViewport: (workflowId: string, viewport: WorkflowLayoutState['viewport']) => {
          set((state) => {
            if (!state.layouts[workflowId]) {
              state.layouts[workflowId] = { ...defaultLayoutState };
            }
            state.layouts[workflowId].viewport = viewport;
          });
        },

        resetViewport: (workflowId: string) => {
          set((state) => {
            if (!state.layouts[workflowId]) {
              state.layouts[workflowId] = { ...defaultLayoutState };
            }
            state.layouts[workflowId].viewport = null;
          });
        },

        // Utility
        clearLayout: (workflowId: string) => {
          set((state) => {
            delete state.layouts[workflowId];
          });
        },

        clearAllLayouts: () => {
          set((state) => {
            state.layouts = {};
          });
        },

        setDefaults: (defaults) => {
          set((state) => {
            if (defaults.defaultLineType !== undefined) {
              state.defaultLineType = defaults.defaultLineType;
            }
            if (defaults.defaultShowMinimap !== undefined) {
              state.defaultShowMinimap = defaults.defaultShowMinimap;
            }
            if (defaults.defaultSidebarCollapsed !== undefined) {
              state.defaultSidebarCollapsed = defaults.defaultSidebarCollapsed;
            }
          });
        },
      })),
      {
        name: 'workflow-layout-store',
        partialize: (state) => ({
          // Persist layouts and defaults
          layouts: state.layouts,
          defaultLineType: state.defaultLineType,
          defaultShowMinimap: state.defaultShowMinimap,
          defaultSidebarCollapsed: state.defaultSidebarCollapsed,
        }),
        version: 1,
        migrate: (persistedState: unknown, version: number) => {
          // Handle future migrations here
          return persistedState;
        },
      }
    ),
    {
      name: 'workflow-layout-store',
    }
  )
);

// Helper hook for workflow layout management
export const useWorkflowLayout = (workflowId?: string) => {
  const {
    initializeLayout,
    getLayout,
    setSidebarCollapsed,
    toggleSidebar,
    setLineType,
    setShowMinimap,
    toggleMinimap,
    setSearchTerm,
    setFilters,
    clearFilters,
    setSelectedNodes,
    addSelectedNode,
    removeSelectedNode,
    toggleNodeSelection,
    clearSelection,
    setViewport,
    resetViewport,
  } = useWorkflowLayoutStore();

  // Initialize layout when workflowId is provided
  React.useEffect(() => {
    if (workflowId) {
      initializeLayout(workflowId);
    }
  }, [workflowId, initializeLayout]);

  const layout = workflowId ? getLayout(workflowId) : defaultLayoutState;

  return {
    // State
    isSidebarCollapsed: layout.isSidebarCollapsed,
    lineType: layout.lineType,
    showMinimap: layout.showMinimap,
    searchTerm: layout.searchTerm,
    filters: layout.filters,
    selectedNodes: layout.selectedNodes,
    viewport: layout.viewport,

    // Actions
    setSidebarCollapsed: (collapsed: boolean) => workflowId && setSidebarCollapsed(workflowId, collapsed),
    toggleSidebar: () => workflowId && toggleSidebar(workflowId),
    setLineType: (lineType: string) => workflowId && setLineType(workflowId, lineType),
    setShowMinimap: (show: boolean) => workflowId && setShowMinimap(workflowId, show),
    toggleMinimap: () => workflowId && toggleMinimap(workflowId),
    setSearchTerm: (searchTerm: string) => workflowId && setSearchTerm(workflowId, searchTerm),
    setFilters: (filters: Partial<WorkflowLayoutState['filters']>) => workflowId && setFilters(workflowId, filters),
    clearFilters: () => workflowId && clearFilters(workflowId),
    setSelectedNodes: (nodeIds: string[]) => workflowId && setSelectedNodes(workflowId, nodeIds),
    addSelectedNode: (nodeId: string) => workflowId && addSelectedNode(workflowId, nodeId),
    removeSelectedNode: (nodeId: string) => workflowId && removeSelectedNode(workflowId, nodeId),
    toggleNodeSelection: (nodeId: string) => workflowId && toggleNodeSelection(workflowId, nodeId),
    clearSelection: () => workflowId && clearSelection(workflowId),
    setViewport: (viewport: WorkflowLayoutState['viewport']) => workflowId && setViewport(workflowId, viewport),
    resetViewport: () => workflowId && resetViewport(workflowId),
  };
};

// Import React for useEffect
import React from 'react';
