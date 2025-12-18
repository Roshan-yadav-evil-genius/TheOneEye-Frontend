import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface NodeTestDataState {
  // Map of node identifier to test input data
  testData: Record<string, Record<string, unknown>>;
}

interface NodeTestDataActions {
  // Get test data for a specific node
  getTestData: (nodeIdentifier: string) => Record<string, unknown>;
  // Set test data for a specific node
  setTestData: (nodeIdentifier: string, data: Record<string, unknown>) => void;
  // Clear test data for a specific node
  clearTestData: (nodeIdentifier: string) => void;
  // Clear all test data
  clearAllTestData: () => void;
}

type NodeTestDataStore = NodeTestDataState & NodeTestDataActions;

const initialState: NodeTestDataState = {
  testData: {},
};

export const useNodeTestDataStore = create<NodeTestDataStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        getTestData: (nodeIdentifier: string) => {
          const { testData } = get();
          return testData[nodeIdentifier] || {};
        },

        setTestData: (nodeIdentifier: string, data: Record<string, unknown>) => {
          set((state) => ({
            testData: {
              ...state.testData,
              [nodeIdentifier]: data,
            },
          }));
        },

        clearTestData: (nodeIdentifier: string) => {
          set((state) => {
            const newTestData = { ...state.testData };
            delete newTestData[nodeIdentifier];
            return { testData: newTestData };
          });
        },

        clearAllTestData: () => {
          set({ testData: {} });
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

