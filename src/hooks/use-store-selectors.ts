import { useCallback, useMemo, useState, useEffect } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { useNodesStore } from '@/stores/nodes-store';
import { useUserStore } from '@/stores/user-store';

// Custom hooks for optimized store access
export const useUI = () => {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const theme = useUIStore((state) => state.theme);
  const pageTitle = useUIStore((state) => state.pageTitle);
  const activePage = useUIStore((state) => state.activePage);
  
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const setTheme = useUIStore((state) => state.setTheme);
  const setPageTitle = useUIStore((state) => state.setPageTitle);
  const setActivePage = useUIStore((state) => state.setActivePage);
  
  return {
    sidebarOpen,
    theme,
    pageTitle,
    activePage,
    toggleSidebar,
    setTheme,
    setPageTitle,
    setActivePage,
  };
};

export const useNotifications = () => {
  const notifications = useUIStore((state) => state.notifications);
  const addNotification = useUIStore((state) => state.addNotification);
  const removeNotification = useUIStore((state) => state.removeNotification);
  const markNotificationAsRead = useUIStore((state) => state.markNotificationAsRead);
  const clearNotifications = useUIStore((state) => state.clearNotifications);
  
  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications]
  );
  
  const hasUnread = useMemo(
    () => unreadCount > 0,
    [unreadCount]
  );
  
  return {
    notifications,
    unreadCount,
    hasUnread,
    addNotification,
    removeNotification,
    markNotificationAsRead,
    clearNotifications,
  };
};

export const useModals = () => {
  const modals = useUIStore((state) => state.modals);
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);
  const closeAllModals = useUIStore((state) => state.closeAllModals);
  
  const isModalOpen = useCallback(
    (modalName: keyof typeof modals) => modals[modalName],
    [modals]
  );
  
  const openModals = useMemo(
    () => Object.entries(modals)
      .filter(([_, isOpen]) => isOpen)
      .map(([modalName, _]) => modalName),
    [modals]
  );
  
  return {
    modals,
    isModalOpen,
    openModals,
    openModal,
    closeModal,
    closeAllModals,
  };
};

export const useUser = () => {
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isLoading = useUserStore((state) => state.isLoading);
  const error = useUserStore((state) => state.error);
  
  const login = useUserStore((state) => state.login);
  const logout = useUserStore((state) => state.logout);
  const updateProfile = useUserStore((state) => state.updateProfile);
  
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
  };
};

export const useNodes = () => {
  const nodes = useNodesStore((state) => state.nodes);
  const selectedNode = useNodesStore((state) => state.selectedNode);
  const isLoading = useNodesStore((state) => state.isLoading);
  const error = useNodesStore((state) => state.error);
  const filters = useNodesStore((state) => state.filters);
  
  const loadNodes = useNodesStore((state) => state.loadNodes);
  const createNode = useNodesStore((state) => state.createNode);
  const updateNode = useNodesStore((state) => state.updateNode);
  const deleteNode = useNodesStore((state) => state.deleteNode);
  const selectNode = useNodesStore((state) => state.selectNode);
  const setFilters = useNodesStore((state) => state.setFilters);
  
  return {
    nodes,
    selectedNode,
    isLoading,
    error,
    filters,
    loadNodes,
    createNode,
    updateNode,
    deleteNode,
    selectNode,
    setFilters,
  };
};

// Hook for debounced search
export const useDebouncedSearch = (delay: number = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [searchTerm, delay]);
  
  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
  };
};

// Hook for pagination
export const usePagination = (totalItems: number, itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);
  
  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);
  
  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);
  
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);
  
  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    resetPagination,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};
