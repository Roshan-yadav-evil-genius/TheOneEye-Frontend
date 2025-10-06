import { axiosApiClient } from './axios-client';
import { FormValuesApi, FormValuesResponse, FormValuesSaveRequest } from '@/types/forms/form-values';

class NodeFormValuesApi implements FormValuesApi {
  async getFormValues(workflowId: string, nodeId: string, userId: string): Promise<FormValuesResponse> {
    const response = await axiosApiClient.get<FormValuesResponse>(
      `/workflow/${workflowId}/nodes/${nodeId}/form-values/`,
      {
        params: { user_id: userId }
      }
    );
    return response;
  }

  async saveFormValues(workflowId: string, nodeId: string, data: FormValuesSaveRequest): Promise<FormValuesResponse> {
    const response = await axiosApiClient.post<FormValuesResponse>(
      `/workflow/${workflowId}/nodes/${nodeId}/form-values/`,
      data
    );
    return response;
  }

  async clearFormValues(workflowId: string, nodeId: string, userId: string): Promise<void> {
    await axiosApiClient.delete(
      `/workflow/${workflowId}/nodes/${nodeId}/form-values/`,
      {
        data: { user_id: userId }
      }
    );
  }
}

export const nodeFormValuesApi = new NodeFormValuesApi();
