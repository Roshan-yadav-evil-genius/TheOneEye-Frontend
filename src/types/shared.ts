/**
 * Shared type definitions between frontend and backend
 * These types should match the backend serializer structures
 */

/**
 * Common API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

/**
 * Error response structure
 */
export interface ApiErrorResponse {
  error: string;
  detail?: string;
  code?: string;
  field_errors?: Record<string, string[]>;
}

/**
 * Common status types
 */
export type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Common entity with timestamps
 */
export interface TimestampedEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Common entity with user tracking
 */
export interface UserTrackedEntity extends TimestampedEntity {
  created_by: string;
  updated_by?: string;
}

