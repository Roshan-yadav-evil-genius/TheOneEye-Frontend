import { BaseApiService } from '../base-api-service';
import {
  TNodeMetadata,
  TNodeTree,
  TNodeCount,
  TNodeForm,
  TFieldOptionsRequest,
  TFieldOptionsResponse,
  TNodeExecuteRequest,
  TNodeExecuteResponse,
  TNodeResetSessionRequest,
  TNodeResetSessionResponse,
} from '@/types';

/**
 * Node API Service
 * Handles all node registry-related API operations
 */
class NodeApiService extends BaseApiService {
  async getNodes(): Promise<TNodeTree> {
    return this.get<TNodeTree>('/nodes/');
  }

  async getNodesFlat(): Promise<TNodeMetadata[]> {
    return this.get<TNodeMetadata[]>('/nodes/flat/');
  }

  async getNodesCount(): Promise<TNodeCount> {
    return this.get<TNodeCount>('/nodes/count/');
  }

  async getNodeDetail(identifier: string): Promise<TNodeMetadata> {
    return this.get<TNodeMetadata>(`/nodes/${identifier}/`);
  }

  async getNodeForm(identifier: string): Promise<TNodeForm> {
    return this.get<TNodeForm>(`/nodes/${identifier}/form/`);
  }

  async executeNode(
    identifier: string, 
    data: TNodeExecuteRequest
  ): Promise<TNodeExecuteResponse> {
    return this.post<TNodeExecuteResponse>(`/nodes/${identifier}/execute/`, data);
  }

  async getNodeFieldOptions(
    identifier: string, 
    data: TFieldOptionsRequest
  ): Promise<TFieldOptionsResponse> {
    return this.post<TFieldOptionsResponse>(`/nodes/${identifier}/field-options/`, data);
  }

  async refreshNodeCache(): Promise<{ message: string }> {
    return this.post<{ message: string }>('/nodes/refresh/');
  }

  async resetNodeSession(
    identifier: string,
    data: TNodeResetSessionRequest
  ): Promise<TNodeResetSessionResponse> {
    return this.post<TNodeResetSessionResponse>(
      `/nodes/${identifier}/reset-session/`,
      data
    );
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
  resetNodeSession,
} = nodeApi;

