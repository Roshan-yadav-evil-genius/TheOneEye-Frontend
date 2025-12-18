/**
 * Workflow Execution Store
 * 
 * Single responsibility: Managing workflow execution state.
 * Handles start/pause/stop operations and task polling.
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { workflowApi } from '@/lib/api/services/workflow-api';
import { toastSuccess, toastError, toastInfo } from '@/hooks/use-toast';

// Execution status types
export type ExecutionStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed';

// Execution State Interface
interface WorkflowExecutionState {
  // Current execution state
  workflowId: string | null;
  status: ExecutionStatus;
  taskId: string | null;
  
  // Progress tracking
  progress: number;
  currentNodeId: string | null;
  
  // Results
  result: unknown;
  error: string | null;
  
  // Loading states
  isStarting: boolean;
  isStopping: boolean;
  isPolling: boolean;
}

// Execution Actions Interface
interface WorkflowExecutionActions {
  // Workflow execution
  startExecution: (workflowId: string) => Promise<void>;
  stopExecution: () => Promise<void>;
  pauseExecution: () => Promise<void>;
  resumeExecution: () => Promise<void>;
  
  // Task status polling
  pollTaskStatus: (taskId: string) => Promise<void>;
  stopPolling: () => void;
  
  // State management
  setWorkflowId: (workflowId: string | null) => void;
  setStatus: (status: ExecutionStatus) => void;
  setProgress: (progress: number) => void;
  setCurrentNode: (nodeId: string | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

type WorkflowExecutionStore = WorkflowExecutionState & WorkflowExecutionActions;

const initialState: WorkflowExecutionState = {
  workflowId: null,
  status: 'idle',
  taskId: null,
  progress: 0,
  currentNodeId: null,
  result: null,
  error: null,
  isStarting: false,
  isStopping: false,
  isPolling: false,
};

// Polling interval reference
let pollingInterval: NodeJS.Timeout | null = null;

export const useWorkflowExecutionStore = create<WorkflowExecutionStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // Workflow execution
      startExecution: async (workflowId: string) => {
        set((state) => {
          state.isStarting = true;
          state.error = null;
          state.workflowId = workflowId;
        });

        try {
          const response = await workflowApi.startWorkflowExecution(workflowId);
          
          set((state) => {
            state.taskId = response.task_id;
            state.status = 'running';
            state.isStarting = false;
          });

          toastSuccess('Workflow execution started!');
          
          // Start polling for task status
          get().pollTaskStatus(response.task_id);
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Failed to start workflow execution';

          set((state) => {
            state.isStarting = false;
            state.status = 'failed';
            state.error = errorMessage;
          });

          toastError('Failed to start execution', {
            description: errorMessage,
          });
        }
      },

      stopExecution: async () => {
        const { workflowId } = get();
        if (!workflowId) return;

        set((state) => {
          state.isStopping = true;
        });

        try {
          await workflowApi.stopWorkflowExecution(workflowId);
          
          get().stopPolling();
          
          set((state) => {
            state.status = 'idle';
            state.isStopping = false;
            state.taskId = null;
            state.progress = 0;
            state.currentNodeId = null;
          });

          toastInfo('Workflow execution stopped');
        } catch (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Failed to stop workflow execution';

          set((state) => {
            state.isStopping = false;
            state.error = errorMessage;
          });

          toastError('Failed to stop execution', {
            description: errorMessage,
          });
        }
      },

      pauseExecution: async () => {
        // Pause is typically handled by stopping polling
        get().stopPolling();
        
        set((state) => {
          state.status = 'paused';
        });

        toastInfo('Workflow execution paused');
      },

      resumeExecution: async () => {
        const { taskId } = get();
        if (!taskId) return;

        set((state) => {
          state.status = 'running';
        });

        // Resume polling
        get().pollTaskStatus(taskId);
        
        toastInfo('Workflow execution resumed');
      },

      // Task status polling
      pollTaskStatus: async (taskId: string) => {
        // Clear any existing polling
        get().stopPolling();

        set((state) => {
          state.isPolling = true;
          state.taskId = taskId;
        });

        const poll = async () => {
          try {
            const status = await workflowApi.getTaskStatus(taskId);
            
            set((state) => {
              if (status.progress !== undefined) {
                state.progress = status.progress;
              }
              
              if (status.state === 'SUCCESS') {
                state.status = 'completed';
                state.result = status.result;
                state.isPolling = false;
                get().stopPolling();
                toastSuccess('Workflow completed successfully!');
              } else if (status.state === 'FAILURE') {
                state.status = 'failed';
                state.error = status.error || 'Execution failed';
                state.isPolling = false;
                get().stopPolling();
                toastError('Workflow execution failed', {
                  description: status.error,
                });
              } else if (status.state === 'PENDING' || status.state === 'STARTED') {
                state.status = 'running';
              }
            });
          } catch (error) {
            const errorMessage = error instanceof Error 
              ? error.message 
              : 'Failed to get task status';

            set((state) => {
              state.error = errorMessage;
              state.isPolling = false;
            });
            
            get().stopPolling();
          }
        };

        // Poll immediately, then every 2 seconds
        await poll();
        pollingInterval = setInterval(poll, 2000);
      },

      stopPolling: () => {
        if (pollingInterval) {
          clearInterval(pollingInterval);
          pollingInterval = null;
        }
        
        set((state) => {
          state.isPolling = false;
        });
      },

      // State management
      setWorkflowId: (workflowId: string | null) => {
        set((state) => {
          state.workflowId = workflowId;
        });
      },

      setStatus: (status: ExecutionStatus) => {
        set((state) => {
          state.status = status;
        });
      },

      setProgress: (progress: number) => {
        set((state) => {
          state.progress = progress;
        });
      },

      setCurrentNode: (nodeId: string | null) => {
        set((state) => {
          state.currentNodeId = nodeId;
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
        get().stopPolling();
        set(initialState);
      },
    })),
    {
      name: 'workflow-execution-store',
    }
  )
);

// Selectors
export const workflowExecutionSelectors = {
  isRunning: (state: WorkflowExecutionStore) => state.status === 'running',
  isPaused: (state: WorkflowExecutionStore) => state.status === 'paused',
  isCompleted: (state: WorkflowExecutionStore) => state.status === 'completed',
  isFailed: (state: WorkflowExecutionStore) => state.status === 'failed',
  isIdle: (state: WorkflowExecutionStore) => state.status === 'idle',
  hasError: (state: WorkflowExecutionStore) => state.error !== null,
  isExecuting: (state: WorkflowExecutionStore) => 
    state.status === 'running' || state.isStarting,
};
