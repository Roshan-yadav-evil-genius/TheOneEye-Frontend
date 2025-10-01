import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UIStoreState, Breadcrumb, Notification } from './types';

interface UIActions {
  // Sidebar management
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Theme management
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  
  // Page navigation
  setActivePage: (page: string) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  addBreadcrumb: (breadcrumb: Breadcrumb) => void;
  removeBreadcrumb: (index: number) => void;
  clearBreadcrumbs: () => void;
  
  // Notification management
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  
  // Modal management
  openModal: (modalName: keyof UIStoreState['modals']) => void;
  closeModal: (modalName: keyof UIStoreState['modals']) => void;
  closeAllModals: () => void;
  
  // Utility actions
  resetUI: () => void;
}

type UIStore = UIStoreState & UIActions;

const initialState: UIStoreState = {
  sidebarOpen: true,
  theme: 'system',
  activePage: 'dashboard',
  breadcrumbs: [],
  notifications: [],
  modals: {
    createNode: false,
    editNode: false,
    createWorkflow: false,
    editWorkflow: false,
    createProject: false,
    editProject: false,
  },
};

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Sidebar management
        toggleSidebar: () => {
          set((state) => ({ sidebarOpen: !state.sidebarOpen }));
        },

        setSidebarOpen: (open: boolean) => {
          set({ sidebarOpen: open });
        },

        // Theme management
        setTheme: (theme: 'light' | 'dark' | 'system') => {
          set({ theme });
          
          // Apply theme to document
          if (typeof window !== 'undefined') {
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');
            
            if (theme === 'system') {
              const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              root.classList.add(systemTheme);
            } else {
              root.classList.add(theme);
            }
          }
        },

        toggleTheme: () => {
          const { theme } = get();
          const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
          get().setTheme(newTheme);
        },

        // Page navigation
        setActivePage: (page: string) => {
          set({ activePage: page });
        },

        setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => {
          set({ breadcrumbs });
        },

        addBreadcrumb: (breadcrumb: Breadcrumb) => {
          set((state) => ({
            breadcrumbs: [...state.breadcrumbs, breadcrumb],
          }));
        },

        removeBreadcrumb: (index: number) => {
          set((state) => ({
            breadcrumbs: state.breadcrumbs.filter((_, i) => i !== index),
          }));
        },

        clearBreadcrumbs: () => {
          set({ breadcrumbs: [] });
        },

        // Notification management
        addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => {
          const newNotification: Notification = {
            ...notification,
            id: `notification-${Date.now()}-${Math.random()}`,
            timestamp: new Date(),
          };

          set((state) => ({
            notifications: [...state.notifications, newNotification],
          }));

          // Auto-remove notification after 5 seconds for success/info types
          if (notification.type === 'success' || notification.type === 'info') {
            setTimeout(() => {
              get().removeNotification(newNotification.id);
            }, 5000);
          }
        },

        removeNotification: (id: string) => {
          set((state) => ({
            notifications: state.notifications.filter((notification) => notification.id !== id),
          }));
        },

        markNotificationAsRead: (id: string) => {
          set((state) => ({
            notifications: state.notifications.map((notification) =>
              notification.id === id ? { ...notification, read: true } : notification
            ),
          }));
        },

        markAllNotificationsAsRead: () => {
          set((state) => ({
            notifications: state.notifications.map((notification) => ({
              ...notification,
              read: true,
            })),
          }));
        },

        clearNotifications: () => {
          set({ notifications: [] });
        },

        // Modal management
        openModal: (modalName: keyof UIStoreState['modals']) => {
          set((state) => ({
            modals: {
              ...state.modals,
              [modalName]: true,
            },
          }));
        },

        closeModal: (modalName: keyof UIStoreState['modals']) => {
          set((state) => ({
            modals: {
              ...state.modals,
              [modalName]: false,
            },
          }));
        },

        closeAllModals: () => {
          set({
            modals: {
              createNode: false,
              editNode: false,
              createWorkflow: false,
              editWorkflow: false,
              createProject: false,
              editProject: false,
            },
          });
        },

        // Utility actions
        resetUI: () => {
          set({
            ...initialState,
            // Keep theme and sidebar state as they are user preferences
            theme: get().theme,
            sidebarOpen: get().sidebarOpen,
          });
        },
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
          theme: state.theme,
          activePage: state.activePage,
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
);

// Helper functions for common UI operations
export const uiHelpers = {
  // Notification helpers
  showSuccess: (title: string, message: string) => {
    useUIStore.getState().addNotification({
      type: 'success',
      title,
      message,
      read: false,
    });
  },

  showError: (title: string, message: string) => {
    useUIStore.getState().addNotification({
      type: 'error',
      title,
      message,
      read: false,
    });
  },

  showWarning: (title: string, message: string) => {
    useUIStore.getState().addNotification({
      type: 'warning',
      title,
      message,
      read: false,
    });
  },

  showInfo: (title: string, message: string) => {
    useUIStore.getState().addNotification({
      type: 'info',
      title,
      message,
      read: false,
    });
  },

  // Breadcrumb helpers
  setPageBreadcrumbs: (page: string, additionalBreadcrumbs: Breadcrumb[] = []) => {
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: page, isActive: true },
      ...additionalBreadcrumbs,
    ];
    useUIStore.getState().setBreadcrumbs(breadcrumbs);
  },

  // Modal helpers
  openCreateNodeModal: () => {
    useUIStore.getState().openModal('createNode');
  },

  openEditNodeModal: () => {
    useUIStore.getState().openModal('editNode');
  },

  openCreateWorkflowModal: () => {
    useUIStore.getState().openModal('createWorkflow');
  },

  openEditWorkflowModal: () => {
    useUIStore.getState().openModal('editWorkflow');
  },

  openCreateProjectModal: () => {
    useUIStore.getState().openModal('createProject');
  },

  openEditProjectModal: () => {
    useUIStore.getState().openModal('editProject');
  },
};
