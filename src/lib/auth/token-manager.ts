/**
 * Token Manager
 * 
 * Single responsibility: Managing authentication token storage and retrieval.
 * Abstracts localStorage access for auth tokens.
 */
import { authConfig } from '@/lib/config';

const AUTH_STORE_KEY = authConfig.tokenStorageKey;

interface AuthStoreState {
  state: {
    token: string | null;
    refreshToken: string | null;
    user: unknown;
    isAuthenticated: boolean;
  };
}

/**
 * Get authentication token from storage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(AUTH_STORE_KEY);
    if (!stored) {
      return null;
    }

    const authData: AuthStoreState = JSON.parse(stored);
    return authData.state?.token || null;
  } catch (error) {
    console.error('Error reading auth token:', error);
    return null;
  }
}

/**
 * Get refresh token from storage
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(AUTH_STORE_KEY);
    if (!stored) {
      return null;
    }

    const authData: AuthStoreState = JSON.parse(stored);
    return authData.state?.refreshToken || null;
  } catch (error) {
    console.error('Error reading refresh token:', error);
    return null;
  }
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const stored = localStorage.getItem(AUTH_STORE_KEY);
    if (!stored) {
      return false;
    }

    const authData: AuthStoreState = JSON.parse(stored);
    return authData.state?.isAuthenticated === true && !!authData.state?.token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

/**
 * Update authentication token in storage
 */
export function updateAuthToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const stored = localStorage.getItem(AUTH_STORE_KEY);
    if (!stored) {
      return;
    }

    const authData: AuthStoreState = JSON.parse(stored);
    authData.state = {
      ...authData.state,
      token,
    };

    localStorage.setItem(AUTH_STORE_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error('Error updating auth token:', error);
  }
}

/**
 * Clear authentication data from storage
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(AUTH_STORE_KEY);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
}

