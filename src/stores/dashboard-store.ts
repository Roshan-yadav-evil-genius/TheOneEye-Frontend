import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { workflowApi } from '@/lib/api/services/workflow-api';
import { nodeApi } from '@/lib/api/services/node-api';
import { toastService } from '@/lib/services/toast-service';
import { extractErrorMessage } from '@/lib/services/store-error-handler';
import type { BackendWorkflow } from '@/lib/api/transformers/workflow-transformer';

/**
 * Dashboard Store
 * 
 * Single responsibility: Manages dashboard metrics state
 * - Fetches workflow data
 * - Calculates dashboard metrics (workflow count, nodes count, success rate)
 * - Manages loading and error states
 */

interface DashboardMetrics {
  workflowCount: number;
  nodesCount: number;
  successRate: number;
  workflowCountChange: string;
  nodesCountChange: string;
  successRateChange: string;
}

interface DashboardStoreState {
  // Metrics state
  metrics: DashboardMetrics | null;
  
  // Loading state
  isLoading: boolean;
  
  // Error state
  error: string | null;
  
  // Last fetch timestamp
  lastFetched: number | null;
}

interface DashboardStoreActions {
  // Load metrics from API
  loadMetrics: () => Promise<void>;
  
  // Refresh metrics (force reload)
  refreshMetrics: () => Promise<void>;
  
  // Clear error state
  clearError: () => void;
}

type DashboardStore = DashboardStoreState & DashboardStoreActions;

const initialMetrics: DashboardMetrics = {
  workflowCount: 0,
  nodesCount: 0,
  successRate: 0,
  workflowCountChange: '+0 from last month',
  nodesCountChange: '+0 from last week',
  successRateChange: '+0% from last month',
};

const initialState: DashboardStoreState = {
  metrics: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

/**
 * Calculate total available node types count
 * Fetches the list of available node types from the node registry
 */
async function calculateNodesCount(): Promise<number> {
  try {
    // Get flat list of all available node types
    const nodes = await nodeApi.getNodesFlat();
    return nodes.length;
  } catch (error) {
    // If we can't fetch nodes, return 0
    console.warn('Failed to fetch available nodes:', error);
    return 0;
  }
}

/**
 * Calculate success rate from workflows
 * For now, uses a placeholder calculation based on workflow status
 * In the future, this could be calculated from execution history
 */
function calculateSuccessRate(workflows: BackendWorkflow[]): number {
  if (workflows.length === 0) {
    return 0;
  }
  
  // Placeholder: count workflows with "active" or "completed" status as successful
  // In a real implementation, this would be calculated from execution history
  const successfulWorkflows = workflows.filter(
    (workflow) => workflow.status === 'active' || workflow.status === 'completed'
  ).length;
  
  return Math.round((successfulWorkflows / workflows.length) * 100 * 10) / 10;
}

/**
 * Generate change text for metrics
 * Placeholder implementation - in production, this would compare with historical data
 */
function generateChangeText(current: number, previous: number, unit: string = ''): string {
  const change = current - previous;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change}${unit} from last month`;
}

export const useDashboardStore = create<DashboardStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      loadMetrics: async () => {
        // Don't reload if already loading or recently fetched (within 30 seconds)
        const { isLoading, lastFetched } = get();
        const now = Date.now();
        const thirtySeconds = 30 * 1000;
        
        if (isLoading) {
          return;
        }
        
        if (lastFetched && (now - lastFetched) < thirtySeconds) {
          return;
        }
        
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });
        
        try {
          // Fetch all workflows
          const workflows = await workflowApi.getWorkflows();
          
          // Calculate metrics
          const workflowCount = workflows.length;
          const nodesCount = await calculateNodesCount();
          const successRate = calculateSuccessRate(workflows);
          
          // Generate change text (placeholder - using current values as baseline)
          const workflowCountChange = generateChangeText(workflowCount, Math.max(0, workflowCount - 2));
          const nodesCountChange = generateChangeText(nodesCount, Math.max(0, nodesCount - 5));
          const successRateChange = generateChangeText(successRate, Math.max(0, successRate - 0.5), '%');
          
          set((state) => {
            state.metrics = {
              workflowCount,
              nodesCount,
              successRate,
              workflowCountChange,
              nodesCountChange,
              successRateChange,
            };
            state.isLoading = false;
            state.error = null;
            state.lastFetched = now;
          });
        } catch (error) {
          const errorMessage = extractErrorMessage(error, 'Failed to load dashboard metrics');
          
          set((state) => {
            state.isLoading = false;
            state.error = errorMessage;
            state.metrics = initialMetrics;
          });
          
          toastService.error('Failed to load dashboard metrics', {
            description: errorMessage,
          });
        }
      },

      refreshMetrics: async () => {
        // Force refresh by clearing lastFetched
        set((state) => {
          state.lastFetched = null;
        });
        
        await get().loadMetrics();
      },

      clearError: () => {
        set((state) => {
          state.error = null;
        });
      },
    })),
    {
      name: 'dashboard-store',
    }
  )
);

