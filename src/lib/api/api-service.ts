import { axiosApiClient } from './axios-client';
import { 
  TNodeGroup,
  TNodeCreateData, 
  TNodeUpdateData, 
  TNodeFilters, 
  TPaginatedResponse,
  TNodeStats,
  TApiError,
  TWorkflow,
  TUser,
  TWorkflowNode,
  TWorkflowConnection,
  TWorkflowCanvasData,
  TWorkflowNodeCreateRequest,
  TWorkflowConnectionCreateRequest,
  TWorkflowNodePositionUpdateRequest,
  TWorkflowNodeCreateResponse,
  BackendNodeGroup,
  BackendWorkflowCanvasResponse,
  BackendUser,
  BackendAuthResponse,
  BackendNodeType,
  BackendWorkflowConnection
} from '@/types';

// Centralized API service that provides a clean interface for all API operations
export class ApiService {
  // Request deduplication map to prevent duplicate API calls
  private static pendingRequests = new Map<string, Promise<unknown>>();



  // Node operations
  static async getNodes(filters: TNodeFilters = {}): Promise<TPaginatedResponse<BackendNodeType>> {
    const response = await axiosApiClient.get<TPaginatedResponse<BackendNodeType> | BackendNodeType[]>('/nodes/', {
      params: filters,
    });
    
    // Handle both array and paginated response formats
    if (Array.isArray(response)) {
      return {
        count: response.length,
        next: null,
        previous: null,
        results: response,
      };
    }
    
    // Handle paginated response
    return response;
  }

  static async getNode(id: string): Promise<BackendNodeType> {
    const response = await axiosApiClient.get<BackendNodeType>(`/nodes/${id}/`);
    return response;
  }

  static async createNode(nodeData: TNodeCreateData): Promise<BackendNodeType> {
    const hasLogoFile = nodeData.logo instanceof File;
    
    if (hasLogoFile) {
      const formData = new FormData();
      
      // Keys already match backend - no transformation needed!
      Object.entries(nodeData).forEach(([key, value]) => {
        if (key === 'form_configuration' || key === 'tags') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'logo' && value instanceof File) {
          formData.append('logo', value);
        } else if (key === 'node_group') {
          // Handle node_group - extract ID if it's an object
          const groupId = typeof value === 'string' ? value : (value as BackendNodeGroup)?.id;
          if (groupId) formData.append('node_group', groupId);
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      return axiosApiClient.uploadFile<BackendNodeType>('/nodes/', formData);
    } else {
      // Ensure node_group is an ID string
      const dataToSend = {
        ...nodeData,
        node_group: typeof nodeData.node_group === 'string' ? nodeData.node_group : (nodeData.node_group as BackendNodeGroup)?.id
      };
      return axiosApiClient.post<BackendNodeType>('/nodes/', dataToSend);
    }
  }

  static async updateNode(id: string, nodeData: TNodeUpdateData): Promise<BackendNodeType> {
    // Ensure node_group is an ID string if present
    const dataToSend = {
      ...nodeData,
      node_group: nodeData.node_group 
        ? (typeof nodeData.node_group === 'string' ? nodeData.node_group : (nodeData.node_group as BackendNodeGroup).id)
        : undefined
    };
    return axiosApiClient.put<BackendNodeType>(`/nodes/${id}/`, dataToSend);
  }

  static async deleteNode(id: string): Promise<void> {
    return axiosApiClient.delete(`/nodes/${id}/`);
  }

  static async bulkCreateNodes(nodesData: TNodeCreateData[]): Promise<BackendNodeType[]> {
    const response = await axiosApiClient.post<BackendNodeType[]>('/nodes/bulk_create/', nodesData);
    return response;
  }

  static async bulkDeleteNodes(ids: string[]): Promise<void> {
    // This would need to be implemented on the backend
    // For now, we'll delete them one by one
    await Promise.all(ids.map(id => this.deleteNode(id)));
  }

  static async getNodeStats(): Promise<TNodeStats> {
    return axiosApiClient.get<TNodeStats>('/nodes/stats/');
  }

  // NodeGroup operations
  static async getNodeGroups(): Promise<BackendNodeGroup[]> {
    // Return backend type directly!
    return axiosApiClient.get<BackendNodeGroup[]>('/node-groups/');
  }

  static async getNodeGroup(id: string): Promise<BackendNodeGroup> {
    return axiosApiClient.get<BackendNodeGroup>(`/node-groups/${id}/`);
  }

  static async createNodeGroup(groupData: Partial<BackendNodeGroup>): Promise<BackendNodeGroup> {
    return axiosApiClient.post<BackendNodeGroup>('/node-groups/', groupData);
  }

  static async updateNodeGroup(id: string, groupData: Partial<BackendNodeGroup>): Promise<BackendNodeGroup> {
    return axiosApiClient.put<BackendNodeGroup>(`/node-groups/${id}/`, groupData);
  }

  static async deleteNodeGroup(id: string): Promise<void> {
    return axiosApiClient.delete(`/node-groups/${id}/`);
  }

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
    console.log('API: Updating node position', { workflowId, nodeId, position });
    try {
      await axiosApiClient.patch(`/workflow/${workflowId}/update_node_position/`, {
        nodeId,
        position
      });
      console.log('API: Node position updated successfully');
    } catch (error) {
      console.error('API: Failed to update node position:', error);
      throw error;
    }
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


  // User operations
  static async getCurrentUser(): Promise<TUser | null> {
    try {
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

  static async login(credentials: { email: string; password: string }): Promise<{ user: TUser; token: string }> {
    const response = await axiosApiClient.post<BackendAuthResponse>('/auth/login/', credentials);
    return {
      user: {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        avatar: response.user.avatar,
        role: response.user.role,
        permissions: response.user.permissions,
      },
      token: response.token,
    };
  }

  static async logout(): Promise<void> {
    try {
      await axiosApiClient.post('/auth/logout/');
    } catch (error) {
      // Ignore logout errors - user is logged out regardless
    }
  }

  // Utility methods
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      // Use the nodes endpoint as a health check since /health/ doesn't exist
      await axiosApiClient.get('/nodes/');
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
  getNodes,
  getNode,
  createNode,
  updateNode,
  deleteNode,
  bulkCreateNodes,
  bulkDeleteNodes,
  getNodeStats,
  getNodeGroups,
  getNodeGroup,
  createNodeGroup,
  updateNodeGroup,
  deleteNodeGroup,
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
  getCurrentUser,
  login,
  logout,
  healthCheck,
  getApiVersion,
} = ApiService;
