import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { TUser, TUserState } from './types';
import { authApi } from '@/lib/api/services/auth-api';
import { logger } from '@/lib/logging';

interface TUserActions {
  // Authentication actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: Partial<TUser> & { password: string }) => Promise<void>;
  
  // TUser data actions
  updateTUser: (userData: Partial<TUser>) => Promise<void>;
  refreshTUser: () => Promise<void>;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type TUserStore = TUserState & TUserActions;

const initialState: TUserState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useUserStore = create<TUserStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Authentication actions
        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await authApi.login({ username: email, password });
            
            // Store tokens in auth store (handled by auth store)
            if (typeof window !== 'undefined') {
              const authStore = localStorage.getItem('auth-store');
              if (authStore) {
                const authData = JSON.parse(authStore);
                authData.state = {
                  ...authData.state,
                  token: response.access,
                  refreshToken: response.refresh,
                };
                localStorage.setItem('auth-store', JSON.stringify(authData));
              }
            }

            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            logger.error('Login failed', error, 'user-store');
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: error instanceof Error ? error.message : 'Login failed',
            });
          }
        },

        logout: async () => {
          try {
            // Get refresh token from localStorage
            if (typeof window !== 'undefined') {
              const authStore = localStorage.getItem('auth-store');
              if (authStore) {
                const authData = JSON.parse(authStore);
                if (authData.state?.refreshToken) {
                  await authApi.logout(authData.state.refreshToken);
                }
              }
            }
          } catch (error) {
            logger.error('Logout error', error, 'user-store');
          } finally {
            set({
              user: null,
              isAuthenticated: false,
              error: null,
            });
          }
        },

        register: async (userData: Partial<TUser> & { password: string }) => {
          set({ isLoading: true, error: null });
          
          try {
            // Map userData to API format
            const registerData = {
              username: userData.email || '',
              email: userData.email || '',
              first_name: userData.name?.split(' ')[0] || '',
              last_name: userData.name?.split(' ').slice(1).join(' ') || '',
              password: userData.password,
              password_confirm: userData.password,
            };

            const response = await authApi.register(registerData);
            
            // Store tokens in auth store
            if (typeof window !== 'undefined') {
              const authStore = localStorage.getItem('auth-store');
              if (authStore) {
                const authData = JSON.parse(authStore);
                authData.state = {
                  ...authData.state,
                  token: response.access,
                  refreshToken: response.refresh,
                };
                localStorage.setItem('auth-store', JSON.stringify(authData));
              }
            }

            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            logger.error('Registration failed', error, 'user-store');
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: error instanceof Error ? error.message : 'Registration failed',
            });
          }
        },

        // TUser data actions
        updateTUser: async (userData: Partial<TUser>) => {
          const { user } = get();
          if (!user) return;

          set({ isLoading: true, error: null });
          
          try {
            // Note: Update user endpoint may not exist yet
            // For now, update local state only
            // TODO: Implement user update endpoint in backend if needed
            const updatedTUser = { ...user, ...userData };
            
            set({
              user: updatedTUser,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            logger.error('Update user failed', error, 'user-store');
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : 'Update failed',
            });
          }
        },

        refreshTUser: async () => {
          set({ isLoading: true, error: null });
          
          try {
            const currentUser = await authApi.getCurrentUser();
            
            if (currentUser) {
              set({
                user: currentUser,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } else {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
              });
            }
          } catch (error) {
            logger.error('Refresh user failed', error, 'user-store');
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : 'Refresh failed',
            });
          }
        },

        // Utility actions
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
        name: 'user-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'user-store',
    }
  )
);
