import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { 
  TWorkflowNode, 
  TWorkflowConnection
} from '@/types/common/entities';
import { BackendWorkflowNode, BackendWorkflowConnection } from '@/types/api/backend';
import {
  TWorkflowNodeCreateRequest,
  TWorkflowConnectionCreateRequest
} from '@/types/api/requests';
import { 
  TWorkflowCanvasData
} from '@/types/api/responses';
import { ApiService } from '@/lib/api/api-service';
import { toastSuccess, toastError, toastInfo } from '@/hooks/use-toast';

// Workflow Canvas State Interface
interface WorkflowCanvasState {
  // Data
  workflowId: string | null;
  nodes: BackendWorkflowNode[];
  connections: BackendWorkflowConnection[];
  workflow: {
    id: string;
    name: string;
    description: string;
    status: string;
  } | null;
  
  // Loading and Error States
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  // Selection State
  selectedNodes: string[];
  selectedConnections: string[];
  
  // UI State
  isDragOver: boolean;
}

// Workflow Canvas Actions Interface
interface WorkflowCanvasActions {
  // Data Loading
  loadWorkflowCanvas: (workflowId: string) => Promise<void>;
  refreshWorkflowCanvas: () => Promise<void>;
  
  // Node Operations
  addNode: (nodeData: TWorkflowNodeCreateRequest) => Promise<BackendWorkflowNode | null>;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => Promise<void>;
  removeNode: (nodeId: string) => Promise<void>;
  
  // Connection Operations
  addConnection: (connectionData: TWorkflowConnectionCreateRequest) => Promise<TWorkflowConnection | null>;
  removeConnection: (connectionId: string) => Promise<void>;
  
  // Selection Management
  selectNode: (nodeId: string) => void;
  selectNodes: (nodeIds: string[]) => void;
  toggleNodeSelection: (nodeId: string) => void;
  selectConnection: (connectionId: string) => void;
  selectConnections: (connectionIds: string[]) => void;
  clearSelection: () => void;
  
  // UI State Management
  setDragOver: (isDragOver: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Utility Actions
  reset: () => void;
}

type WorkflowCanvasStore = WorkflowCanvasState & WorkflowCanvasActions;

const initialState: WorkflowCanvasState = {
  workflowId: null,
  nodes: [],
  connections: [],
  workflow: null,
  isLoading: false,
  isSaving: false,
  error: null,
  selectedNodes: [],
  selectedConnections: [],
  isDragOver: false,
};

export const useWorkflowCanvasStore = create<WorkflowCanvasStore>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,

        // Data Loading
        loadWorkflowCanvas: async (workflowId: string) => {
          const currentState = get();
          
          // Prevent loading if already loading the same workflow
          if (currentState.isLoading && currentState.workflowId === workflowId) {
            return;
          }
          
          // Prevent loading if workflow is already loaded and data exists
          if (currentState.workflowId === workflowId && currentState.workflow && currentState.nodes.length > 0) {
            return;
          }

          set((state) => {
            state.isLoading = true;
            state.error = null;
            state.workflowId = workflowId;
          });

          try {
            const canvasData = await ApiService.getWorkflowCanvasData(workflowId);
            
            set((state) => {
              state.nodes = canvasData.nodes;
              state.connections = canvasData.edges;
              state.workflow = canvasData.workflow;
              state.isLoading = false;
              state.error = null;
            });

            toastInfo(`Workflow "${canvasData.workflow.name}" loaded`, {
              description: `Found ${canvasData.nodes.length} nodes and ${canvasData.edges.length} connections.`,
            });
          } catch (error) {
            const errorMessage = error instanceof Error 
              ? error.message 
              : 'Failed to load workflow canvas';

            set((state) => {
              state.isLoading = false;
              state.error = errorMessage;
            });

            toastError('Failed to load workflow', {
              description: errorMessage,
            });
          }
        },

        refreshWorkflowCanvas: async () => {
          const { workflowId } = get();
          if (workflowId) {
            await get().loadWorkflowCanvas(workflowId);
          }
        },

        // Node Operations
        addNode: async (nodeData: TWorkflowNodeCreateRequest) => {
          const { workflowId } = get();
          if (!workflowId) {
            toastError('No workflow selected');
            return null;
          }

          set((state) => {
            state.isSaving = true;
            state.error = null;
          });

          try {
            const response = await ApiService.addNodeToWorkflow(workflowId, nodeData);
            
            const newNode: BackendWorkflowNode = response;

            set((state) => {
              state.nodes.push(newNode);
              state.isSaving = false;
              state.error = null;
            });

            toastSuccess('Node added successfully!', {
              description: `"${response.data.label}" has been added to the workflow.`,
            });

            return newNode;
          } catch (error) {
            const errorMessage = error instanceof Error 
              ? error.message 
              : 'Failed to add node';

            set((state) => {
              state.isSaving = false;
              state.error = errorMessage;
            });

            toastError('Failed to add node', {
              description: errorMessage,
            });
            
            return null;
          }
        },

