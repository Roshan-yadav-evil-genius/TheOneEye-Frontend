/**
 * Navigation Configuration
 * 
 * Centralized navigation configuration for the application.
 * This file contains all navigation-related constants.
 */
import {
  IconBrowser,
  IconDashboard,
  IconListDetails,
  IconKey,
  IconComponents,
} from '@tabler/icons-react';

export interface NavItem {
  title: string;
  url: string;
  icon: typeof IconDashboard;
  badge?: string;
  children?: NavItem[];
}

export interface UserInfo {
  name: string;
  email: string;
  avatar: string;
}

/**
 * Main navigation items for the sidebar
 */
export const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: IconDashboard,
  },
  {
    title: 'Workflow',
    url: '/workflow',
    icon: IconListDetails,
  },
  {
    title: 'Nodes',
    url: '/nodes',
    icon: IconComponents,
  },
  {
    title: 'Sessions',
    url: '/browser-sessions',
    icon: IconBrowser,
  },
  {
    title: 'Auth',
    url: '/auth',
    icon: IconKey,
  },
];

/**
 * Default user info (fallback when not authenticated)
 */
export const defaultUserInfo: UserInfo = {
  name: 'Guest User',
  email: 'guest@example.com',
  avatar: '',
};

/**
 * Get navigation items by section
 */
export const getNavItemsBySection = (section: 'main' | 'settings' = 'main'): NavItem[] => {
  switch (section) {
    case 'main':
      return mainNavItems;
    case 'settings':
      return []; // Add settings nav items here if needed
    default:
      return mainNavItems;
  }
};

