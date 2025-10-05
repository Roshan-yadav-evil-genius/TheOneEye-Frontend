export interface TBackendNode {
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

export type TBackendPaginatedNodes = {
  count: number;
  next: string | null;
  previous: string | null;
  results: TBackendNode[];
} | TBackendNode[];
