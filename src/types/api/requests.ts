import { TNode } from '../common';

// API Request Types
export interface TNodeCreateData {
  name: string;
  type: TNode['type'];
  category: string;
  description?: string;
  version?: string;
  isActive?: boolean; // Optional for creation, defaults to true
  formConfiguration?: Record<string, unknown>;
  tags?: string[];
  logoFile?: File; // Optional logo file
}

export type TNodeUpdateData = Partial<TNodeCreateData>

export interface TNodeFilters {
  type?: string;
  category?: string;
  is_active?: boolean;
  tags?: string[];
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}
