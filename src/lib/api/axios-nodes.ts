import { TNode, TNodeCreateData, TNodeUpdateData, TNodeFilters, TPaginatedResponse, TNodeStats, TApiError } from '@/types';
import { axiosApiClient } from './axios-client';

// Axios-based API client implementation
class AxiosNodesApiClient {
  private baseUrl: string;

  constructor() {
    // Use the backend URL from environment or default to localhost
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:7878/api';
  }

  // Construct full logo URL from relative path
  private constructLogoUrl(logoPath: string): string {
    if (!logoPath) return '';
    
    // If it's already a full URL, return as is
    if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
      return logoPath;
    }
    
    // Construct full URL by combining base URL with media path
    const baseUrl = this.baseUrl.replace('/api', ''); // Remove /api from base URL
    return `${baseUrl}/media/${logoPath}`;
  }

  // Helper method to build query parameters
  private buildQueryParams(filters: TNodeFilters): Record<string, unknown> {
    const params: Record<string, unknown> = {};
    
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
  private transformNode(backendNode: Record<string, unknown>): TNode {
    return {
      id: backendNode.id as string,
      name: backendNode.name as string,
      type: backendNode.type as 'trigger' | 'action' | 'logic' | 'system',
      nodeGroup: backendNode.node_group as string,
      nodeGroupName: backendNode.node_group_name as string,
      nodeGroupIcon: backendNode.node_group_icon ? this.constructLogoUrl(backendNode.node_group_icon as string) : undefined,
      description: (backendNode.description as string) || '',
      version: (backendNode.version as string) || '1.0.0',
      isActive: backendNode.is_active as boolean,
      createdAt: backendNode.created_at as string,
      updatedAt: backendNode.updated_at as string,
      createdBy: (backendNode.created_by as string) || 'Unknown',
      formConfiguration: (backendNode.form_configuration as Record<string, unknown>) || {},
      tags: (backendNode.tags as string[]) || [],
      logo: backendNode.logo ? this.constructLogoUrl(backendNode.logo as string) : undefined, // Include logo URL from backend
    };
  }

  // Transform frontend node data to backend format
  private transformNodeData(nodeData: TNodeCreateData | TNodeUpdateData): Record<string, unknown> {
    return {
      name: nodeData.name,
      type: nodeData.type,
      node_group: nodeData.nodeGroup, // Map nodeGroup to node_group for backend
      description: nodeData.description,
      version: nodeData.version,
      is_active: nodeData.isActive,
      form_configuration: nodeData.formConfiguration,
      tags: nodeData.tags,
      logo: nodeData.logoFile, // Include logo file
    };
  }

  // CRUD Operations
  async getNodes(filters: TNodeFilters = {}): Promise<TPaginatedResponse<TNode>> {
    const queryParams = this.buildQueryParams(filters);
    
    const data = await axiosApiClient.get<TPaginatedResponse<Record<string, unknown>>>('/nodes/', {
      params: queryParams,
    });
    
    return {
      count: data.count || (Array.isArray(data) ? data.length : 0),
      next: data.next,
      previous: data.previous,
      results: data.results ? data.results.map((node: Record<string, unknown>) => this.transformNode(node)) : (Array.isArray(data) ? data.map((node: Record<string, unknown>) => this.transformNode(node)) : [])
    };
  }

  async getNode(id: string): Promise<TNode> {
    const data = await axiosApiClient.get<Record<string, unknown>>(`/nodes/${id}/`);
    return this.transformNode(data);
  }

  async createNode(nodeData: TNodeCreateData): Promise<TNode> {
    const transformedData = this.transformNodeData(nodeData);
    
    // Debug: Log the transformed data being sent to backend
    console.log('Transformed data for backend:', transformedData);
    
    // Check if there's a logo file to upload
    const hasLogoFile = transformedData.logo instanceof File;
    console.log('Has logo file:', hasLogoFile, 'Logo type:', typeof transformedData.logo, 'Logo value:', transformedData.logo);
    
    let data: Record<string, unknown>;
    
    if (hasLogoFile) {
      // Use FormData for file upload
      const formData = new FormData();
      
      // Debug: Log the transformed data before FormData construction
      console.log('Creating FormData with transformedData:', transformedData);
      
      // Add all fields to FormData
      Object.entries(transformedData).forEach(([key, value]) => {
        console.log(`Processing field: ${key}, value:`, value, 'type:', typeof value);
        
        if (key === 'logo' && value instanceof File) {
          console.log('Adding logo file to FormData');
          formData.append('logo', value);
        } else if (key === 'form_configuration' || key === 'tags') {
          // Convert objects/arrays to JSON strings
          console.log(`Converting ${key} to JSON:`, JSON.stringify(value));
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          console.log(`Adding ${key} as string:`, value.toString());
          formData.append(key, value.toString());
        }
      });
      
      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      data = await axiosApiClient.uploadFile<Record<string, unknown>>('/nodes/', formData);
    } else {
      // Use JSON for regular data
      data = await axiosApiClient.post<Record<string, unknown>>('/nodes/', transformedData);
    }
    
    return this.transformNode(data);
  }

  async updateNode(id: string, nodeData: TNodeUpdateData): Promise<TNode> {
    const transformedData = this.transformNodeData(nodeData);
    
    const data = await axiosApiClient.put<Record<string, unknown>>(`/nodes/${id}/`, transformedData);
    return this.transformNode(data);
  }

  async deleteNode(id: string): Promise<void> {
    await axiosApiClient.delete(`/nodes/${id}/`);
  }

  async bulkCreateNodes(nodesData: TNodeCreateData[]): Promise<TNode[]> {
    const transformedData = nodesData.map(nodeData => this.transformNodeData(nodeData));
    
    const data = await axiosApiClient.post<Record<string, unknown>[]>('/nodes/bulk_create/', transformedData);
    return data.map((node: Record<string, unknown>) => this.transformNode(node));
  }

  async getNodeStats(): Promise<TNodeStats> {
    const data = await axiosApiClient.get<Record<string, unknown>>('/nodes/stats/');
    
    return {
      total_nodes: data.total_nodes as number,
      active_nodes: data.active_nodes as number,
      inactive_nodes: data.inactive_nodes as number,
      by_type: data.by_type as Record<string, number>,
      by_category: data.by_node_group as Record<string, number>, // Backend returns by_node_group, not by_category
      recent_created: data.recent_created as number,
    };
  }

  // Additional utility methods that can be added as needed
  async bulkDeleteNodes(ids: string[]): Promise<void> {
    // This would need to be implemented on the backend
    // For now, we'll delete them one by one
    await Promise.all(ids.map(id => this.deleteNode(id)));
  }

  async searchNodes(query: string, filters: Omit<TNodeFilters, 'search'> = {}): Promise<TPaginatedResponse<TNode>> {
    return this.getNodes({ ...filters, search: query });
  }

  async getNodesByType(type: string): Promise<TNode[]> {
    const response = await this.getNodes({ type });
    return response.results;
  }

  async getNodesByCategory(category: string): Promise<TNode[]> {
    const response = await this.getNodes({ category });
    return response.results;
  }
}

// Export singleton instance
export const axiosNodesApi = new AxiosNodesApiClient();

// Export the class for testing
export { AxiosNodesApiClient };
