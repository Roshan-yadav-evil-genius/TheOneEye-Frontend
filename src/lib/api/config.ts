// API Configuration - Switch between real and mock API
import { mockNodesApi } from './mock-nodes';
import { realNodesApi } from './real-nodes';
import { axiosNodesApi } from './axios-nodes';

// Use real API by default, but allow switching to mock for development
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
const USE_AXIOS_API = process.env.NEXT_PUBLIC_USE_AXIOS_API !== 'false'; // Default to true

// Export the appropriate API client
export const getNodesApi = () => {
  if (USE_MOCK_API) {
    return mockNodesApi;
  }
  return USE_AXIOS_API ? axiosNodesApi : realNodesApi;
};
