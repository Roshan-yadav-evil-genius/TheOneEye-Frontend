import { Node } from '@/data/nodes';
import { 
  NodeCreateData, 
  NodeUpdateData, 
  NodeFilters, 
  PaginatedResponse,
  NodeStats,
  ApiError 
} from './types';

// Real API client implementation
class RealNodesApiClient {
  private baseUrl: string;

  constructor() {
    // Use the backend URL from environment or default to localhost
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:7878/api';
  }

  // Helper method to handle API responses
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }
    return response.json();
  }

  // Helper method to build query parameters
  private buildQueryParams(filters: NodeFilters): string {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => params.append(key, item.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });
    
    return params.toString();
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
    const queryString = this.buildQueryParams(filters);
    const url = `${this.baseUrl}/nodes/${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    const data = await this.handleResponse<any>(response);
    
    return {
      count: data.count || data.length,
      next: data.next,
      previous: data.previous,
      results: data.results ? data.results.map((node: any) => this.transformNode(node)) : data.map((node: any) => this.transformNode(node))
    };
  }

  async getNode(id: string): Promise<Node> {
    const response = await fetch(`${this.baseUrl}/nodes/${id}/`);
    const data = await this.handleResponse<any>(response);
    return this.transformNode(data);
  }

  async createNode(nodeData: NodeCreateData): Promise<Node> {
    const transformedData = this.transformNodeData(nodeData);
    
    // Check if there's a logo file to upload
    const hasLogoFile = transformedData.logo instanceof File;
    
    let requestBody: FormData | string;
    let headers: Record<string, string> = {};
    
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
      
      requestBody = formData;
      // Don't set Content-Type header for FormData - let browser set it with boundary
    } else {
      // Use JSON for regular data
      requestBody = JSON.stringify(transformedData);
      headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(`${this.baseUrl}/nodes/`, {
      method: 'POST',
      headers,
      body: requestBody,
    });
    
    const data = await this.handleResponse<any>(response);
    return this.transformNode(data);
  }

  async updateNode(id: string, nodeData: NodeUpdateData): Promise<Node> {
    const transformedData = this.transformNodeData(nodeData);
    
    const response = await fetch(`${this.baseUrl}/nodes/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedData),
    });
    
    const data = await this.handleResponse<any>(response);
    return this.transformNode(data);
  }

  async deleteNode(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/nodes/${id}/`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }
  }

  async bulkCreateNodes(nodesData: NodeCreateData[]): Promise<Node[]> {
    const transformedData = nodesData.map(nodeData => this.transformNodeData(nodeData));
    
    const response = await fetch(`${this.baseUrl}/nodes/bulk_create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedData),
    });
    
    const data = await this.handleResponse<any>(response);
    return data.map((node: any) => this.transformNode(node));
  }

  async getNodeStats(): Promise<NodeStats> {
    const response = await fetch(`${this.baseUrl}/nodes/stats/`);
    const data = await this.handleResponse<any>(response);
    
    return {
      total_nodes: data.total_nodes,
      active_nodes: data.active_nodes,
      inactive_nodes: data.inactive_nodes,
      by_type: data.by_type,
      by_category: data.by_category,
      recent_created: data.recent_created,
    };
  }
}

// Export singleton instance
export const realNodesApi = new RealNodesApiClient();

// Export the class for testing
export { RealNodesApiClient };
