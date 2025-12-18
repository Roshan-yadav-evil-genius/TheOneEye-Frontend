import { axiosApiClient } from './axios-client';
import { 
  TWorkflow,
  TUser,
  TWorkflowConnection,
  TWorkflowCanvasData,
  TWorkflowNodeCreateRequest,
  TWorkflowConnectionCreateRequest,
  TWorkflowNodeCreateResponse,
  BackendWorkflowCanvasResponse,
  BackendUser,
  BackendWorkflowConnection,
  DemoRequest,
  DemoRequestCreateData
} from '@/types';

// Centralized API service that provides a clean interface for all API operations
export class ApiService {
  // Request deduplication map to prevent duplicate API calls
  private static pendingRequests = new Map<string, Promise<unknown>>();

  // Workflow operations
  static async getWorkflows(): Promise<TWorkflow[]> {
    return axiosApiClient.get<TWorkflow[]>('/workflow/');
  }

  static async createWorkflow(workflowData: Partial<TWorkflow>): Promise<TWorkflow> {
    return axiosApiClient.post<TWorkflow>('/workflow/', workflowData);
  }

  static async updateWorkflow(id: string, workflowData: Partial<TWorkflow>): Promise<TWorkflow> {
    return axiosApiClient.put<TWorkflow>(`/workflow/${id}/`, workflowData);
  }

  static async deleteWorkflow(id: string): Promise<void> {
    return axiosApiClient.delete<void>(`/workflow/${id}/`);
  }

