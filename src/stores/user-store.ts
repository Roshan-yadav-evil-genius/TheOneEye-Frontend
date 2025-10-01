import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, UserState } from './types';

interface UserActions {
  // Authentication actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  
  // User data actions
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  
  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type UserStore = UserState & UserActions;

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Authentication actions
        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          
          try {
            // TODO: Replace with actual API call
            // const response = await authApi.login(email, password);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock user data - replace with actual response
            const user: User = {
              id: '1',
              name: 'Roshan Yadav',
              email: 'roshan.yadav@12thwonder.com',
              avatar: '/avatars/shadcn.jpg',
              role: 'admin',
              permissions: ['read', 'write', 'admin'],
            };

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: error instanceof Error ? error.message : 'Login failed',
            });
          }
        },

        logout: () => {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        },

        register: async (userData: Partial<User> & { password: string }) => {
          set({ isLoading: true, error: null });
          
          try {
            // TODO: Replace with actual API call
            // const response = await authApi.register(userData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock user data - replace with actual response
            const user: User = {
              id: Date.now().toString(),
              name: userData.name || 'New User',
              email: userData.email || '',
              avatar: userData.avatar,
              role: 'user',
              permissions: ['read'],
            };

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: error instanceof Error ? error.message : 'Registration failed',
            });
          }
        },

        // User data actions
        updateUser: async (userData: Partial<User>) => {
          const { user } = get();
          if (!user) return;

          set({ isLoading: true, error: null });
          
          try {
            // TODO: Replace with actual API call
            // const response = await userApi.updateUser(user.id, userData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const updatedUser = { ...user, ...userData };
            
            set({
              user: updatedUser,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : 'Update failed',
            });
          }
        },

        refreshUser: async () => {
          const { user } = get();
          if (!user) return;

          set({ isLoading: true, error: null });
          
          try {
            // TODO: Replace with actual API call
            // const response = await userApi.getUser(user.id);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // For now, just clear loading state
            set({
              isLoading: false,
              error: null,
            });
          } catch (error) {
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
