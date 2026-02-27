// Re-export all API services
export * from './workflow-api';
export * from './auth-api';
export * from './node-api';
export * from './demo-api';
export * from './google-oauth-api';
export * from './browser-pool-api';

// Import service instances for convenience
import { workflowApi } from './workflow-api';
import { authApi } from './auth-api';
import { nodeApi } from './node-api';
import { demoApi } from './demo-api';
import { googleOAuthApi } from './google-oauth-api';

// Export service instances
export { workflowApi, authApi, nodeApi, demoApi, googleOAuthApi };

// Utility API functions (kept together as they don't belong to a specific domain)
import { axiosApiClient } from '../axios-client';

export async function healthCheck(): Promise<{ status: string; timestamp: string }> {
  try {
    // Use the workflow endpoint as a health check
    await axiosApiClient.get('/workflow/');
    return { status: 'ok', timestamp: new Date().toISOString() };
  } catch (error) {
    return { status: 'error', timestamp: new Date().toISOString() };
  }
}

export async function getApiVersion(): Promise<{ version: string; build: string }> {
  return axiosApiClient.get<{ version: string; build: string }>('/version/');
}

