import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { TApiError } from '@/types';
import { logger } from '@/lib/logging';
import { getAuthToken, getRefreshToken, updateAuthToken, clearAuthData } from '@/lib/auth/token-manager';
import { apiConfig } from '@/lib/config';

// Axios-based API client with better error handling and interceptors
class AxiosApiClient {
  private client: AxiosInstance;

  constructor() {
    // Create axios instance with base configuration
    this.client = axios.create({
      baseURL: apiConfig.baseURL,
      timeout: apiConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for logging and auth
    this.client.interceptors.request.use(
      (config) => {
        // Get token from token manager
        const token = getAuthToken();
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, undefined, 'axios-client');
        return config;
      },
      (error) => {
        logger.error('Request Error', error, 'axios-client');
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling and token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        logger.debug(`API Response: ${response.status} ${response.config.url}`, undefined, 'axios-client');
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        
        // Handle 401 errors with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh token using token manager
            const refreshToken = getRefreshToken();
            if (refreshToken) {
              const response = await axios.post(`${this.client.defaults.baseURL}/auth/refresh/`, {
                refresh: refreshToken,
              });
              
              const { access } = response.data;
              
              // Update stored token using token manager
              updateAuthToken(access);
              
              // Retry original request with new token
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${access}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear auth data and redirect to login
            clearAuthData();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }
        
        logger.error(
          `API Error: ${error.response?.status || 'No status'} - ${error.message}`,
          error,
          'axios-client'
        );
        
        // Transform axios error to our custom TApiError
        if (error.response) {
          // Server responded with error status
          const apiError = new TApiError(
            error.response.data?.message || `HTTP ${error.response.status}: ${error.response.statusText}`,
            error.response.status,
            error.response.data
          );
          return Promise.reject(apiError);
        } else if (error.request) {
          // Request was made but no response received
          const apiError = new TApiError(
            'Network error: No response from server',
            0,
            { originalError: error.message }
          );
          return Promise.reject(apiError);
        } else {
          // Something else happened
          const apiError = new TApiError(
            error.message || 'An unexpected error occurred',
            0,
            { originalError: error }
          );
          return Promise.reject(apiError);
        }
      }
    );
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  // File upload method
  async uploadFile<T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Get the underlying axios instance for advanced usage
  getInstance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const axiosApiClient = new AxiosApiClient();

// Export the class for testing
export { AxiosApiClient };
