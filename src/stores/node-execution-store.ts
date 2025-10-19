import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface NodeExecutionState {
  isExecuting: boolean;
  isPolling: boolean;
  lastExecutionResult: unknown;
  taskId: string | null;
}

interface NodeExecutionStore {
  // Map of nodeId -> execution state
  executions: Record<string, NodeExecutionState>;
  
  // Actions
  setExecuting: (nodeId: string, isExecuting: boolean) => void;
  setPolling: (nodeId: string, isPolling: boolean, taskId?: string) => void;
  setResult: (nodeId: string, result: unknown) => void;
  clearExecution: (nodeId: string) => void;
  getExecutionState: (nodeId: string) => NodeExecutionState;
}

const defaultExecutionState: NodeExecutionState = {
  isExecuting: false,
  isPolling: false,
  lastExecutionResult: null,
  taskId: null,
};

export const useNodeExecutionStore = create<NodeExecutionStore>()(
  devtools(
    (set, get) => ({
      executions: {},

      setExecuting: (nodeId: string, isExecuting: boolean) => {
        set((state) => ({
          executions: {
            ...state.executions,
            [nodeId]: {
              ...(state.executions[nodeId] || defaultExecutionState),
              isExecuting,
            },
          },
        }));
      },

      setPolling: (nodeId: string, isPolling: boolean, taskId?: string) => {
        set((state) => ({
          executions: {
            ...state.executions,
            [nodeId]: {
              ...(state.executions[nodeId] || defaultExecutionState),
              isPolling,
              taskId: taskId || state.executions[nodeId]?.taskId || null,
            },
          },
        }));
      },

      setResult: (nodeId: string, result: unknown) => {
        set((state) => ({
          executions: {
            ...state.executions,
            [nodeId]: {
              ...(state.executions[nodeId] || defaultExecutionState),
              lastExecutionResult: result,
              isExecuting: false,
              isPolling: false,
            },
          },
        }));
      },

      clearExecution: (nodeId: string) => {
        set((state) => ({
          executions: {
            ...state.executions,
            [nodeId]: defaultExecutionState,
          },
        }));
      },

      getExecutionState: (nodeId: string) => {
        return get().executions[nodeId] || defaultExecutionState;
      },
    }),
    { name: 'node-execution-store' }
  )
);
