import { TUser, TNode, TWorkflow, TFormConfiguration } from '../common';

// UI State Types
export interface TUIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  activePage: string;
  breadcrumbs: TBreadcrumb[];
  notifications: TNotification[];
}

export interface TBreadcrumb {
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface TNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Store State Types
export interface TUserState {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface TNodesState {
  nodes: TNode[];
  selectedNode: TNode | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    type?: string;
    category?: string;
    search?: string;
  };
}

export interface TWorkflowState {
  workflows: TWorkflow[];
  activeWorkflow: TWorkflow | null;
  isLoading: boolean;
  error: string | null;
  selectedNodes: string[];
  selectedConnections: string[];
}


export interface TFormState {
  configurations: TFormConfiguration[];
  activeConfiguration: TFormConfiguration | null;
  isLoading: boolean;
  error: string | null;
}

export interface TUIStoreState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  activePage: string;
  pageTitle: string;
  breadcrumbs: TBreadcrumb[];
  notifications: TNotification[];
  modals: {
    createNode: boolean;
    editNode: boolean;
    createWorkflow: boolean;
    editWorkflow: boolean;
  };
  mobileMenuOpen: boolean;
  expandedNodeGroups: Set<string>;
  hasHydrated: boolean;
}
