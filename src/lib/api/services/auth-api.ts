import { BaseApiService } from '../base-api-service';
import { TUser, BackendUser, BackendMeUser } from '@/types';
import { getAuthToken } from '@/lib/auth/token-manager';

/**
 * Auth API Service
 * Handles all authentication-related API operations
 */
class AuthApiService extends BaseApiService {
  async getCurrentUser(): Promise<TUser | null> {
    // Check if we have a token using token manager
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    try {
      const response = await this.get<BackendMeUser>('/auth/me/');
      const first = response.first_name ?? '';
      const last = response.last_name ?? '';
      const name = `${first} ${last}`.trim() || response.username;
      return {
        id: String(response.id),
        name,
        email: response.email,
        username: response.username,
        first_name: response.first_name,
        last_name: response.last_name,
      };
    } catch (error) {
      // Return null on error instead of throwing
      return null;
    }
  }

  async login(credentials: { username: string; password: string }): Promise<{ user: TUser; access: string; refresh: string }> {
    return this.post<{ user: TUser; access: string; refresh: string }>('/auth/login/', credentials);
  }

  async logout(refreshToken?: string): Promise<void> {
    try {
      await this.post('/auth/logout/', { refresh: refreshToken });
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
    return this.post<{ user: TUser; access: string; refresh: string }>('/auth/register/', userData);
  }

  async refreshToken(refreshToken: string): Promise<{ access: string; refresh: string }> {
    return this.post<{ access: string; refresh: string }>('/auth/refresh/', { refresh: refreshToken });
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

