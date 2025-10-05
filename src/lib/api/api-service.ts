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
  TUser
} from '@/types';

// Centralized API service that provides a clean interface for all API operations
export class ApiService {
  // Helper function to transform backend node data to frontend format
  private static transformNodeData(backendNode: any): TNode {
    return {
      id: backendNode.id,
      name: backendNode.name,
      type: backendNode.type,
      category: backendNode.category, // Keep for backward compatibility
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
  private static transformToBackendFormat(frontendNode: any): any {
    return {
      name: frontendNode.name,
      type: frontendNode.type,
      category: frontendNode.category, // Keep for backward compatibility
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
    const response = await axiosApiClient.get<any>('/nodes/', {
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
      results: response.results.map((node: any) => this.transformNodeData(node)),
    };
  }

  static async getNode(id: string): Promise<TNode> {
    const response = await axiosApiClient.get<any>(`/nodes/${id}/`);
    return this.transformNodeData(response);
  }

  static async createNode(nodeData: TNodeCreateData): Promise<TNode> {
    const hasLogoFile = nodeData.logoFile instanceof File;
    
    if (hasLogoFile) {
      const formData = new FormData();
      
      // Add all fields to FormData
      Object.entries(nodeData).forEach(([key, value]) => {
        if (key === 'logoFile' && value instanceof File) {
          formData.append('logo', value);
        } else if (key === 'formConfiguration' || key === 'tags') {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      const response = await axiosApiClient.uploadFile<any>('/nodes/', formData);
      return this.transformNodeData(response);
    } else {
      const backendData = this.transformToBackendFormat(nodeData);
      const response = await axiosApiClient.post<any>('/nodes/', backendData);
      return this.transformNodeData(response);
    }
  }

  static async updateNode(id: string, nodeData: TNodeUpdateData): Promise<TNode> {
    const backendData = this.transformToBackendFormat(nodeData);
    const response = await axiosApiClient.put<any>(`/nodes/${id}/`, backendData);
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
    const response = await axiosApiClient.get<any[]>('/node-groups/');
    return response.map((group: any) => ({
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
    const response = await axiosApiClient.get<any>(`/node-groups/${id}/`);
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
    const response = await axiosApiClient.post<any>('/node-groups/', backendData);
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
    const response = await axiosApiClient.put<any>(`/node-groups/${id}/`, backendData);
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

  // Project operations (placeholder for future implementation)
  static async getProjects(): Promise<TProject[]> {
    // TODO: Implement when backend is ready
    return Promise.resolve([]);
  }

  static async createProject(projectData: Partial<TProject>): Promise<TProject> {
    // TODO: Implement when backend is ready
    return Promise.resolve(projectData);
  }

  static async updateProject(id: string, projectData: Partial<TProject>): Promise<TProject> {
    // TODO: Implement when backend is ready
    return Promise.resolve(projectData as TProject);
  }

  static async deleteProject(id: string): Promise<void> {
    // TODO: Implement when backend is ready
    return Promise.resolve();
  }

  // User operations (placeholder for future implementation)
  static async getCurrentUser(): Promise<TUser | null> {
    // TODO: Implement when backend is ready
    return Promise.resolve(null);
  }

  static async login(credentials: { email: string; password: string }): Promise<{ user: TUser; token: string }> {
    // TODO: Implement when backend is ready
    return Promise.resolve({
      user: { id: '1', name: 'User', email: credentials.email },
      token: 'mock-token'
    });
  }

  static async logout(): Promise<void> {
    // TODO: Implement when backend is ready
    return Promise.resolve();
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
