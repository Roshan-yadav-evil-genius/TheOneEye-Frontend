import { axiosApiClient } from '../axios-client';
import { TUser, BackendUser } from '@/types';
import { handleApiError } from '../../error-handling/api-error-handler';
import { getAuthToken } from '@/lib/auth/token-manager';

/**
 * Auth API Service
 * Handles all authentication-related API operations
 */
class AuthApiService {
  async getCurrentUser(): Promise<TUser | null> {
    try {
      // Check if we have a token using token manager
      const token = getAuthToken();
      if (!token) {
        return null;
      }

      const response = await axiosApiClient.get<BackendUser>('/auth/me/');
      return {
        id: response.id,
        name: response.name,
        email: response.email,
        avatar: response.avatar,
        role: response.role,
        permissions: response.permissions,
      };
    } catch (error) {
      // Return null on error instead of throwing
      return null;
    }
  }

  async login(credentials: { username: string; password: string }): Promise<{ user: TUser; access: string; refresh: string }> {
    try {
      const response = await axiosApiClient.post<{ user: TUser; access: string; refresh: string }>('/auth/login/', credentials);
      return response;
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  async logout(refreshToken?: string): Promise<void> {
    try {
      await axiosApiClient.post('/auth/logout/', { refresh: refreshToken });
    } catch (error) {
      // Ignore logout errors - user is logged out regardless
      // Don't throw to allow logout to complete even if API call fails
    }
  }

  async register(userData: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
  }): Promise<{ user: TUser; access: string; refresh: string }> {
    try {
      const response = await axiosApiClient.post<{ user: TUser; access: string; refresh: string }>('/auth/register/', userData);
      return response;
    } catch (error) {
      throw handleApiError(error as any);
    }
  }

  async refreshToken(refreshToken: string): Promise<{ access: string; refresh: string }> {
    try {
      const response = await axiosApiClient.post<{ access: string; refresh: string }>('/auth/refresh/', { refresh: refreshToken });
      return response;
    } catch (error) {
      throw handleApiError(error as any);
    }
  }
}

// Export singleton instance
export const authApi = new AuthApiService();

// Export individual methods for easier importing
export const {
  getCurrentUser,
  login,
  logout,
  register,
  refreshToken,
} = authApi;

