import { Node } from '../common';

// API Request Types
export interface NodeCreateData {
  name: string;
  type: Node['type'];
  category: string;
  description?: string;
  version?: string;
  isActive?: boolean; // Optional for creation, defaults to true
  formConfiguration?: Record<string, unknown>;
  tags?: string[];
  logoFile?: File; // Optional logo file
}

export interface NodeUpdateData extends Partial<NodeCreateData> {}

export interface NodeFilters {
  type?: string;
  category?: string;
  is_active?: boolean;
  tags?: string[];
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}
