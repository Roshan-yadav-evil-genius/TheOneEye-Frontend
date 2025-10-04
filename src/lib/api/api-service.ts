import { axiosApiClient } from './axios-client';
import { 
  TNode,
  TNodeCreateData, 
  TNodeUpdateData, 
  TNodeFilters, 
  TPaginatedResponse,
  TNodeStats,
  TApiError 
} from '@/types';

// Centralized API service that provides a clean interface for all API operations
export class ApiService {
  // Node operations
  static async getNodes(filters: TNodeFilters = {}): Promise<TPaginatedResponse<TNode>> {
    return axiosApiClient.get<TPaginatedResponse<TNode>>('/nodes/', {
      params: filters,
    });
  }

  static async getNode(id: string): Promise<TNode> {
    return axiosApiClient.get<TNode>(`/nodes/${id}/`);
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
      
      return axiosApiClient.uploadFile<Node>('/nodes/', formData);
    } else {
      return axiosApiClient.post<TNode>('/nodes/', nodeData);
    }
  }

  static async updateNode(id: string, nodeData: TNodeUpdateData): Promise<TNode> {
    return axiosApiClient.put<TNode>(`/nodes/${id}/`, nodeData);
  }

  static async deleteNode(id: string): Promise<void> {
    return axiosApiClient.delete(`/nodes/${id}/`);
  }

  static async bulkCreateNodes(nodesData: TNodeCreateData[]): Promise<TNode[]> {
    return axiosApiClient.post<TNode[]>('/nodes/bulk_create/', nodesData);
  }

  static async bulkDeleteNodes(ids: string[]): Promise<void> {
    // This would need to be implemented on the backend
    // For now, we'll delete them one by one
    await Promise.all(ids.map(id => this.deleteNode(id)));
  }

  static async getNodeStats(): Promise<TNodeStats> {
    return axiosApiClient.get<TNodeStats>('/nodes/stats/');
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
    return axiosApiClient.get<{ status: string; timestamp: string }>('/health/');
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
