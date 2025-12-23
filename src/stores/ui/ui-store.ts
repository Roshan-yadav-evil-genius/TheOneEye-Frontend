/**
 * UI Store
 * 
 * Single responsibility: Managing global UI state.
 */
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { TUIStoreState, TBreadcrumb, TNotification } from '../types';

interface UIActions {
  // Sidebar management
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Nodes view mode management
  setNodesViewMode: (mode: 'tree' | 'flat') => void;
  
  // Mobile menu management
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  closeMobileMenu: () => void;
  
  // Node group expansion management
  toggleNodeGroup: (nodeGroup: string) => void;
  expandNodeGroup: (nodeGroup: string) => void;
  collapseNodeGroup: (nodeGroup: string) => void;
  expandAllNodeGroups: (nodeGroups: string[]) => void;
  collapseAllNodeGroups: () => void;
  isNodeGroupExpanded: (nodeGroup: string) => boolean;
  
  // Theme management
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  
  // Page navigation
  setActivePage: (page: string) => void;
  setTBreadcrumbs: (breadcrumbs: TBreadcrumb[]) => void;
  addTBreadcrumb: (breadcrumb: TBreadcrumb) => void;
  removeTBreadcrumb: (index: number) => void;
  clearTBreadcrumbs: () => void;
  
  // TNotification management
  addTNotification: (notification: Omit<TNotification, 'id' | 'timestamp'>) => void;
  removeTNotification: (id: string) => void;
  markTNotificationAsRead: (id: string) => void;
  markAllTNotificationsAsRead: () => void;
  clearTNotifications: () => void;
  
  // Modal management
  openModal: (modalName: keyof TUIStoreState['modals']) => void;
  closeModal: (modalName: keyof TUIStoreState['modals']) => void;
  closeAllModals: () => void;
  
  // Utility actions
  resetUI: () => void;
}

type UIStore = TUIStoreState & UIActions;

const initialState: TUIStoreState = {
  sidebarOpen: true,
  theme: 'system',
  activePage: 'dashboard',
  breadcrumbs: [],
  notifications: [],
  modals: {
    createWorkflow: false,
    editWorkflow: false,
    createBrowserSession: false,
    editBrowserSession: false,
  },
  mobileMenuOpen: false,
  expandedNodeGroups: new Set<string>(),
  nodesViewMode: 'tree',
  hasHydrated: false,
};

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        // Ensure expandedNodeGroups is always a Set
        expandedNodeGroups: new Set(initialState.expandedNodeGroups),

        // Sidebar management
        toggleSidebar: () => {
          set((state) => ({ sidebarOpen: !state.sidebarOpen }));
        },

        setSidebarOpen: (open: boolean) => {
          set({ sidebarOpen: open });
        },

        // Nodes view mode management
        setNodesViewMode: (mode: 'tree' | 'flat') => {
          set({ nodesViewMode: mode });
        },

        // Mobile menu management
        toggleMobileMenu: () => {
          set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }));
        },

        setMobileMenuOpen: (open: boolean) => {
          set({ mobileMenuOpen: open });
        },

        closeMobileMenu: () => {
          set({ mobileMenuOpen: false });
        },

        // Node group expansion management
        toggleNodeGroup: (nodeGroup: string) => {
          set((state) => {
            const newExpanded = new Set(state.expandedNodeGroups);
            if (newExpanded.has(nodeGroup)) {
              newExpanded.delete(nodeGroup);
            } else {
              newExpanded.add(nodeGroup);
            }
            return { expandedNodeGroups: newExpanded };
          });
        },

        expandNodeGroup: (nodeGroup: string) => {
          set((state) => {
            const newExpanded = new Set(state.expandedNodeGroups);
            newExpanded.add(nodeGroup);
            return { expandedNodeGroups: newExpanded };
          });
        },

        collapseNodeGroup: (nodeGroup: string) => {
          set((state) => {
            const newExpanded = new Set(state.expandedNodeGroups);
            newExpanded.delete(nodeGroup);
            return { expandedNodeGroups: newExpanded };
          });
        },

        expandAllNodeGroups: (nodeGroups: string[]) => {
          set({ expandedNodeGroups: new Set(nodeGroups) });
        },

        collapseAllNodeGroups: () => {
          set({ expandedNodeGroups: new Set<string>() });
        },

        isNodeGroupExpanded: (nodeGroup: string) => {
          return get().expandedNodeGroups.has(nodeGroup);
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


        setTBreadcrumbs: (breadcrumbs: TBreadcrumb[]) => {
          set({ breadcrumbs });
        },

        addTBreadcrumb: (breadcrumb: TBreadcrumb) => {
          set((state) => ({
            breadcrumbs: [...state.breadcrumbs, breadcrumb],
          }));
        },

        removeTBreadcrumb: (index: number) => {
          set((state) => ({
            breadcrumbs: state.breadcrumbs.filter((_, i) => i !== index),
          }));
        },

        clearTBreadcrumbs: () => {
          set({ breadcrumbs: [] });
        },

        // TNotification management
        addTNotification: (notification: Omit<TNotification, 'id' | 'timestamp'>) => {
          const newTNotification: TNotification = {
            ...notification,
            id: `notification-${Date.now()}-${Math.random()}`,
            timestamp: new Date(),
          };

          set((state) => ({
            notifications: [...state.notifications, newTNotification],
          }));

          // Auto-remove notification after 5 seconds for success/info types
          if (notification.type === 'success' || notification.type === 'info') {
            setTimeout(() => {
              get().removeTNotification(newTNotification.id);
            }, 5000);
          }
        },

        removeTNotification: (id: string) => {
          set((state) => ({
            notifications: state.notifications.filter((notification) => notification.id !== id),
          }));
        },

        markTNotificationAsRead: (id: string) => {
          set((state) => ({
            notifications: state.notifications.map((notification) =>
              notification.id === id ? { ...notification, read: true } : notification
            ),
          }));
        },

        markAllTNotificationsAsRead: () => {
          set((state) => ({
            notifications: state.notifications.map((notification) => ({
              ...notification,
              read: true,
            })),
          }));
        },

        clearTNotifications: () => {
          set({ notifications: [] });
        },

        // Modal management
        openModal: (modalName: keyof TUIStoreState['modals']) => {
          set((state) => ({
            modals: {
              ...state.modals,
              [modalName]: true,
            },
          }));
        },

        closeModal: (modalName: keyof TUIStoreState['modals']) => {
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
              createWorkflow: false,
              editWorkflow: false,
              createBrowserSession: false,
              editBrowserSession: false,
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
            mobileMenuOpen: false, // Always close mobile menu on reset
          });
        },
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({
          // Only persist user preferences, not temporary UI state
          sidebarOpen: state.sidebarOpen,
          theme: state.theme,
          expandedNodeGroups: Array.from(state.expandedNodeGroups), // Convert Set to Array for persistence
          nodesViewMode: state.nodesViewMode,
          // Don't persist activePage, mobileMenuOpen, or hasHydrated as they should reset on app start
        }),
        // Add version for future migrations
        version: 1,
        migrate: (persistedState: unknown, version: number) => {
          // Handle future migrations here
          if (version === 0) {
            // Example migration from v0 to v1
            return {
              ...(persistedState as TUIStoreState),
              mobileMenuOpen: false,
              expandedNodeGroups: new Set<string>(),
            };
          }
          
          // Convert expandedNodeGroups array back to Set if it exists
          if (persistedState && typeof persistedState === 'object') {
            const state = persistedState as Record<string, unknown>;
            if (Array.isArray(state.expandedNodeGroups)) {
              state.expandedNodeGroups = new Set(state.expandedNodeGroups);
            }
          }
          
          return persistedState;
        },
        onRehydrateStorage: () => (state) => {
          // Convert expandedNodeGroups array back to Set after rehydration
          if (state && Array.isArray(state.expandedNodeGroups)) {
            state.expandedNodeGroups = new Set(state.expandedNodeGroups);
          }
          // Mark as hydrated
          if (state) {
            state.hasHydrated = true;
          }
        },
      }
    ),
    {
      name: 'ui-store',
    }
  )
);

