/**
 * Base API Service Class
 * 
 * Provides common patterns for API services including:
 * - CRUD operations
 * - Error handling
 * - Request deduplication
 */
import { axiosApiClient } from './axios-client';
import { handleApiError } from '../error-handling/api-error-handler';

export interface BaseApiServiceConfig {
  basePath: string;
  enableRequestDeduplication?: boolean;
}

/**
 * Base class for API services
 * Reduces duplication across API service implementations
 */
export abstract class BaseApiService<TBackend, TFrontend = TBackend> {
  protected basePath: string;
  private pendingRequests: Map<string, Promise<unknown>>;
  private enableDeduplication: boolean;

  constructor(config: BaseApiServiceConfig) {
    this.basePath = config.basePath;
    this.enableDeduplication = config.enableRequestDeduplication ?? false;
    this.pendingRequests = new Map();
  }

  /**
   * Get all items
   */
  protected async getAll<T = TBackend>(): Promise<T[]> {
    try {
      const response = await axiosApiClient.get<{ results: T[] } | T[]>(this.basePath);
      
      if (Array.isArray(response)) {
        return response;
      }
      
      if (response && typeof response === 'object' && 'results' in response) {
        return (response as { results: T[] }).results;
      }
      
      return [];
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  /**
   * Get item by ID
   */
  protected async getById<T = TBackend>(id: string, endpoint?: string): Promise<T> {
    try {
      const path = endpoint ? `${this.basePath}${endpoint}` : `${this.basePath}/${id}/`;
      return await axiosApiClient.get<T>(path);
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  /**
   * Create new item
   */
  protected async create<TRequest = Partial<TBackend>, TResponse = TBackend>(
    data: TRequest,
    endpoint?: string
  ): Promise<TResponse> {
    try {
      const path = endpoint ? `${this.basePath}${endpoint}` : `${this.basePath}/`;
      return await axiosApiClient.post<TResponse>(path, data);
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  /**
   * Update item by ID
   */
  protected async update<TRequest = Partial<TBackend>, TResponse = TBackend>(
    id: string,
    data: TRequest,
    endpoint?: string
  ): Promise<TResponse> {
    try {
      const path = endpoint ? `${this.basePath}${endpoint}` : `${this.basePath}/${id}/`;
      return await axiosApiClient.put<TResponse>(path, data);
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  /**
   * Partially update item by ID
   */
  protected async patch<TRequest = Partial<TBackend>, TResponse = TBackend>(
    id: string,
    data: TRequest,
    endpoint?: string
  ): Promise<TResponse> {
    try {
      const path = endpoint ? `${this.basePath}${endpoint}` : `${this.basePath}/${id}/`;
      return await axiosApiClient.patch<TResponse>(path, data);
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  /**
   * Delete item by ID
   */
  protected async delete(id: string, endpoint?: string): Promise<void> {
    try {
      const path = endpoint ? `${this.basePath}${endpoint}` : `${this.basePath}/${id}/`;
      return await axiosApiClient.delete<void>(path);
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  /**
   * Make a request with optional deduplication
   */
  protected async requestWithDeduplication<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    if (!this.enableDeduplication) {
      return requestFn();
    }

    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)! as Promise<T>;
    }

    const requestPromise = requestFn();
    this.pendingRequests.set(key, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.pendingRequests.delete(key);
    }
  }

  /**
   * Clear pending requests cache
   */
  protected clearPendingRequests(): void {
    this.pendingRequests.clear();
  }
}

