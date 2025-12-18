/**
 * Workflow Selection Store
 * 
 * Single responsibility: Managing selection state for nodes and connections.
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Selection State Interface
interface WorkflowSelectionState {
  selectedNodes: string[];
  selectedConnections: string[];
}

// Selection Actions Interface
interface WorkflowSelectionActions {
  // Node Selection
  selectNode: (nodeId: string) => void;
  selectNodes: (nodeIds: string[]) => void;
  toggleNodeSelection: (nodeId: string) => void;
  deselectNode: (nodeId: string) => void;
  
  // Connection Selection
  selectConnection: (connectionId: string) => void;
  selectConnections: (connectionIds: string[]) => void;
  toggleConnectionSelection: (connectionId: string) => void;
  deselectConnection: (connectionId: string) => void;
  
  // Clear Selection
  clearNodeSelection: () => void;
  clearConnectionSelection: () => void;
  clearSelection: () => void;
  
  // Utility
  isNodeSelected: (nodeId: string) => boolean;
  isConnectionSelected: (connectionId: string) => boolean;
  reset: () => void;
}

type WorkflowSelectionStore = WorkflowSelectionState & WorkflowSelectionActions;

const initialState: WorkflowSelectionState = {
  selectedNodes: [],
  selectedConnections: [],
};

export const useWorkflowSelectionStore = create<WorkflowSelectionStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // Node Selection
      selectNode: (nodeId: string) => {
        set((state) => {
          state.selectedNodes = [nodeId];
          state.selectedConnections = [];
        });
      },

      selectNodes: (nodeIds: string[]) => {
        set((state) => {
          state.selectedNodes = nodeIds;
          state.selectedConnections = [];
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
          state.selectedConnections = [];
        });
      },

      deselectNode: (nodeId: string) => {
        set((state) => {
          state.selectedNodes = state.selectedNodes.filter(id => id !== nodeId);
        });
      },

      // Connection Selection
      selectConnection: (connectionId: string) => {
        set((state) => {
          state.selectedConnections = [connectionId];
          state.selectedNodes = [];
        });
      },

      selectConnections: (connectionIds: string[]) => {
        set((state) => {
          state.selectedConnections = connectionIds;
          state.selectedNodes = [];
        });
      },

      toggleConnectionSelection: (connectionId: string) => {
        set((state) => {
          const isSelected = state.selectedConnections.includes(connectionId);
          if (isSelected) {
            state.selectedConnections = state.selectedConnections.filter(id => id !== connectionId);
          } else {
            state.selectedConnections.push(connectionId);
          }
          state.selectedNodes = [];
        });
      },

      deselectConnection: (connectionId: string) => {
        set((state) => {
          state.selectedConnections = state.selectedConnections.filter(id => id !== connectionId);
        });
      },

      // Clear Selection
      clearNodeSelection: () => {
        set((state) => {
          state.selectedNodes = [];
        });
      },

      clearConnectionSelection: () => {
        set((state) => {
          state.selectedConnections = [];
        });
      },

      clearSelection: () => {
        set((state) => {
          state.selectedNodes = [];
          state.selectedConnections = [];
        });
      },

      // Utility
      isNodeSelected: (nodeId: string) => {
        return get().selectedNodes.includes(nodeId);
      },

      isConnectionSelected: (connectionId: string) => {
        return get().selectedConnections.includes(connectionId);
      },

      reset: () => {
        set(initialState);
      },
    })),
    {
      name: 'workflow-selection-store',
    }
  )
);

// Selectors
export const workflowSelectionSelectors = {
  hasSelection: (state: WorkflowSelectionStore) => {
    return state.selectedNodes.length > 0 || state.selectedConnections.length > 0;
  },
  
  getSelectedNodeCount: (state: WorkflowSelectionStore) => {
    return state.selectedNodes.length;
  },
  
  getSelectedConnectionCount: (state: WorkflowSelectionStore) => {
    return state.selectedConnections.length;
  },
  
  isSingleNodeSelected: (state: WorkflowSelectionStore) => {
    return state.selectedNodes.length === 1 && state.selectedConnections.length === 0;
  },
  
  isSingleConnectionSelected: (state: WorkflowSelectionStore) => {
    return state.selectedConnections.length === 1 && state.selectedNodes.length === 0;
  },
};

