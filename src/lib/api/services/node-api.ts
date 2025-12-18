import { axiosApiClient } from '../axios-client';
import {
  TNodeMetadata,
  TNodeTree,
  TNodeCount,
  TNodeForm,
  TFieldOptionsRequest,
  TFieldOptionsResponse,
  TNodeExecuteRequest,
  TNodeExecuteResponse,
} from '@/types';

/**
 * Node API Service
 * Handles all node registry-related API operations
 */
class NodeApiService {
  async getNodes(): Promise<TNodeTree> {
    return axiosApiClient.get<TNodeTree>('/nodes/');
  }

  async getNodesFlat(): Promise<TNodeMetadata[]> {
    return axiosApiClient.get<TNodeMetadata[]>('/nodes/flat/');
  }

  async getNodesCount(): Promise<TNodeCount> {
    return axiosApiClient.get<TNodeCount>('/nodes/count/');
  }

  async getNodeDetail(identifier: string): Promise<TNodeMetadata> {
    return axiosApiClient.get<TNodeMetadata>(`/nodes/${identifier}/`);
  }

  async getNodeForm(identifier: string): Promise<TNodeForm> {
    return axiosApiClient.get<TNodeForm>(`/nodes/${identifier}/form/`);
  }

  async executeNode(
    identifier: string, 
    data: TNodeExecuteRequest
  ): Promise<TNodeExecuteResponse> {
    return axiosApiClient.post<TNodeExecuteResponse>(`/nodes/${identifier}/execute/`, data);
  }

  async getNodeFieldOptions(
    identifier: string, 
    data: TFieldOptionsRequest
  ): Promise<TFieldOptionsResponse> {
    return axiosApiClient.post<TFieldOptionsResponse>(`/nodes/${identifier}/field-options/`, data);
  }

  async refreshNodeCache(): Promise<{ message: string }> {
    return axiosApiClient.post<{ message: string }>('/nodes/refresh/');
  }
}

// Export singleton instance
export const nodeApi = new NodeApiService();

// Export individual methods for easier importing
export const {
  getNodes,
  getNodesFlat,
  getNodesCount,
  getNodeDetail,
  getNodeForm,
  executeNode,
  getNodeFieldOptions,
  refreshNodeCache,
} = nodeApi;