// Optimized selectors for better performance
export const uiSelectors = {
  // Sidebar selectors
  getSidebarState: () => useUIStore.getState().sidebarOpen,
  
  // Mobile menu selectors
  getMobileMenuState: () => useUIStore.getState().mobileMenuOpen,
  
  // Node group expansion selectors
  getExpandedNodeGroups: () => useUIStore.getState().expandedNodeGroups,
  isNodeGroupExpanded: (nodeGroup: string) => useUIStore.getState().expandedNodeGroups.has(nodeGroup),
  
  // Theme selectors
  getTheme: () => useUIStore.getState().theme,
  
  // Page selectors
  getActivePage: () => useUIStore.getState().activePage,
  
  // TNotification selectors
  getTNotifications: () => useUIStore.getState().notifications,
  getUnreadTNotifications: () => 
    useUIStore.getState().notifications.filter(n => !n.read),
  
  // Modal selectors
  getModalState: (modalName: keyof TUIStoreState['modals']) => 
    useUIStore.getState().modals[modalName],
  getOpenModals: () => {
    const modals = useUIStore.getState().modals;
    return Object.entries(modals)
      .filter(([, isOpen]) => isOpen)
      .map(([modalName]) => modalName);
  },
  
  // TBreadcrumb selectors
  getTBreadcrumbs: () => useUIStore.getState().breadcrumbs,
};

// Helper functions for common UI operations
export const uiHelpers = {
  // TNotification helpers
  showSuccess: (title: string, message: string) => {
    useUIStore.getState().addTNotification({
      type: 'success',
      title,
      message,
      read: false,
    });
  },

  showError: (title: string, message: string) => {
    useUIStore.getState().addTNotification({
      type: 'error',
      title,
      message,
      read: false,
    });
  },

  showWarning: (title: string, message: string) => {
    useUIStore.getState().addTNotification({
      type: 'warning',
      title,
      message,
      read: false,
    });
  },

  showInfo: (title: string, message: string) => {
    useUIStore.getState().addTNotification({
      type: 'info',
      title,
      message,
      read: false,
    });
  },

  // TBreadcrumb helpers
  setPageTBreadcrumbs: (page: string, additionalTBreadcrumbs: TBreadcrumb[] = []) => {
    const breadcrumbs: TBreadcrumb[] = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: page, isActive: true },
      ...additionalTBreadcrumbs,
    ];
    useUIStore.getState().setTBreadcrumbs(breadcrumbs);
  },

  // Modal helpers
  openCreateWorkflowModal: () => {
    useUIStore.getState().openModal('createWorkflow');
  },

  openEditWorkflowModal: () => {
    useUIStore.getState().openModal('editWorkflow');
  },

  // Mobile menu helpers
  toggleMobileMenu: () => {
    useUIStore.getState().toggleMobileMenu();
  },

  closeMobileMenu: () => {
    useUIStore.getState().closeMobileMenu();
  },

  // Node group expansion helpers
  toggleNodeGroup: (nodeGroup: string) => {
    useUIStore.getState().toggleNodeGroup(nodeGroup);
  },

  expandAllNodeGroups: (nodeGroups: string[]) => {
    useUIStore.getState().expandAllNodeGroups(nodeGroups);
  },

  collapseAllNodeGroups: () => {
    useUIStore.getState().collapseAllNodeGroups();
  },
};

