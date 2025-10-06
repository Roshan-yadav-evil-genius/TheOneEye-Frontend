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
  BackendNodeType
} from '@/types';

// Centralized API service that provides a clean interface for all API operations
export class ApiService {
  // Request deduplication map to prevent duplicate API calls
  private static pendingRequests = new Map<string, Promise<unknown>>();


  // Helper function to transform frontend node data to backend format
  private static transformToBackendFormat(frontendNode: TNodeCreateData): Partial<BackendNodeType> {
    return {
      name: frontendNode.name,
      type: frontendNode.type,
      node_group: frontendNode.nodeGroup,
      description: frontendNode.description,
      version: frontendNode.version,
      is_active: frontendNode.isActive,
      form_configuration: frontendNode.formConfiguration,
      tags: frontendNode.tags,
      logo: frontendNode.logo,
    };
  }

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
    const hasLogoFile = nodeData.logoFile instanceof File;
    
    
    if (hasLogoFile) {
      const formData = new FormData();
      
      // Transform to backend format first, then add to FormData
      const backendData = this.transformToBackendFormat(nodeData);
      
      // Add all fields to FormData with correct backend field names
      Object.entries(backendData).forEach(([key, value]) => {
        if (key === 'form_configuration' || key === 'tags') {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      // Add the logo file with the correct field name
      if (nodeData.logoFile instanceof File) {
        formData.append('logo', nodeData.logoFile);
      }
      
      
      const response = await axiosApiClient.uploadFile<BackendNodeType>('/nodes/', formData);
      return response;
    } else {
      const response = await axiosApiClient.post<BackendNodeType>('/nodes/', nodeData);
      return response;
    }
  }

  static async updateNode(id: string, nodeData: TNodeUpdateData): Promise<BackendNodeType> {
    const response = await axiosApiClient.put<BackendNodeType>(`/nodes/${id}/`, nodeData);
    return response;
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
  static async getNodeGroups(): Promise<TNodeGroup[]> {
    const response = await axiosApiClient.get<BackendNodeGroup[]>('/node-groups/');
    return response.map((group) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      icon: group.icon,
      isActive: group.is_active,
      createdAt: group.created_at,
      updatedAt: group.updated_at,
    }));
  }

  static async getNodeGroup(id: string): Promise<TNodeGroup> {
    const response = await axiosApiClient.get<BackendNodeGroup>(`/node-groups/${id}/`);
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      icon: response.icon,
      isActive: response.is_active,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
    };
  }

  static async createNodeGroup(groupData: Partial<TNodeGroup>): Promise<TNodeGroup> {
    const backendData = {
      name: groupData.name,
      description: groupData.description,
      icon: groupData.icon,
      is_active: groupData.isActive,
    };
    const response = await axiosApiClient.post<BackendNodeGroup>('/node-groups/', backendData);
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      icon: response.icon,
      isActive: response.is_active,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
    };
  }

  static async updateNodeGroup(id: string, groupData: Partial<TNodeGroup>): Promise<TNodeGroup> {
    const backendData = {
      name: groupData.name,
      description: groupData.description,
      icon: groupData.icon,
      is_active: groupData.isActive,
    };
    const response = await axiosApiClient.put<BackendNodeGroup>(`/node-groups/${id}/`, backendData);
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      icon: response.icon,
      isActive: response.is_active,
      createdAt: response.created_at,
      updatedAt: response.updated_at,
    };
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
      data: response.data,
      node_type: response.node_type // Updated to use node_type instead of node_template
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
    const response = await axiosApiClient.post<TWorkflowConnection>(`/workflow/${workflowId}/add_connection/`, connectionData);
    
    return {
      id: response.id,
      source: response.source,
      target: response.target,
      sourceHandle: undefined,
      targetHandle: undefined,
    };
  }

  static async removeConnectionFromWorkflow(workflowId: string, connectionId: string): Promise<void> {
    await axiosApiClient.delete(`/workflow/${workflowId}/remove_connection/`, {
      data: { connectionId }
    });
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
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getCurrentUser,
  login,
  logout,
  healthCheck,
  getApiVersion,
} = ApiService;
