import { axiosApiClient } from '../axios-client';
import { DemoRequest, DemoRequestCreateData } from '@/types';

/**
 * Demo API Service
 * Handles all demo request-related API operations
 */
class DemoApiService {
  async createDemoRequest(demoData: DemoRequestCreateData): Promise<DemoRequest> {
    return axiosApiClient.post<DemoRequest>('/demo-requests/', demoData);
  }

  async getDemoRequests(): Promise<DemoRequest[]> {
    return axiosApiClient.get<DemoRequest[]>('/demo-requests/');
  }

  async getDemoRequest(id: string): Promise<DemoRequest> {
    return axiosApiClient.get<DemoRequest>(`/demo-requests/${id}/`);
  }

  async updateDemoRequestStatus(id: string, status: string, notes?: string): Promise<DemoRequest> {
    return axiosApiClient.patch<DemoRequest>(`/demo-requests/${id}/update_status/`, {
      status,
      notes
    });
  }
}

// Export singleton instance
export const demoApi = new DemoApiService();

// Export individual methods for easier importing
export const {
  createDemoRequest,
  getDemoRequests,
  getDemoRequest,
  updateDemoRequestStatus,
} = demoApi;

