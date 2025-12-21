/**
 * useNodeSession Hook
 * 
 * Single Responsibility: Manages node execution session IDs.
 * Handles session ID generation and lifecycle management.
 */

import { useMemo } from 'react';

export interface WorkflowSessionContext {
  workflowId: string;
  nodeInstanceId: string;
}

/**
 * Get or create a single node execution ID (stored in localStorage)
 * Used to generate deterministic session IDs for standalone mode
 */
function getSingleNodeExecutionId(): string {
  const key = 'single_node_execution_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = `sne_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

/**
 * Generate a deterministic session ID based on context
 */
function generateSessionId(
  nodeIdentifier: string,
  workflowContext?: WorkflowSessionContext
): string {
  if (workflowContext) {
    // Workflow mode: use workflow_id + node_instance_id
    return `${workflowContext.workflowId}_${workflowContext.nodeInstanceId}`;
  }
  // Standalone mode: use single_node_execution_id + node_identifier
  return `${getSingleNodeExecutionId()}_${nodeIdentifier}`;
}

/**
 * Hook for managing node execution sessions
 */
export function useNodeSession(
  nodeIdentifier: string,
  workflowContext?: WorkflowSessionContext
) {
  const sessionId = useMemo(
    () => generateSessionId(nodeIdentifier, workflowContext),
    [nodeIdentifier, workflowContext?.workflowId, workflowContext?.nodeInstanceId]
  );

  return {
    sessionId,
    isWorkflowMode: !!workflowContext,
  };
}

