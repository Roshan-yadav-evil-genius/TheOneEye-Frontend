// API Configuration - Using real backend API exclusively
import { axiosNodesApi } from './axios-nodes';

// Export the real API client
export const getNodesApi = () => {
  return axiosNodesApi;
};
