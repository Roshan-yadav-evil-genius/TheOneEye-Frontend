// Store Types and Interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
}

export interface Node {
  id: string;
  name: string;
  type: 'trigger' | 'action' | 'logic' | 'system';
  category: string;
  description: string;
  version: string;
  isActive: boolean;
  createdAt: string; // ISO string format from backend
  updatedAt: string; // ISO string format from backend
  createdBy: string; // Username of the creator
  formConfiguration: Record<string, unknown>; // SurveyJS form configuration JSON
  tags: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  connections: WorkflowConnection[];
  status: 'draft' | 'active' | 'paused' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface WorkflowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold';
  workflows: string[]; // Workflow IDs
  team: string[]; // User IDs
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface FormConfiguration {
  id: string;
  name: string;
  description: string;
  json: Record<string, any>;
  nodeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

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
