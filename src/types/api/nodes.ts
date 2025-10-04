export interface TBackendNode {
  id: string;
  name: string;
  type: string;
  category: string;
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
