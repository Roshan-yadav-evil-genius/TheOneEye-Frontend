/**
 * Node Compatibility Utilities
 * 
 * Single responsibility: Checking node compatibility with workflow types.
 */
import { TNodeMetadata } from '@/types/node';
import { WorkflowType, WORKFLOW_TYPE_LABELS } from '@/types/common/constants';

/**
 * Check if a node is compatible with a specific workflow type.
 * 
 * @param node - Node metadata to check
 * @param workflowType - Workflow type to check compatibility with
 * @returns true if the node is compatible with the workflow type
 */
export function isNodeCompatibleWithWorkflowType(
  node: TNodeMetadata,
  workflowType: WorkflowType
): boolean {
  // If no supported_workflow_types defined, assume all types supported (backward compatibility)
  if (!node.supported_workflow_types || node.supported_workflow_types.length === 0) {
    return true;
  }
  
  return node.supported_workflow_types.includes(workflowType);
}

/**
 * Filter nodes to only include those compatible with a workflow type.
 * 
 * @param nodes - Array of node metadata to filter
 * @param workflowType - Workflow type to filter by
 * @returns Array of nodes compatible with the workflow type
 */
export function getCompatibleNodes(
  nodes: TNodeMetadata[],
  workflowType: WorkflowType
): TNodeMetadata[] {
  return nodes.filter(node => isNodeCompatibleWithWorkflowType(node, workflowType));
}

/**
 * Get nodes that are incompatible with a workflow type.
 * 
 * @param nodes - Array of node metadata to filter
 * @param workflowType - Workflow type to check against
 * @returns Array of nodes incompatible with the workflow type
 */
export function getIncompatibleNodes(
  nodes: TNodeMetadata[],
  workflowType: WorkflowType
): TNodeMetadata[] {
  return nodes.filter(node => !isNodeCompatibleWithWorkflowType(node, workflowType));
}

/**
 * Get a human-readable message explaining why a node is incompatible.
 * 
 * @param node - Node metadata
 * @param workflowType - Workflow type the node is incompatible with
 * @returns Human-readable incompatibility message
 */
export function getNodeCompatibilityMessage(
  node: TNodeMetadata,
  workflowType: WorkflowType
): string {
  if (isNodeCompatibleWithWorkflowType(node, workflowType)) {
    return `Compatible with ${WORKFLOW_TYPE_LABELS[workflowType]}`;
  }
  
  const supportedTypes = node.supported_workflow_types || [];
  if (supportedTypes.length === 0) {
    return `Compatible with all workflow types`;
  }
  
  const supportedLabels = supportedTypes
    .map(type => WORKFLOW_TYPE_LABELS[type as WorkflowType] || type)
    .join(', ');
  
  return `Only compatible with: ${supportedLabels}`;
}

/**
 * Get the list of workflow types a node supports as labels.
 * 
 * @param node - Node metadata
 * @returns Array of workflow type labels the node supports
 */
export function getNodeSupportedWorkflowTypeLabels(node: TNodeMetadata): string[] {
  if (!node.supported_workflow_types || node.supported_workflow_types.length === 0) {
    // All types supported
    return Object.values(WORKFLOW_TYPE_LABELS);
  }
  
  return node.supported_workflow_types.map(
    type => WORKFLOW_TYPE_LABELS[type as WorkflowType] || type
  );
}

/**
 * Check if all nodes in a list are compatible with a workflow type.
 * 
 * @param nodes - Array of node metadata to check
 * @param workflowType - Workflow type to check compatibility with
 * @returns true if all nodes are compatible
 */
export function areAllNodesCompatible(
  nodes: TNodeMetadata[],
  workflowType: WorkflowType
): boolean {
  return nodes.every(node => isNodeCompatibleWithWorkflowType(node, workflowType));
}
