import { axiosApiClient } from './axios-client';
import { 
  TNode,
  TNodeGroup,
  TNodeCreateData, 
  TNodeUpdateData, 
  TNodeFilters, 
  TPaginatedResponse,
  TNodeStats,
  TApiError,
  TWorkflow,
  TProject,
  TUser,
  TWorkflowNode,
  TWorkflowConnection,
  TWorkflowCanvasData,
  TWorkflowNodeCreateRequest,
  TWorkflowConnectionCreateRequest,
  TWorkflowNodePositionUpdateRequest,
  TWorkflowNodeCreateResponse,
  BackendNode,
  BackendNodeGroup,
  BackendWorkflowCanvasResponse,
  BackendProject,
  BackendUser,
  BackendAuthResponse
} from '@/types';

// Centralized API service that provides a clean interface for all API operations
export class ApiService {
  // Request deduplication map to prevent duplicate API calls
  private static pendingRequests = new Map<string, Promise<unknown>>();
  // Helper function to transform backend node data to frontend format
  private static transformNodeData(backendNode: BackendNode): TNode {
    return {
      id: backendNode.id,
      name: backendNode.name,
      type: backendNode.type,
      nodeGroup: backendNode.node_group,
      nodeGroupName: backendNode.node_group_name,
      nodeGroupIcon: backendNode.node_group_icon,
      description: backendNode.description || '',
      version: backendNode.version || '1.0.0',
      isActive: backendNode.is_active,
      createdAt: backendNode.created_at,
      updatedAt: backendNode.updated_at,
      createdBy: backendNode.created_by || 'Unknown',
      formConfiguration: backendNode.form_configuration || {},
      tags: backendNode.tags || [],
      logo: backendNode.logo,
    };
  }

  // Helper function to transform frontend node data to backend format
  private static transformToBackendFormat(frontendNode: TNodeCreateData): Partial<BackendNode> {
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
  static async getNodes(filters: TNodeFilters = {}): Promise<TPaginatedResponse<TNode>> {
    const response = await axiosApiClient.get<TPaginatedResponse<BackendNode> | BackendNode[]>('/nodes/', {
      params: filters,
    });
    
    // Handle both array and paginated response formats
    if (Array.isArray(response)) {
      const transformedNodes = response.map(node => this.transformNodeData(node));
      return {
        count: transformedNodes.length,
        next: null,
        previous: null,
        results: transformedNodes,
      };
    }
    
    // Handle paginated response
    return {
      count: response.count,
      next: response.next,
      previous: response.previous,
      results: response.results.map((node) => this.transformNodeData(node)),
    };
  }

  static async getNode(id: string): Promise<TNode> {
    const response = await axiosApiClient.get<BackendNode>(`/nodes/${id}/`);
    return this.transformNodeData(response);
  }

  static async createNode(nodeData: TNodeCreateData): Promise<TNode> {
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
      
      
      const response = await axiosApiClient.uploadFile<BackendNode>('/nodes/', formData);
      return this.transformNodeData(response);
    } else {
      const backendData = this.transformToBackendFormat(nodeData);
      
      const response = await axiosApiClient.post<BackendNode>('/nodes/', backendData);
      return this.transformNodeData(response);
    }
  }

  static async updateNode(id: string, nodeData: TNodeUpdateData): Promise<TNode> {
    const backendData = this.transformToBackendFormat(nodeData);
    const response = await axiosApiClient.put<BackendNode>(`/nodes/${id}/`, backendData);
    return this.transformNodeData(response);
  }

  static async deleteNode(id: string): Promise<void> {
    return axiosApiClient.delete(`/nodes/${id}/`);
  }

  static async bulkCreateNodes(nodesData: TNodeCreateData[]): Promise<TNode[]> {
    const response = await axiosApiClient.post<any[]>('/nodes/bulk_create/', nodesData);
    return response.map(node => this.transformNodeData(node));
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
    await axiosApiClient.put(`/workflow/${workflowId}/update_node_position/`, {
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
    const response = await axiosApiClient.post<TWorkflowConnection>(`/workflow/${workflowId}/add_connection/`, connectionData);
    
    return {
      id: response.id,
      sourceNodeId: response.source_node,
      targetNodeId: response.target_node,
      sourceHandle: undefined,
      targetHandle: undefined,
    };
  }

  static async removeConnectionFromWorkflow(workflowId: string, connectionId: string): Promise<void> {
    await axiosApiClient.delete(`/workflow/${workflowId}/remove_connection/`, {
      data: { connectionId }
    });
  }

  // Project operations
  static async getProjects(): Promise<TProject[]> {
    const response = await axiosApiClient.get<BackendProject[]>('/projects/');
    return response.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status as TProject['status'],
      workflows: project.workflows,
      team: project.team,
      createdAt: new Date(project.created_at),
      updatedAt: new Date(project.updated_at),
      createdBy: project.created_by,
    }));
  }

  static async createProject(projectData: Partial<TProject>): Promise<TProject> {
    const backendData = {
      name: projectData.name,
      description: projectData.description,
      status: projectData.status,
      workflows: projectData.workflows || [],
      team: projectData.team || [],
    };
    const response = await axiosApiClient.post<BackendProject>('/projects/', backendData);
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      status: response.status as TProject['status'],
      workflows: response.workflows,
      team: response.team,
      createdAt: new Date(response.created_at),
      updatedAt: new Date(response.updated_at),
      createdBy: response.created_by,
    };
  }

  static async updateProject(id: string, projectData: Partial<TProject>): Promise<TProject> {
    const backendData = {
      name: projectData.name,
      description: projectData.description,
      status: projectData.status,
      workflows: projectData.workflows,
      team: projectData.team,
    };
    const response = await axiosApiClient.put<BackendProject>(`/projects/${id}/`, backendData);
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      status: response.status as TProject['status'],
      workflows: response.workflows,
      team: response.team,
      createdAt: new Date(response.created_at),
      updatedAt: new Date(response.updated_at),
      createdBy: response.created_by,
    };
  }

  static async deleteProject(id: string): Promise<void> {
    return axiosApiClient.delete(`/projects/${id}/`);
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
