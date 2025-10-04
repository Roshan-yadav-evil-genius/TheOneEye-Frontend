// Export all validation schemas
export * from './auth';
export * from './nodes';
export * from './workflows';
export * from './forms';

// Common validation utilities
import { z } from 'zod';

/**
 * Creates a validation schema for pagination parameters
 */
export const paginationSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

/**
 * Creates a validation schema for search parameters
 */
export const searchSchema = z.object({
  query: z.string().min(1).max(100).optional(),
  filters: z.record(z.any()).optional(),
});

/**
 * Creates a validation schema for date range
 */
export const dateRangeSchema = z.object({
  start: z.date().optional(),
  end: z.date().optional(),
}).refine((data) => {
  if (data.start && data.end) {
    return data.start <= data.end;
  }
  return true;
}, {
  message: 'Start date must be before or equal to end date',
  path: ['end'],
});

/**
 * Creates a validation schema for file upload
 */
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().optional().default(5 * 1024 * 1024), // 5MB default
  allowedTypes: z.array(z.string()).optional(),
}).refine((data) => {
  if (data.maxSize && data.file.size > data.maxSize) {
    return false;
  }
  return true;
}, {
  message: 'File size exceeds maximum allowed size',
  path: ['file'],
}).refine((data) => {
  if (data.allowedTypes && data.allowedTypes.length > 0) {
    const fileType = data.file.type;
    return data.allowedTypes.some(type => fileType.includes(type));
  }
  return true;
}, {
  message: 'File type not allowed',
  path: ['file'],
});

// Type exports
export type PaginationData = z.infer<typeof paginationSchema>;
export type SearchData = z.infer<typeof searchSchema>;
export type DateRangeData = z.infer<typeof dateRangeSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;
