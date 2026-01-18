// Common constants and type definitions
export const nodeTypes = ['trigger', 'action', 'logic', 'system'] as const;

export type TNodeTypeEnum = typeof nodeTypes[number];

/**
 * Workflow type enum defining different workflow execution modes.
 * Must match backend WorkflowType enum in apps/workflow/models.py
 */
export enum WorkflowType {
  PRODUCTION = 'production',
  API = 'api'
}

/**
 * Human-readable labels for workflow types
 */
export const WORKFLOW_TYPE_LABELS: Record<WorkflowType, string> = {
  [WorkflowType.PRODUCTION]: 'Production Workflow',
  [WorkflowType.API]: 'API Workflow'
};

/**
 * Descriptions for each workflow type
 */
export const WORKFLOW_TYPE_DESCRIPTIONS: Record<WorkflowType, string> = {
  [WorkflowType.PRODUCTION]: 'Continuous workflows that run in a loop, processing data from queues or triggers.',
  [WorkflowType.API]: 'Request-response workflows triggered via API calls with bounded execution time.'
};

/**
 * Icons for each workflow type (Tabler icon names)
 */
export const WORKFLOW_TYPE_ICONS: Record<WorkflowType, string> = {
  [WorkflowType.PRODUCTION]: 'IconRefresh',
  [WorkflowType.API]: 'IconApi'
};
