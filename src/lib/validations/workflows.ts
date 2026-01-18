import { z } from 'zod';
import { WORKFLOW_STATUS } from '@/constants';
import { WorkflowType } from '@/types/common/constants';

// Workflow creation/update validation schema
export const workflowSchema = z.object({
  name: z
    .string()
    .min(1, 'Workflow name is required')
    .min(2, 'Workflow name must be at least 2 characters')
    .max(100, 'Workflow name must be no more than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be no more than 500 characters')
    .optional(),
  workflow_type: z
    .enum(Object.values(WorkflowType) as [string, ...string[]], {
      errorMap: () => ({ message: 'Please select a valid workflow type' }),
    })
    .optional()
    .default(WorkflowType.PRODUCTION),
  status: z
    .enum(Object.values(WORKFLOW_STATUS) as [string, ...string[]], {
      errorMap: () => ({ message: 'Please select a valid workflow status' }),
    })
    .optional()
    .default(WORKFLOW_STATUS.DRAFT),
  isActive: z.boolean().optional().default(true),
  triggerConfig: z.record(z.any()).optional(),
  steps: z
    .array(z.object({
      id: z.string(),
      type: z.string(),
      name: z.string(),
      configuration: z.record(z.any()).optional(),
      position: z.object({
        x: z.number(),
        y: z.number(),
      }),
    }))
    .min(1, 'Workflow must have at least one step')
    .optional(),
  connections: z
    .array(z.object({
      id: z.string(),
      source: z.string(),
      target: z.string(),
      sourceHandle: z.string().optional(),
      targetHandle: z.string().optional(),
    }))
    .optional(),
  metadata: z.record(z.any()).optional(),
});

// Workflow execution schema
export const workflowExecutionSchema = z.object({
  workflowId: z.string().uuid('Invalid workflow ID format'),
  inputData: z.record(z.any()).optional(),
  options: z.object({
    timeout: z.number().min(1000).max(300000).optional(), // 1 second to 5 minutes
    retryAttempts: z.number().min(0).max(5).optional(),
    priority: z.enum(['low', 'normal', 'high']).optional(),
  }).optional(),
});

// Workflow filter validation schema
export const workflowFilterSchema = z.object({
  status: z.string().optional(),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  createdBy: z.string().optional(),
  dateRange: z.object({
    start: z.date().optional(),
    end: z.date().optional(),
  }).optional(),
});

// Type exports
export type WorkflowFormData = z.infer<typeof workflowSchema>;
export type WorkflowExecutionData = z.infer<typeof workflowExecutionSchema>;
export type WorkflowFilterData = z.infer<typeof workflowFilterSchema>;
