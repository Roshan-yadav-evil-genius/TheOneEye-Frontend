/**
 * @deprecated Import from '@/stores/workflow' or '@/stores' instead.
 * 
 * This file is kept for backward compatibility.
 * The workflow store has been split into:
 * - workflow-list-store.ts (CRUD operations)
 * - workflow-canvas-store.ts (canvas state)
 * - workflow-selection-store.ts (selection state)
 * - workflow-execution-store.ts (execution state)
 */
export { 
  useWorkflowListStore as useTWorkflowStore,
  workflowListSelectors 
} from './workflow/workflow-list-store';
