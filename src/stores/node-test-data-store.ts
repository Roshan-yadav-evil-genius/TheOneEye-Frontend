import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

// Data structure for each node's persisted test data
interface NodeTestSession {
  inputData: Record<string, unknown>;
  formData: Record<string, string>;
}

interface NodeTestDataState {
  // Map of node identifier to test session data
  sessions: Record<string, NodeTestSession>;
}

interface NodeTestDataActions {
  // Get full session for a node
  getSession: (nodeIdentifier: string) => NodeTestSession;
  
  // Input data
  getInputData: (nodeIdentifier: string) => Record<string, unknown>;
  setInputData: (nodeIdentifier: string, data: Record<string, unknown>) => void;
  
  // Form data
  getFormData: (nodeIdentifier: string) => Record<string, string>;
  setFormData: (nodeIdentifier: string, data: Record<string, string>) => void;
  
  // Clear operations
  clearSession: (nodeIdentifier: string) => void;
  clearAllSessions: () => void;
}

type NodeTestDataStore = NodeTestDataState & NodeTestDataActions;

const emptySession: NodeTestSession = {
  inputData: {},
  formData: {},
};

const initialState: NodeTestDataState = {
  sessions: {},
};

export const useNodeTestDataStore = create<NodeTestDataStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        getSession: (nodeIdentifier: string) => {
          const { sessions } = get();
          return sessions[nodeIdentifier] || { ...emptySession };
        },

        getInputData: (nodeIdentifier: string) => {
          const { sessions } = get();
          return sessions[nodeIdentifier]?.inputData || {};
        },

        setInputData: (nodeIdentifier: string, data: Record<string, unknown>) => {
          set((state) => ({
            sessions: {
              ...state.sessions,
              [nodeIdentifier]: {
                ...emptySession,
                ...state.sessions[nodeIdentifier],
                inputData: data,
              },
            },
          }));
        },

        getFormData: (nodeIdentifier: string) => {
          const { sessions } = get();
          return sessions[nodeIdentifier]?.formData || {};
        },

        setFormData: (nodeIdentifier: string, data: Record<string, string>) => {
          set((state) => ({
            sessions: {
              ...state.sessions,
              [nodeIdentifier]: {
                ...emptySession,
                ...state.sessions[nodeIdentifier],
                formData: data,
              },
            },
          }));
        },

        clearSession: (nodeIdentifier: string) => {
          set((state) => {
            const newSessions = { ...state.sessions };
            delete newSessions[nodeIdentifier];
            return { sessions: newSessions };
          });
        },

        clearAllSessions: () => {
          set({ sessions: {} });
        },
      }),
      {
        name: 'node-test-data', // localStorage key
      }
    ),
    {
      name: 'node-test-data-store',
    }
  )
);
