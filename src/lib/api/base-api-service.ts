/**
 * Base API Service
 * 
 * Provides common functionality for all API services:
 * - Standardized error handling
 * - Request deduplication
 * - Common HTTP methods
 * 
 * Single responsibility: Base API service functionality
 */

import { AxiosRequestConfig } from 'axios';
import { axiosApiClient } from './axios-client';
import { handleApiError } from '../error-handling/api-error-handler';

/**
 * Base class for all API services.
 * Provides common error handling and request deduplication.
 */
export abstract class BaseApiService {
  // Request deduplication map to prevent duplicate API calls
  private pendingRequests = new Map<string, Promise<unknown>>();

  /**
   * Execute a request with error handling and optional deduplication.
   * 
   * @param requestKey - Unique key for request deduplication (optional)
   * @param requestFn - Function that returns the API request promise
   * @returns Promise with the response data
   */
  protected async executeRequest<T>(
    requestKey: string | null,
    requestFn: () => Promise<T>
  ): Promise<T> {
    // If request key is provided, check for existing request
    if (requestKey) {
      const existingRequest = this.pendingRequests.get(requestKey);
      if (existingRequest) {
        return existingRequest as Promise<T>;
      }
    }

    // Create new request
    const requestPromise = this.wrapWithErrorHandling(requestFn);

    // Store for deduplication if key provided
    if (requestKey) {
      this.pendingRequests.set(requestKey, requestPromise);
      
      // Clean up after request completes
      requestPromise
        .finally(() => {
          this.pendingRequests.delete(requestKey);
        })
        .catch(() => {
          // Error already handled, just clean up
        });
    }

    return requestPromise;
  }

  /**
   * Wrap a request function with standardized error handling.
   * 
   * @param requestFn - Function that returns the API request promise
   * @returns Promise with error handling applied
   */
  private async wrapWithErrorHandling<T>(requestFn: () => Promise<T>): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  /**
   * GET request with error handling.
   */
  protected async get<T>(url: string, config?: AxiosRequestConfig, requestKey?: string | null): Promise<T> {
    return this.executeRequest(
      requestKey ?? null,
      () => axiosApiClient.get<T>(url, config)
    );
  }

  /**
   * POST request with error handling.
   */
  protected async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.executeRequest(
      null, // POST requests are typically not deduplicated
      () => axiosApiClient.post<T>(url, data, config)
    );
  }

  /**
   * PUT request with error handling.
   */
  protected async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.executeRequest(
      null, // PUT requests are typically not deduplicated
      () => axiosApiClient.put<T>(url, data, config)
    );
  }

  /**
   * PATCH request with error handling.
   */
  protected async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.executeRequest(
      null, // PATCH requests are typically not deduplicated
      () => axiosApiClient.patch<T>(url, data, config)
    );
  }

  /**
   * DELETE request with error handling.
   */
  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.executeRequest(
      null, // DELETE requests are typically not deduplicated
      () => axiosApiClient.delete<T>(url, config)
    );
  }

  /**
   * File upload request with error handling.
   */
  protected async uploadFile<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    return this.executeRequest(
      null, // File uploads are typically not deduplicated
      () => axiosApiClient.uploadFile<T>(url, formData, config)
    );
  }
}
