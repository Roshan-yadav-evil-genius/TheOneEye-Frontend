import { axiosApiClient } from './axios-client';
import { 
  Node,
  NodeCreateData, 
  NodeUpdateData, 
  NodeFilters, 
  PaginatedResponse,
  NodeStats,
  ApiError 
} from '@/types';

// Centralized API service that provides a clean interface for all API operations
export class ApiService {
  // Node operations
  static async getNodes(filters: NodeFilters = {}): Promise<PaginatedResponse<Node>> {
    return axiosApiClient.get<PaginatedResponse<Node>>('/nodes/', {
      params: filters,
    });
  }

  static async getNode(id: string): Promise<Node> {
    return axiosApiClient.get<Node>(`/nodes/${id}/`);
  }

  static async createNode(nodeData: NodeCreateData): Promise<Node> {
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
      return axiosApiClient.post<Node>('/nodes/', nodeData);
    }
  }

  static async updateNode(id: string, nodeData: NodeUpdateData): Promise<Node> {
    return axiosApiClient.put<Node>(`/nodes/${id}/`, nodeData);
  }

  static async deleteNode(id: string): Promise<void> {
    return axiosApiClient.delete(`/nodes/${id}/`);
  }

  static async bulkCreateNodes(nodesData: NodeCreateData[]): Promise<Node[]> {
    return axiosApiClient.post<Node[]>('/nodes/bulk_create/', nodesData);
  }

  static async bulkDeleteNodes(ids: string[]): Promise<void> {
    // This would need to be implemented on the backend
    // For now, we'll delete them one by one
    await Promise.all(ids.map(id => this.deleteNode(id)));
  }

  static async getNodeStats(): Promise<NodeStats> {
    return axiosApiClient.get<NodeStats>('/nodes/stats/');
  }

  // Workflow operations (placeholder for future implementation)
  static async getWorkflows(): Promise<any[]> {
    // TODO: Implement when backend is ready
    return Promise.resolve([]);
  }

  static async createWorkflow(workflowData: any): Promise<any> {
    // TODO: Implement when backend is ready
    return Promise.resolve(workflowData);
  }

  static async updateWorkflow(id: string, workflowData: any): Promise<any> {
    // TODO: Implement when backend is ready
    return Promise.resolve(workflowData);
  }

  static async deleteWorkflow(id: string): Promise<void> {
    // TODO: Implement when backend is ready
    return Promise.resolve();
  }

  // Project operations (placeholder for future implementation)
  static async getProjects(): Promise<any[]> {
    // TODO: Implement when backend is ready
    return Promise.resolve([]);
  }

  static async createProject(projectData: any): Promise<any> {
    // TODO: Implement when backend is ready
    return Promise.resolve(projectData);
  }

  static async updateProject(id: string, projectData: any): Promise<any> {
    // TODO: Implement when backend is ready
    return Promise.resolve(projectData);
  }

  static async deleteProject(id: string): Promise<void> {
    // TODO: Implement when backend is ready
    return Promise.resolve();
  }

  // User operations (placeholder for future implementation)
  static async getCurrentUser(): Promise<any> {
    // TODO: Implement when backend is ready
    return Promise.resolve(null);
  }

  static async login(credentials: any): Promise<any> {
    // TODO: Implement when backend is ready
    return Promise.resolve(credentials);
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
