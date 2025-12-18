/**
 * @deprecated This file is deprecated. Import from '@/lib/api/services' instead.
 * 
 * This file is kept for backward compatibility and re-exports all API services
 * from their domain-specific modules.
 */

// Re-export everything from the new service modules
export * from './services';

// Import all services for the legacy ApiService class
import { workflowApi } from './services/workflow-api';
import { authApi } from './services/auth-api';
import { nodeApi } from './services/node-api';
import { demoApi } from './services/demo-api';
import { healthCheck, getApiVersion } from './services';

/**
 * @deprecated Use domain-specific API services instead:
 * - workflowApi for workflow operations
 * - authApi for authentication operations
 * - nodeApi for node registry operations
 * - demoApi for demo request operations
 */
export class ApiService {
  // Workflow operations
  static getWorkflows = workflowApi.getWorkflows.bind(workflowApi);
  static createWorkflow = workflowApi.createWorkflow.bind(workflowApi);
  static updateWorkflow = workflowApi.updateWorkflow.bind(workflowApi);
  static deleteWorkflow = workflowApi.deleteWorkflow.bind(workflowApi);
  static getWorkflowCanvasData = workflowApi.getWorkflowCanvasData.bind(workflowApi);
  static addNodeToWorkflow = workflowApi.addNodeToWorkflow.bind(workflowApi);
  static updateNodePosition = workflowApi.updateNodePosition.bind(workflowApi);
  static removeNodeFromWorkflow = workflowApi.removeNodeFromWorkflow.bind(workflowApi);
  static addConnectionToWorkflow = workflowApi.addConnectionToWorkflow.bind(workflowApi);
  static removeConnectionFromWorkflow = workflowApi.removeConnectionFromWorkflow.bind(workflowApi);
  static updateNodeFormValues = workflowApi.updateNodeFormValues.bind(workflowApi);
  static getTaskStatus = workflowApi.getTaskStatus.bind(workflowApi);
  static startWorkflowExecution = workflowApi.startWorkflowExecution.bind(workflowApi);
  static stopWorkflowExecution = workflowApi.stopWorkflowExecution.bind(workflowApi);
  static getWorkflowTaskStatus = workflowApi.getWorkflowTaskStatus.bind(workflowApi);
  static getNodeInputData = workflowApi.getNodeInputData.bind(workflowApi);
  static getNodeOutputData = workflowApi.getNodeOutputData.bind(workflowApi);

  // Auth operations
  static getCurrentUser = authApi.getCurrentUser.bind(authApi);
  static login = authApi.login.bind(authApi);
  static logout = authApi.logout.bind(authApi);
  static register = authApi.register.bind(authApi);
  static refreshToken = authApi.refreshToken.bind(authApi);

  // Node operations
  static getNodes = nodeApi.getNodes.bind(nodeApi);
  static getNodesFlat = nodeApi.getNodesFlat.bind(nodeApi);
  static getNodesCount = nodeApi.getNodesCount.bind(nodeApi);
  static getNodeDetail = nodeApi.getNodeDetail.bind(nodeApi);
  static getNodeForm = nodeApi.getNodeForm.bind(nodeApi);
  static executeNode = nodeApi.executeNode.bind(nodeApi);
  static getNodeFieldOptions = nodeApi.getNodeFieldOptions.bind(nodeApi);
  static refreshNodeCache = nodeApi.refreshNodeCache.bind(nodeApi);

  // Demo operations
  static createDemoRequest = demoApi.createDemoRequest.bind(demoApi);
  static getDemoRequests = demoApi.getDemoRequests.bind(demoApi);
  static getDemoRequest = demoApi.getDemoRequest.bind(demoApi);
  static updateDemoRequestStatus = demoApi.updateDemoRequestStatus.bind(demoApi);

  // Utility operations
  static healthCheck = healthCheck;
  static getApiVersion = getApiVersion;
}
