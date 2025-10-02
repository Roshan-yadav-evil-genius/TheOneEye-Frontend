import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Node } from '@/data/nodes';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787/api';

// Types for API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface NodeCreateData {
  name: string;
  type: Node['type'];
  category: string;
  description?: string;
  version?: string;
  isActive?: boolean; // Optional for creation, defaults to true
  formConfiguration?: Record<string, unknown>;
  tags?: string[];
}

export interface NodeUpdateData extends Partial<NodeCreateData> {}

export interface NodeFilters {
  type?: string;
  category?: string;
  is_active?: boolean;
  tags?: string[];
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface NodeStats {
  total_nodes: number;
  active_nodes: number;
  inactive_nodes: number;
  by_type: Record<string, number>;
  by_category: Record<string, number>;
  recent_created: number;
}

// Custom error class for API errors
export class ApiError extends Error {
  public status?: number;
  public data?: any;

  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// API Client Class using Axios
class NodesApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string = API_BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: 10000, // 10 second timeout
      withCredentials: true, // Include cookies for session authentication
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add CSRF token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const csrfToken = this.getCsrfToken();
        if (csrfToken) {
          config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        // Transform axios errors into our custom ApiError
        console.error('Axios error details:', {
          message: error.message,
          code: error.code,
          response: error.response ? {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
          } : null,
          request: error.request ? {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL
          } : null,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL,
            timeout: error.config?.timeout
          }
        });
        
        if (error.response) {
          // Server responded with error status
          const message = error.response.data?.message || 
                         error.response.data?.detail || 
                         `HTTP ${error.response.status}: ${error.response.statusText}`;
          throw new ApiError(message, error.response.status, error.response.data);
        } else if (error.request) {
          // Request was made but no response received
          throw new ApiError('Network error: No response from server');
        } else {
          // Something else happened
          throw new ApiError(error.message || 'An unexpected error occurred');
        }
      }
    );
  }

  private getCsrfToken(): string | null {
    // Try to get CSRF token from cookies
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrftoken') {
          return value;
        }
      }
    }
    return null;
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      console.log('Making API request:', {
        method: config.method,
        url: config.url,
        baseURL: this.axiosInstance.defaults.baseURL,
        fullURL: `${this.axiosInstance.defaults.baseURL}${config.url}`,
        headers: config.headers,
        timeout: config.timeout || this.axiosInstance.defaults.timeout
      });
      
      const response = await this.axiosInstance.request<T>(config);
      console.log('API request successful:', {
        status: response.status,
        statusText: response.statusText,
        dataLength: response.data ? Object.keys(response.data).length : 0
      });
      return response.data;
    } catch (error) {
      console.error(`API request failed:`, error);
      throw error;
    }
  }

  // CRUD Operations
  async getNodes(filters: NodeFilters = {}): Promise<PaginatedResponse<Node>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/nodes/?${queryString}` : '/nodes/';
    
    return this.request<PaginatedResponse<Node>>({
      method: 'GET',
      url: endpoint,
    });
  }

  async getNode(id: string): Promise<Node> {
    return this.request<Node>({
      method: 'GET',
      url: `/nodes/${id}/`,
    });
  }

  async createNode(nodeData: NodeCreateData): Promise<Node> {
    return this.request<Node>({
      method: 'POST',
      url: '/nodes/',
      data: nodeData,
    });
  }

  async updateNode(id: string, nodeData: NodeUpdateData): Promise<Node> {
    return this.request<Node>({
      method: 'PATCH',
      url: `/nodes/${id}/`,
      data: nodeData,
    });
  }

  async deleteNode(id: string): Promise<void> {
    return this.request<void>({
      method: 'DELETE',
      url: `/nodes/${id}/`,
    });
  }

  // Bulk Operations
  async bulkCreateNodes(nodesData: NodeCreateData[]): Promise<Node[]> {
    return this.request<Node[]>({
      method: 'POST',
      url: '/nodes/bulk-create/',
      data: nodesData,
    });
  }

  async bulkDeleteNodes(ids: string[]): Promise<{ message: string; deleted_count: number }> {
    return this.request<{ message: string; deleted_count: number }>({
      method: 'DELETE',
      url: '/nodes/bulk-delete/',
      data: { ids },
    });
  }

  // Utility Endpoints
  async getNodeTypes(): Promise<{ types: Array<{ value: string; label: string }> }> {
    return this.request<{ types: Array<{ value: string; label: string }> }>({
      method: 'GET',
      url: '/nodes/types/',
    });
  }

  async getNodeCategories(): Promise<{ categories: Array<{ value: string; label: string }> }> {
    return this.request<{ categories: Array<{ value: string; label: string }> }>({
      method: 'GET',
      url: '/nodes/categories/',
    });
  }

  async getNodeTags(): Promise<{ tags: string[] }> {
    return this.request<{ tags: string[] }>({
      method: 'GET',
      url: '/nodes/tags/',
    });
  }

  async getNodeStats(): Promise<NodeStats> {
    return this.request<NodeStats>({
      method: 'GET',
      url: '/nodes/stats/',
    });
  }

  async searchNodes(query: string, filters: Omit<NodeFilters, 'search'> = {}): Promise<PaginatedResponse<Node>> {
    const params = new URLSearchParams({ q: query });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    return this.request<PaginatedResponse<Node>>({
      method: 'GET',
      url: `/nodes/search/?${params.toString()}`,
    });
  }
}

// Create and export a singleton instance
export const nodesApi = new NodesApiClient();

// Export the class for testing or custom instances
export { NodesApiClient };

// Helper functions for common operations
export const nodeApiHelpers = {
  // Get all nodes with pagination
  async getAllNodes(filters: NodeFilters = {}): Promise<Node[]> {
    const response = await nodesApi.getNodes(filters);
    return response.results;
  },

  // Search nodes with a simple query
  async searchNodesSimple(query: string): Promise<Node[]> {
    const response = await nodesApi.searchNodes(query);
    return response.results;
  },

  // Get nodes by type
  async getNodesByType(type: Node['type']): Promise<Node[]> {
    return this.getAllNodes({ type });
  },

  // Get nodes by category
  async getNodesByCategory(category: string): Promise<Node[]> {
    return this.getAllNodes({ category });
  },

  // Get active nodes only
  async getActiveNodes(): Promise<Node[]> {
    return this.getAllNodes({ is_active: true });
  },

  // Create a node with default values
  async createNodeWithDefaults(partialData: Partial<NodeCreateData>): Promise<Node> {
    const defaultData: NodeCreateData = {
      name: 'New Node',
      type: 'action',
      category: 'system',
      description: '',
      version: '1.0.0',
      isActive: true,
      formConfiguration: {},
      tags: [],
      ...partialData,
    };

    return nodesApi.createNode(defaultData);
  },

  // Update node with validation
  async updateNodeSafely(id: string, nodeData: NodeUpdateData): Promise<Node> {
    // Get the current node first to validate
    const currentNode = await nodesApi.getNode(id);
    
    // Merge with current data to preserve unchanged fields
    const updatedData = { ...currentNode, ...nodeData };
    
    return nodesApi.updateNode(id, updatedData);
  },
};
