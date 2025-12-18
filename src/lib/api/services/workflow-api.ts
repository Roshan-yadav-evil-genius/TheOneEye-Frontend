import { axiosApiClient } from '../axios-client';
import { 
  TWorkflow,
  TWorkflowConnection,
  TWorkflowCanvasData,
  TWorkflowNodeCreateRequest,
  TWorkflowConnectionCreateRequest,
  TWorkflowNodeCreateResponse,
  BackendWorkflowCanvasResponse,
  BackendWorkflowConnection,
} from '@/types';

/**
 * Workflow API Service
 * Handles all workflow-related API operations including CRUD, canvas, and execution
 */
class WorkflowApiService {
  // Request deduplication map to prevent duplicate API calls
  private pendingRequests = new Map<string, Promise<unknown>>();

  // Workflow CRUD operations
  async getWorkflows(): Promise<TWorkflow[]> {
    return axiosApiClient.get<TWorkflow[]>('/workflow/');
  }

  async createWorkflow(workflowData: Partial<TWorkflow>): Promise<TWorkflow> {
    return axiosApiClient.post<TWorkflow>('/workflow/', workflowData);
  }

  async updateWorkflow(id: string, workflowData: Partial<TWorkflow>): Promise<TWorkflow> {
    return axiosApiClient.put<TWorkflow>(`/workflow/${id}/`, workflowData);
  }

  async deleteWorkflow(id: string): Promise<void> {
    return axiosApiClient.delete<void>(`/workflow/${id}/`);
  }

  // Workflow Canvas Operations
  async getWorkflowCanvasData(workflowId: string): Promise<TWorkflowCanvasData> {
    const requestKey = `workflow-canvas-${workflowId}`;
    
    // Return existing promise if request is already in progress
    if (this.pendingRequests.has(requestKey)) {
      return this.pendingRequests.get(requestKey)! as Promise<TWorkflowCanvasData>;
    }
    
    const requestPromise = this.makeWorkflowCanvasRequest(workflowId);
    this.pendingRequests.set(requestKey, requestPromise);
    
    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(requestKey);
    }
  }

  private async makeWorkflowCanvasRequest(workflowId: string): Promise<TWorkflowCanvasData> {
    const response = await axiosApiClient.get<BackendWorkflowCanvasResponse>(`/workflow/${workflowId}/canvas_data/`);
    
    // Transform the response to match our types
    return {
      nodes: response.nodes,
      edges: response.edges,
      workflow: response.workflow
    };
  }

  async addNodeToWorkflow(
    workflowId: string, 
    nodeData: TWorkflowNodeCreateRequest
  ): Promise<TWorkflowNodeCreateResponse> {
    const response = await axiosApiClient.post<TWorkflowNodeCreateResponse>(`/workflow/${workflowId}/add_node/`, nodeData);
    
    return {
      id: response.id,
      position: response.position,
      form_values: response.form_values,
      node_type: response.node_type
    };
  }

  async updateNodePosition(
    workflowId: string, 
    nodeId: string, 
    position: { x: number; y: number }
  ): Promise<void> {
    await axiosApiClient.patch(`/workflow/${workflowId}/update_node_position/`, {
      nodeId,
      position
    });
  }

  async removeNodeFromWorkflow(workflowId: string, nodeId: string): Promise<void> {
    await axiosApiClient.delete(`/workflow/${workflowId}/remove_node/`, {
      data: { nodeId }
    });
  }

  async addConnectionToWorkflow(
    workflowId: string, 
    connectionData: TWorkflowConnectionCreateRequest
  ): Promise<TWorkflowConnection> {
    const response = await axiosApiClient.post<BackendWorkflowConnection>(`/workflow/${workflowId}/add_connection/`, connectionData);
    return {
      id: response.id,
      source: response.source_node,
      target: response.target_node
    };
  }

  async removeConnectionFromWorkflow(workflowId: string, connectionId: string): Promise<void> {
    await axiosApiClient.delete(`/workflow/${workflowId}/remove_connection/`, {
      data: { connectionId }
    });
  }

  async updateNodeFormValues(
    workflowId: string, 
    nodeId: string, 
    formValues: Record<string, unknown>
  ): Promise<void> {
    await axiosApiClient.patch(`/workflow/${workflowId}/nodes/${nodeId}/`, {
      form_values: formValues
    });
  }

  // Workflow Execution Operations
  async executeSingleNode(workflowId: string, nodeId: string): Promise<{ task_id: string; status: string; message: string }> {
    const response = await axiosApiClient.post<{ task_id: string; status: string; message: string }>(`/workflow/${workflowId}/execute_single_node/`, {
      node_id: nodeId
    });
    return response;
  }

  async stopDevMode(workflowId: string): Promise<{ task_id: string; status: string; message: string }> {
    const response = await axiosApiClient.post<{ task_id: string; status: string; message: string }>(`/workflow/${workflowId}/stop_dev_mode/`);
    return response;
  }

  async getTaskStatus(taskId: string): Promise<{ state: string; result?: unknown; error?: string; progress?: number }> {
    const response = await axiosApiClient.get<{ state: string; result?: unknown; error?: string; progress?: number }>(`/celery/task/${taskId}/status/`);
    return response;
  }

  async getDevContainerStatus(workflowId: string): Promise<{ exists: boolean; status: string; uptime?: number }> {
    const response = await axiosApiClient.get<{ exists: boolean; status: string; uptime?: number }>(`/workflow/${workflowId}/dev_container_status/`);
    return response;
  }

  async startWorkflowExecution(workflowId: string): Promise<{ task_id: string; status: string }> {
    return axiosApiClient.get(`/workflow/${workflowId}/start_execution/`);
  }

  async stopWorkflowExecution(workflowId: string): Promise<{ task_id: string; status: string }> {
    return axiosApiClient.get(`/workflow/${workflowId}/stop_execution/`);
  }

  async getWorkflowTaskStatus(workflowId: string): Promise<{ task_id: string; status: string }> {
    return axiosApiClient.get(`/workflow/${workflowId}/task_status/`);
  }

  async getNodeInputData(workflowId: string, nodeId: string): Promise<Record<string, unknown>> {
    return axiosApiClient.get<Record<string, unknown>>(`/workflow/${workflowId}/nodes/${nodeId}/input/`);
  }

  async getNodeOutputData(workflowId: string, nodeId: string): Promise<Record<string, unknown>> {
    return axiosApiClient.get<Record<string, unknown>>(`/workflow/${workflowId}/nodes/${nodeId}/output/`);
  }
}

// Export singleton instance
export const workflowApi = new WorkflowApiService();

// Export individual methods for easier importing
export const {
  getWorkflows,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  getWorkflowCanvasData,
  addNodeToWorkflow,
  updateNodePosition,
  removeNodeFromWorkflow,
  addConnectionToWorkflow,
  removeConnectionFromWorkflow,
  updateNodeFormValues,
  executeSingleNode,
  stopDevMode,
  getTaskStatus,
  getDevContainerStatus,
  startWorkflowExecution,
  stopWorkflowExecution,
  getWorkflowTaskStatus,
  getNodeInputData,
  getNodeOutputData,
} = workflowApi;

