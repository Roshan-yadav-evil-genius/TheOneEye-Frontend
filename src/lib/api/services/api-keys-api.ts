import { BaseApiService } from '../base-api-service';
import type { ApiKeyListItem, ApiKeyCreateResponse } from '@/types';

/**
 * API Keys API Service.
 * List, create, and revoke API keys. Uses JWT (axios client sends Bearer token).
 */
class ApiKeysApiService extends BaseApiService {
  async listApiKeys(): Promise<ApiKeyListItem[]> {
    const data = await this.get<ApiKeyListItem[]>('/auth/api-keys/');
    return Array.isArray(data) ? data : [];
  }

  async createApiKey(name: string): Promise<ApiKeyCreateResponse> {
    return this.post<ApiKeyCreateResponse>('/auth/api-keys/', { name });
  }

  async revokeApiKey(id: string): Promise<void> {
    await this.delete(`/auth/api-keys/${id}/`);
  }
}

export const apiKeysApi = new ApiKeysApiService();

export const listApiKeys = apiKeysApi.listApiKeys.bind(apiKeysApi);
export const createApiKey = apiKeysApi.createApiKey.bind(apiKeysApi);
export const revokeApiKey = apiKeysApi.revokeApiKey.bind(apiKeysApi);