  // Workflow Canvas Operations
  static async getWorkflowCanvasData(workflowId: string): Promise<TWorkflowCanvasData> {
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

  private static async makeWorkflowCanvasRequest(workflowId: string): Promise<TWorkflowCanvasData> {
    const response = await axiosApiClient.get<BackendWorkflowCanvasResponse>(`/workflow/${workflowId}/canvas_data/`);
    
    // Transform the response to match our types
    return {
      nodes: response.nodes,
      edges: response.edges,
      workflow: response.workflow
    };
  }


  static async addNodeToWorkflow(
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

  static async updateNodePosition(
    workflowId: string, 
    nodeId: string, 
    position: { x: number; y: number }
  ): Promise<void> {
    await axiosApiClient.patch(`/workflow/${workflowId}/update_node_position/`, {
      nodeId,
      position
    });
  }

  static async removeNodeFromWorkflow(workflowId: string, nodeId: string): Promise<void> {
    await axiosApiClient.delete(`/workflow/${workflowId}/remove_node/`, {
      data: { nodeId }
    });
  }

  static async addConnectionToWorkflow(
    workflowId: string, 
    connectionData: TWorkflowConnectionCreateRequest
  ): Promise<TWorkflowConnection> {
    const response = await axiosApiClient.post<BackendWorkflowConnection>(`/workflow/${workflowId}/add_connection/`, connectionData);
    return {
      id:response.id,
      source:response.source_node,
      target:response.target_node
    };
  }

  static async removeConnectionFromWorkflow(workflowId: string, connectionId: string): Promise<void> {
    await axiosApiClient.delete(`/workflow/${workflowId}/remove_connection/`, {
      data: { connectionId }
    });
  }

  static async updateNodeFormValues(
    workflowId: string, 
    nodeId: string, 
    formValues: Record<string, unknown>
  ): Promise<void> {
    await axiosApiClient.patch(`/workflow/${workflowId}/nodes/${nodeId}/`, {
      form_values: formValues
    });
  }

  static async executeSingleNode(workflowId: string, nodeId: string): Promise<{ task_id: string; status: string; message: string }> {
    const response = await axiosApiClient.post<{ task_id: string; status: string; message: string }>(`/workflow/${workflowId}/execute_single_node/`, {
      node_id: nodeId
    });
    return response;
  }

  static async stopDevMode(workflowId: string): Promise<{ task_id: string; status: string; message: string }> {
    const response = await axiosApiClient.post<{ task_id: string; status: string; message: string }>(`/workflow/${workflowId}/stop_dev_mode/`);
    return response;
  }

  static async getTaskStatus(taskId: string): Promise<{ state: string; result?: any; error?: string; progress?: number }> {
    const response = await axiosApiClient.get<{ state: string; result?: any; error?: string; progress?: number }>(`/celery/task/${taskId}/status/`);
    return response;
  }

  static async getDevContainerStatus(workflowId: string): Promise<{ exists: boolean; status: string; uptime?: number }> {
    const response = await axiosApiClient.get<{ exists: boolean; status: string; uptime?: number }>(`/workflow/${workflowId}/dev_container_status/`);
    return response;
  }

  static async startWorkflowExecution(workflowId: string): Promise<{ task_id: string; status: string }> {
    return axiosApiClient.get(`/workflow/${workflowId}/start_execution/`);
  }

  static async stopWorkflowExecution(workflowId: string): Promise<{ task_id: string; status: string }> {
    return axiosApiClient.get(`/workflow/${workflowId}/stop_execution/`);
  }

  static async getWorkflowTaskStatus(workflowId: string): Promise<{ task_id: string; status: string }> {
    return axiosApiClient.get(`/workflow/${workflowId}/task_status/`);
  }

  static async getNodeInputData(workflowId: string, nodeId: string): Promise<Record<string, unknown>> {
    return axiosApiClient.get<Record<string, unknown>>(`/workflow/${workflowId}/nodes/${nodeId}/input/`);
  }

  static async getNodeOutputData(workflowId: string, nodeId: string): Promise<Record<string, unknown>> {
    return axiosApiClient.get<Record<string, unknown>>(`/workflow/${workflowId}/nodes/${nodeId}/output/`);
  }


  // User operations
  static async getCurrentUser(): Promise<TUser | null> {
    try {
      // Check if we have a token in localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-store') : null;
      if (!token) {
        return null;
      }

      // Parse the token to check if it exists
      const authData = JSON.parse(token);
      if (!authData.state?.token) {
        return null;
      }

      const response = await axiosApiClient.get<BackendUser>('/auth/me/');
      return {
        id: response.id,
        name: response.name,
        email: response.email,
        avatar: response.avatar,
        role: response.role,
        permissions: response.permissions,
      };
    } catch (error) {
      return null;
    }
  }

  static async login(credentials: { username: string; password: string }): Promise<{ user: TUser; access: string; refresh: string }> {
    const response = await axiosApiClient.post<{ user: TUser; access: string; refresh: string }>('/auth/login/', credentials);
    return response;
  }

  static async logout(refreshToken?: string): Promise<void> {
    try {
      await axiosApiClient.post('/auth/logout/', { refresh: refreshToken });
    } catch (error) {
      // Ignore logout errors - user is logged out regardless
    }
  }

  static async register(userData: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
  }): Promise<{ user: TUser; access: string; refresh: string }> {
    const response = await axiosApiClient.post<{ user: TUser; access: string; refresh: string }>('/auth/register/', userData);
    return response;
  }

  static async refreshToken(refreshToken: string): Promise<{ access: string; refresh: string }> {
    const response = await axiosApiClient.post<{ access: string; refresh: string }>('/auth/refresh/', { refresh: refreshToken });
    return response;
  }

  // Demo Request operations
  static async createDemoRequest(demoData: DemoRequestCreateData): Promise<DemoRequest> {
    return axiosApiClient.post<DemoRequest>('/demo-requests/', demoData);
  }

  static async getDemoRequests(): Promise<DemoRequest[]> {
    return axiosApiClient.get<DemoRequest[]>('/demo-requests/');
  }

  static async getDemoRequest(id: string): Promise<DemoRequest> {
    return axiosApiClient.get<DemoRequest>(`/demo-requests/${id}/`);
  }

  static async updateDemoRequestStatus(id: string, status: string, notes?: string): Promise<DemoRequest> {
    return axiosApiClient.patch<DemoRequest>(`/demo-requests/${id}/update_status/`, {
      status,
      notes
    });
  }

  // Utility methods
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      // Use the workflow endpoint as a health check
      await axiosApiClient.get('/workflow/');
      return { status: 'ok', timestamp: new Date().toISOString() };
    } catch (error) {
      return { status: 'error', timestamp: new Date().toISOString() };
    }
  }

  static async getApiVersion(): Promise<{ version: string; build: string }> {
    return axiosApiClient.get<{ version: string; build: string }>('/version/');
  }
}

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
  executeSingleNode,
  startWorkflowExecution,
  stopWorkflowExecution,
  getWorkflowTaskStatus,
  getNodeInputData,
  getNodeOutputData,
  getCurrentUser,
  login,
  logout,
  register,
  refreshToken,
  createDemoRequest,
  getDemoRequests,
  getDemoRequest,
  updateDemoRequestStatus,
  healthCheck,
  getApiVersion,
} = ApiService;
