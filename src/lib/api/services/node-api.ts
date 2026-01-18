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
  TFormUpdateRequest,
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

  async updateNodeForm(
    identifier: string,
    fieldValues: Record<string, unknown> = {}
  ): Promise<TNodeForm> {
    const data: TFormUpdateRequest = { field_values: fieldValues };
    return this.post<TNodeForm>(`/nodes/${identifier}/form/update/`, data);
  }

  async executeNode(
    identifier: string, 
    data: TNodeExecuteRequest,
    timeout?: number
  ): Promise<TNodeExecuteResponse> {
    const requestData = {
      ...data,
      timeout: timeout, // Timeout in seconds for backend
    };
    return this.post<TNodeExecuteResponse>(
      `/nodes/${identifier}/execute/`,
      requestData,
      timeout ? { timeout: timeout * 1000 } : undefined // Convert seconds to ms for axios
    );
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
  updateNodeForm,
  executeNode,
  getNodeFieldOptions,
  refreshNodeCache,
  resetNodeSession,
} = nodeApi;

