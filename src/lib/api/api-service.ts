/**
 * @deprecated This file is deprecated. Import from '@/lib/api/services' instead.
 * 
 * This file re-exports all API services from their domain-specific modules.
 * The deprecated ApiService class has been removed. Please use the domain-specific
 * services directly:
 * - workflowApi for workflow operations
 * - authApi for authentication operations
 * - nodeApi for node registry operations
 * - demoApi for demo request operations
 */

// Re-export everything from the new service modules
export * from './services';
