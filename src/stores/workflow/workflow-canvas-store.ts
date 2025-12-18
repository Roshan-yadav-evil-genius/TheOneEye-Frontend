/**
 * Workflow Canvas Store
 * 
 * Single responsibility: Managing canvas data (nodes and connections).
 * Does NOT handle selection state or execution state.
 */
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { BackendWorkflowNode } from '@/types/api/backend';
import { TWorkflowConnection } from '@/types/common/entities';
import {
  TWorkflowNodeCreateRequest,
  TWorkflowConnectionCreateRequest
} from '@/types/api/requests';
import { workflowApi } from '@/lib/api/services/workflow-api';
import { toastSuccess, toastError, toastInfo } from '@/hooks/use-toast';

// Workflow Canvas State Interface
interface WorkflowCanvasState {
  // Data
  workflowId: string | null;
  nodes: BackendWorkflowNode[];
  connections: TWorkflowConnection[];
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
  
  // UI State (drag only - selection is in separate store)
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
  updateNodeFormValues: (nodeId: string, formValues: Record<string, unknown>) => Promise<void>;
  updateNodeExecutionData: (nodeId: string, data: { 
    form_values?: Record<string, unknown>; 
    input_data?: Record<string, unknown>; 
    output_data?: Record<string, unknown> 
  }) => void;
  removeNode: (nodeId: string) => Promise<void>;
  
  // Connection Operations
  addConnection: (connectionData: TWorkflowConnectionCreateRequest) => Promise<TWorkflowConnection | null>;
  removeConnection: (connectionId: string) => Promise<void>;
  
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
            const canvasData = await workflowApi.getWorkflowCanvasData(workflowId);
            
            set((state) => {
              state.nodes = canvasData.nodes;
              state.connections = canvasData.edges.map(edge => ({
                id: edge.id,
                source: edge.source_node,
                target: edge.target_node,
                sourceHandle: edge.source_handle || 'default',
              }));
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
            // Force reload by clearing current state
            set((state) => {
              state.workflow = null;
              state.nodes = [];
            });
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
            const response = await workflowApi.addNodeToWorkflow(workflowId, nodeData);
            
            const newNode: BackendWorkflowNode = response;

            set((state) => {
              state.nodes.push(newNode);
              state.isSaving = false;
              state.error = null;
            });

            toastSuccess('Node added successfully!', {
              description: `"${response.node_type?.name || 'Node'}" has been added to the workflow.`,
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
            await workflowApi.updateNodePosition(workflowId, nodeId, position);
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

        updateNodeFormValues: async (nodeId: string, formValues: Record<string, unknown>) => {
          const { workflowId } = get();
          if (!workflowId) {
            toastError('No workflow selected');
            return;
          }

          // Optimistic update
          set((state) => {
            const node = state.nodes.find(n => n.id === nodeId);
            if (node) {
              node.form_values = formValues;
            }
          });

          try {
            await workflowApi.updateNodeFormValues(workflowId, nodeId, formValues);
            toastSuccess('Form values saved successfully!');
          } catch (error) {
            // Revert optimistic update on error
            await get().refreshWorkflowCanvas();
            
            const errorMessage = error instanceof Error 
              ? error.message 
              : 'Failed to save form values';

            toastError('Failed to save form values', {
              description: errorMessage,
            });
          }
        },

        updateNodeExecutionData: (nodeId: string, data: { 
          form_values?: Record<string, unknown>; 
          input_data?: Record<string, unknown>; 
          output_data?: Record<string, unknown> 
        }) => {
          set((state) => {
            const node = state.nodes.find(n => n.id === nodeId);
            if (node) {
              if (data.form_values !== undefined) node.form_values = data.form_values;
              if (data.input_data !== undefined) node.input_data = data.input_data;
              if (data.output_data !== undefined) node.output_data = data.output_data;
            }
          });
        },

        removeNode: async (nodeId: string) => {
          const { workflowId } = get();
          if (!workflowId) {
            return;
          }

          const nodeToRemove = get().nodes.find(n => n.id === nodeId);
          const nodeName = nodeToRemove?.node_type?.name || 'Node';

          // Optimistic update
          set((state) => {
            state.nodes = state.nodes.filter(n => n.id !== nodeId);
            state.connections = state.connections.filter(
              c => c.source !== nodeId && c.target !== nodeId
            );
          });

          try {
            await workflowApi.removeNodeFromWorkflow(workflowId, nodeId);
            
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
            const newConnection = await workflowApi.addConnectionToWorkflow(workflowId, connectionData);
            
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
          });

          try {
            await workflowApi.removeConnectionFromWorkflow(workflowId, connectionId);
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

