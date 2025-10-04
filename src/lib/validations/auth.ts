import { z } from 'zod';
import { VALIDATION } from '@/constants';

// Login form validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email(VALIDATION.email.message),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(VALIDATION.password.minLength, `Password must be at least ${VALIDATION.password.minLength} characters`),
});

// Signup form validation schema
export const signupSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(VALIDATION.name.minLength, `First name must be at least ${VALIDATION.name.minLength} characters`)
    .max(VALIDATION.name.maxLength, `First name must be no more than ${VALIDATION.name.maxLength} characters`)
    .regex(VALIDATION.name.pattern, VALIDATION.name.message),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(VALIDATION.name.minLength, `Last name must be at least ${VALIDATION.name.minLength} characters`)
    .max(VALIDATION.name.maxLength, `Last name must be no more than ${VALIDATION.name.maxLength} characters`)
    .regex(VALIDATION.name.pattern, VALIDATION.name.message),
  email: z
    .string()
    .min(1, 'Email is required')
    .email(VALIDATION.email.message),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(VALIDATION.password.minLength, `Password must be at least ${VALIDATION.password.minLength} characters`)
    .regex(VALIDATION.password.pattern, VALIDATION.password.message),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email(VALIDATION.email.message),
});

// Password reset schema
export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(VALIDATION.password.minLength, `Password must be at least ${VALIDATION.password.minLength} characters`)
    .regex(VALIDATION.password.pattern, VALIDATION.password.message),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type PasswordResetRequestData = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetData = z.infer<typeof passwordResetSchema>;
