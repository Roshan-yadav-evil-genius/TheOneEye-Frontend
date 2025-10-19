import { useUIStore, uiHelpers } from '@/stores';

/**
 * Hook for managing mobile menu state using Zustand store
 * This replaces the old useMobileMenu hook with centralized state management
 */
export const useMobileMenuStore = () => {
  const mobileMenuOpen = useUIStore((state) => state.mobileMenuOpen);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const setMobileMenuOpen = useUIStore((state) => state.setMobileMenuOpen);
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);

  return {
    isOpen: mobileMenuOpen,
    toggleMenu: toggleMobileMenu,
    setOpen: setMobileMenuOpen,
    closeMenu: closeMobileMenu,
    // Helper functions for convenience
    toggle: uiHelpers.toggleMobileMenu,
    close: uiHelpers.closeMobileMenu,
  };
};
