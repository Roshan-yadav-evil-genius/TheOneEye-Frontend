/**
 * Auth Store
 * 
 * Single responsibility: Managing authentication state.
 */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authApi } from '@/lib/api/services/auth-api';

interface TUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface TAuthState {
  user: TUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface TAuthActions {
  login: (username: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type TAuthStore = TAuthState & TAuthActions;

const initialState: TAuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<TAuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        login: async (username: string, password: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await authApi.login({ username, password });
            
            set({
              user: response.user,
              token: response.access,
              refreshToken: response.refresh,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : 'Login failed',
            });
            throw error;
          }
        },

        register: async (userData) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await authApi.register(userData);
            
            set({
              user: response.user,
              token: response.access,
              refreshToken: response.refresh,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : 'Registration failed',
            });
            throw error;
          }
        },

        logout: async () => {
          set({ isLoading: true });
          
          try {
            const { refreshToken } = get();
            await authApi.logout(refreshToken || undefined);
          } catch (error) {
            // Ignore logout errors
          } finally {
            set({
              user: null,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        },

        refreshAccessToken: async () => {
          const { refreshToken } = get();
          
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          
          try {
            const response = await authApi.refreshToken(refreshToken);
            set({
              token: response.access,
              refreshToken: response.refresh,
            });
          } catch (error) {
            // If refresh fails, logout user
            get().logout();
            throw error;
          }
        },

        getCurrentUser: async () => {
          const currentState = get();
          
          // If already loading, don't make another request
          if (currentState.isLoading) {
            return;
          }
          
          // If we already have a user and token, don't make another request
          if (currentState.isAuthenticated && currentState.user && currentState.token) {
            return;
          }
          
          set({ isLoading: true, error: null });
          
          try {
            const user = await authApi.getCurrentUser();
            set({
              user,
              isAuthenticated: !!user,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: error instanceof Error ? error.message : 'Failed to get user',
            });
          }
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

