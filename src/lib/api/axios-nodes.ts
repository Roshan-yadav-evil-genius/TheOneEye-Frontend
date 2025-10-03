import { Node } from '@/data/nodes';
import { 
  NodeCreateData, 
  NodeUpdateData, 
  NodeFilters, 
  PaginatedResponse,
  NodeStats,
  ApiError 
} from './types';
import { axiosApiClient } from './axios-client';

// Axios-based API client implementation
class AxiosNodesApiClient {
  private baseUrl: string;

  constructor() {
    // Use the backend URL from environment or default to localhost
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:7878/api';
  }

  // Helper method to build query parameters
  private buildQueryParams(filters: NodeFilters): Record<string, any> {
    const params: Record<string, any> = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // For arrays, we'll let axios handle the serialization
          params[key] = value;
        } else {
          params[key] = value;
        }
      }
    });
    
    return params;
  }

  // Transform backend node to frontend node format
  private transformNode(backendNode: any): Node {
    return {
      id: backendNode.id,
      name: backendNode.name,
      type: backendNode.type,
      category: backendNode.category,
      description: backendNode.description || '',
      version: backendNode.version || '1.0.0',
      isActive: backendNode.is_active,
      createdAt: backendNode.created_at,
      updatedAt: backendNode.updated_at,
      createdBy: backendNode.created_by || 'Unknown',
      formConfiguration: backendNode.form_configuration || {},
      tags: backendNode.tags || [],
      logo: backendNode.logo, // Include logo URL from backend
    };
  }

  // Transform frontend node data to backend format
  private transformNodeData(nodeData: NodeCreateData | NodeUpdateData): any {
    return {
      name: nodeData.name,
      type: nodeData.type,
      category: nodeData.category,
      description: nodeData.description,
      version: nodeData.version,
      is_active: nodeData.isActive,
      created_by: nodeData.createdBy,
      form_configuration: nodeData.formConfiguration,
      tags: nodeData.tags,
      logo: nodeData.logoFile, // Include logo file
    };
  }

  // CRUD Operations
  async getNodes(filters: NodeFilters = {}): Promise<PaginatedResponse<Node>> {
    const queryParams = this.buildQueryParams(filters);
    
    const data = await axiosApiClient.get<any>('/nodes/', {
      params: queryParams,
    });
    
    return {
      count: data.count || data.length,
      next: data.next,
      previous: data.previous,
      results: data.results ? data.results.map((node: any) => this.transformNode(node)) : data.map((node: any) => this.transformNode(node))
    };
  }

  async getNode(id: string): Promise<Node> {
    const data = await axiosApiClient.get<any>(`/nodes/${id}/`);
    return this.transformNode(data);
  }

  async createNode(nodeData: NodeCreateData): Promise<Node> {
    const transformedData = this.transformNodeData(nodeData);
    
    // Check if there's a logo file to upload
    const hasLogoFile = transformedData.logo instanceof File;
    
    let data: any;
    
    if (hasLogoFile) {
      // Use FormData for file upload
      const formData = new FormData();
      
      // Add all fields to FormData
      Object.entries(transformedData).forEach(([key, value]) => {
        if (key === 'logo' && value instanceof File) {
          formData.append('logo', value);
        } else if (key === 'form_configuration' || key === 'tags') {
          // Convert objects/arrays to JSON strings
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      data = await axiosApiClient.uploadFile<any>('/nodes/', formData);
    } else {
      // Use JSON for regular data
      data = await axiosApiClient.post<any>('/nodes/', transformedData);
    }
    
    return this.transformNode(data);
  }

  async updateNode(id: string, nodeData: NodeUpdateData): Promise<Node> {
    const transformedData = this.transformNodeData(nodeData);
    
    const data = await axiosApiClient.put<any>(`/nodes/${id}/`, transformedData);
    return this.transformNode(data);
  }

  async deleteNode(id: string): Promise<void> {
    await axiosApiClient.delete(`/nodes/${id}/`);
  }

  async bulkCreateNodes(nodesData: NodeCreateData[]): Promise<Node[]> {
    const transformedData = nodesData.map(nodeData => this.transformNodeData(nodeData));
    
    const data = await axiosApiClient.post<any>('/nodes/bulk_create/', transformedData);
    return data.map((node: any) => this.transformNode(node));
  }

  async getNodeStats(): Promise<NodeStats> {
    const data = await axiosApiClient.get<any>('/nodes/stats/');
    
    return {
      total_nodes: data.total_nodes,
      active_nodes: data.active_nodes,
      inactive_nodes: data.inactive_nodes,
      by_type: data.by_type,
      by_category: data.by_category,
      recent_created: data.recent_created,
    };
  }

  // Additional utility methods that can be added as needed
  async bulkDeleteNodes(ids: string[]): Promise<void> {
    // This would need to be implemented on the backend
    // For now, we'll delete them one by one
    await Promise.all(ids.map(id => this.deleteNode(id)));
  }

  async searchNodes(query: string, filters: Omit<NodeFilters, 'search'> = {}): Promise<PaginatedResponse<Node>> {
    return this.getNodes({ ...filters, search: query });
  }

  async getNodesByType(type: string): Promise<Node[]> {
    const response = await this.getNodes({ type });
    return response.results;
  }

  async getNodesByCategory(category: string): Promise<Node[]> {
    const response = await this.getNodes({ category });
    return response.results;
  }
}

// Export singleton instance
export const axiosNodesApi = new AxiosNodesApiClient();

// Export the class for testing
export { AxiosNodesApiClient };
