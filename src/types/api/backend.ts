// Backend API response types (as they come from the server)
export interface BackendNode {
  id: string;
  name: string;
  type: string;
  node_group: string;
  node_group_name: string;
  node_group_icon?: string;
  description?: string;
  version?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  form_configuration?: Record<string, unknown>;
  tags?: string[];
  logo?: string;
}

export interface BackendNodeGroup {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BackendWorkflowCanvasResponse {
  nodes: BackendWorkflowNode[];
  edges: BackendWorkflowConnection[];
  workflow: {
    id: string;
    name: string;
    description: string;
    status: string;
  };
}

export interface BackendWorkflowNode {
  id: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    description: string;
    icon?: string;
    category: string;
    type: string;
    template_id?: string;
  };
  node_template?: {
    id: string;
    name: string;
    type: string;
    description?: string;
    logo?: string;
    form_configuration: Record<string, unknown>;
    tags: string[];
  } | null;
}

export interface BackendWorkflowConnection {
  id: string;
  source: string;
  target: string;
}

export interface BackendNodeTemplate {
  id: string;
  name: string;
  category: string;
  description?: string;
  icon?: string;
}

export interface BackendProject {
  id: string;
  name: string;
  description: string;
  status: string;
  workflows: string[];
  team: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
}

export interface BackendAuthResponse {
  user: BackendUser;
  token: string;
  refresh_token?: string;
}
