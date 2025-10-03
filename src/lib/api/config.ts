// API Configuration - Switch between real and mock API
import { mockNodesApi } from './mock-nodes';
import { realNodesApi } from './real-nodes';

// Use real API by default, but allow switching to mock for development
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

// Export the appropriate API client
export const getNodesApi = () => USE_MOCK_API ? mockNodesApi : realNodesApi;
