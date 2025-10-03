import { User, Node, Workflow, Project, FormConfiguration } from '../common';

// UI State Types
export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  activePage: string;
  breadcrumbs: Breadcrumb[];
  notifications: Notification[];
}

export interface Breadcrumb {
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Store State Types
export interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface NodesState {
  nodes: Node[];
  selectedNode: Node | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    type?: string;
    category?: string;
    search?: string;
  };
}

export interface WorkflowState {
  workflows: Workflow[];
  activeWorkflow: Workflow | null;
  isLoading: boolean;
  error: string | null;
  selectedNodes: string[];
  selectedConnections: string[];
}

export interface ProjectsState {
  projects: Project[];
  activeProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

export interface FormState {
  configurations: FormConfiguration[];
  activeConfiguration: FormConfiguration | null;
  isLoading: boolean;
  error: string | null;
}

export interface UIStoreState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  activePage: string;
  pageTitle: string;
  breadcrumbs: Breadcrumb[];
  notifications: Notification[];
  modals: {
    createNode: boolean;
    editNode: boolean;
    createWorkflow: boolean;
    editWorkflow: boolean;
    createProject: boolean;
    editProject: boolean;
  };
}
