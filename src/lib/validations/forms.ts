import { z } from 'zod';

// Form field validation schema
export const formFieldSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'email', 'password', 'number', 'textarea', 'select', 'checkbox', 'radio', 'date', 'file']),
  label: z.string().min(1, 'Field label is required'),
  placeholder: z.string().optional(),
  required: z.boolean().optional().default(false),
  validation: z.object({
    minLength: z.number().min(0).optional(),
    maxLength: z.number().min(1).optional(),
    pattern: z.string().optional(),
    message: z.string().optional(),
  }).optional(),
  options: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional(),
  defaultValue: z.any().optional(),
});

// Form configuration validation schema
export const formConfigurationSchema = z.object({
  name: z
    .string()
    .min(1, 'Form name is required')
    .min(2, 'Form name must be at least 2 characters')
    .max(100, 'Form name must be no more than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be no more than 500 characters')
    .optional(),
  fields: z
    .array(formFieldSchema)
    .min(1, 'Form must have at least one field'),
  settings: z.object({
    allowMultipleSubmissions: z.boolean().optional().default(false),
    requireAuthentication: z.boolean().optional().default(false),
    showProgressBar: z.boolean().optional().default(true),
    submitButtonText: z.string().optional().default('Submit'),
    successMessage: z.string().optional().default('Form submitted successfully'),
    redirectUrl: z.string().url().optional(),
  }).optional(),
  styling: z.object({
    theme: z.enum(['light', 'dark', 'auto']).optional().default('auto'),
    primaryColor: z.string().optional(),
    borderRadius: z.enum(['none', 'small', 'medium', 'large']).optional().default('medium'),
    spacing: z.enum(['compact', 'normal', 'relaxed']).optional().default('normal'),
  }).optional(),
  validation: z.object({
    validateOnSubmit: z.boolean().optional().default(true),
    showInlineErrors: z.boolean().optional().default(true),
    errorMessagePosition: z.enum(['top', 'bottom', 'inline']).optional().default('bottom'),
  }).optional(),
});

// Form submission validation schema
export const formSubmissionSchema = z.object({
  formId: z.string().uuid('Invalid form ID format'),
  data: z.record(z.any()),
  metadata: z.object({
    userAgent: z.string().optional(),
    ipAddress: z.string().optional(),
    timestamp: z.date().optional(),
    userId: z.string().optional(),
  }).optional(),
});

// Form response validation schema
export const formResponseSchema = z.object({
  id: z.string().uuid(),
  formId: z.string().uuid(),
  data: z.record(z.any()),
  submittedAt: z.date(),
  submittedBy: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional().default('pending'),
  notes: z.string().optional(),
});

// Type exports
export type FormFieldData = z.infer<typeof formFieldSchema>;
export type FormConfigurationData = z.infer<typeof formConfigurationSchema>;
export type FormSubmissionData = z.infer<typeof formSubmissionSchema>;
export type FormResponseData = z.infer<typeof formResponseSchema>;
