import { z } from 'zod';
import { NODE_TYPES } from '@/constants';

// Node creation/update validation schema
export const nodeSchema = z.object({
  name: z
    .string()
    .min(1, 'Node name is required')
    .min(2, 'Node name must be at least 2 characters')
    .max(100, 'Node name must be no more than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be no more than 500 characters')
    .optional(),
  type: z
    .enum(Object.values(NODE_TYPES) as [string, ...string[]], {
      errorMap: () => ({ message: 'Please select a valid node type' }),
    }),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be no more than 50 characters'),
  tags: z
    .array(z.string().min(1).max(30))
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  isActive: z.boolean().optional().default(true),
  configuration: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
});

// Node filter validation schema
export const nodeFilterSchema = z.object({
  type: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

// Node bulk operations schema
export const nodeBulkOperationSchema = z.object({
  nodeIds: z
    .array(z.string().uuid('Invalid node ID format'))
    .min(1, 'At least one node must be selected')
    .max(100, 'Maximum 100 nodes can be processed at once'),
  operation: z.enum(['delete', 'activate', 'deactivate', 'update']),
  data: z.record(z.any()).optional(),
});

// Type exports
export type NodeFormData = z.infer<typeof nodeSchema>;
export type NodeFilterData = z.infer<typeof nodeFilterSchema>;
export type NodeBulkOperationData = z.infer<typeof nodeBulkOperationSchema>;