        updateNodePosition: async (nodeId: string, position: { x: number; y: number }) => {
          const { workflowId } = get();
          if (!workflowId) {
            return;
          }

          // Optimistic update
          set((state) => {
            const node = state.nodes.find(n => n.id === nodeId);
            if (node) {
              node.position = position;
            }
          });

          try {
            await ApiService.updateNodePosition(workflowId, nodeId, position);
          } catch (error) {
            // Revert optimistic update on error
            await get().refreshWorkflowCanvas();
            
            const errorMessage = error instanceof Error 
              ? error.message 
              : 'Failed to update node position';

            toastError('Failed to update node position', {
              description: errorMessage,
            });
          }
        },

        removeNode: async (nodeId: string) => {
          const { workflowId } = get();
          if (!workflowId) {
            return;
          }

          const nodeToRemove = get().nodes.find(n => n.id === nodeId);
          const nodeName = nodeToRemove?.data.label || 'Node';

          // Optimistic update
          set((state) => {
            state.nodes = state.nodes.filter(n => n.id !== nodeId);
            state.connections = state.connections.filter(
              c => c.source !== nodeId && c.target !== nodeId
            );
            state.selectedNodes = state.selectedNodes.filter(id => id !== nodeId);
          });

          try {
            await ApiService.removeNodeFromWorkflow(workflowId, nodeId);
            
            toastSuccess('Node removed successfully!', {
              description: `"${nodeName}" has been removed from the workflow.`,
            });
          } catch (error) {
            // Revert optimistic update on error
            await get().refreshWorkflowCanvas();
            
            const errorMessage = error instanceof Error 
              ? error.message 
              : 'Failed to remove node';

            toastError('Failed to remove node', {
              description: errorMessage,
            });
          }
        },

        // Connection Operations
        addConnection: async (connectionData: TWorkflowConnectionCreateRequest) => {
          const { workflowId } = get();
          if (!workflowId) {
            toastError('No workflow selected');
            return null;
          }

          set((state) => {
            state.isSaving = true;
            state.error = null;
          });

          try {
            const newConnection = await ApiService.addConnectionToWorkflow(workflowId, connectionData);
            
            set((state) => {
              state.connections.push(newConnection);
              state.isSaving = false;
              state.error = null;
            });

            toastSuccess('Connection added successfully!');
            return newConnection;
          } catch (error) {
            const errorMessage = error instanceof Error 
              ? error.message 
              : 'Failed to add connection';

            set((state) => {
              state.isSaving = false;
              state.error = errorMessage;
            });

            toastError('Failed to add connection', {
              description: errorMessage,
            });
            
            return null;
          }
        },

        removeConnection: async (connectionId: string) => {
          const { workflowId } = get();
          if (!workflowId) {
            return;
          }

          // Optimistic update
          set((state) => {
            state.connections = state.connections.filter(c => c.id !== connectionId);
            state.selectedConnections = state.selectedConnections.filter(id => id !== connectionId);
          });

          try {
            await ApiService.removeConnectionFromWorkflow(workflowId, connectionId);
            toastSuccess('Connection removed successfully!');
          } catch (error) {
            // Revert optimistic update on error
            await get().refreshWorkflowCanvas();
            
            const errorMessage = error instanceof Error 
              ? error.message 
              : 'Failed to remove connection';

            toastError('Failed to remove connection', {
              description: errorMessage,
            });
          }
        },

        // Selection Management
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

        clearSelection: () => {
          set((state) => {
            state.selectedNodes = [];
            state.selectedConnections = [];
          });
        },

        // UI State Management
        setDragOver: (isDragOver: boolean) => {
          set((state) => {
            state.isDragOver = isDragOver;
          });
        },

        setLoading: (loading: boolean) => {
          set((state) => {
            state.isLoading = loading;
          });
        },

        setSaving: (saving: boolean) => {
          set((state) => {
            state.isSaving = saving;
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

        // Utility Actions
        reset: () => {
          set(initialState);
        },
      }))
    ),
    {
      name: 'workflow-canvas-store',
    }
  )
);

// Selectors for common use cases
export const workflowCanvasSelectors = {
  getSelectedNodes: (state: WorkflowCanvasStore) => {
    return state.nodes.filter(node => state.selectedNodes.includes(node.id));
  },
  
  getSelectedConnections: (state: WorkflowCanvasStore) => {
    return state.connections.filter(connection => state.selectedConnections.includes(connection.id));
  },
  
  getNodeById: (state: WorkflowCanvasStore, nodeId: string) => {
    return state.nodes.find(node => node.id === nodeId);
  },
  
  getConnectionsForNode: (state: WorkflowCanvasStore, nodeId: string) => {
    return state.connections.filter(
      connection => connection.source === nodeId || connection.target === nodeId
    );
  },
  
  getIncomingConnections: (state: WorkflowCanvasStore, nodeId: string) => {
    return state.connections.filter(connection => connection.target === nodeId);
  },
  
  getOutgoingConnections: (state: WorkflowCanvasStore, nodeId: string) => {
    return state.connections.filter(connection => connection.source === nodeId);
  },
};
