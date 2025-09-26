import { cvtXYPositionToWorkFlowPosition } from '@/lib/typeConverter';
import { TExecutionResponse, TFileUploadResponse, TNodeType, TWorkFlow, TWorkflowEdge, TWorkflowNode, TWorkFlowNodePosition } from '@/types/backendService';
import { Connection, Edge, XYPosition } from '@xyflow/react';
import apiClient from '@/lib/apiClient';
import { withErrorHandling } from '@/lib/errorHandler';

export const backendService = {
  getWorkFlows: async (): Promise<TWorkFlow[] | undefined> => {
    return withErrorHandling(
      async () => {
        const response = await apiClient.get("/workflow/");
        return response.data;
      },
      'Failed to load workflows'
    );
  },
  getWorkFlow: async (workflow_id: string): Promise<TWorkFlow | undefined> => {
    return withErrorHandling(
      async () => {
        const response = await apiClient.get(`/workflow/${workflow_id}/`);
        return response.data;
      },
      'Failed to load workflow'
    );
  },
  getWorkFlowNodeTypes: async (): Promise<TNodeType[] | undefined> => {
    return withErrorHandling(
      async () => {
        const response = await apiClient.get(`/node-types/`);
        return response.data;
      },
      'Failed to load node types'
    );
  },
  getWorkFlowNodes: async (workflow_id: string): Promise<TWorkflowNode[] | undefined> => {
    return withErrorHandling(
      async () => {
        const response = await apiClient.get(`/workflow/${workflow_id}/nodes/`);
        return response.data;
      },
      'Failed to load workflow nodes'
    );
  },
  getWorkFlowConnections: async (workflow_id: string): Promise<TWorkflowEdge[] | undefined> => {
    return withErrorHandling(
      async () => {
        const response = await apiClient.get(`/workflow/${workflow_id}/connections/`);
        return response.data;
      },
      'Failed to load workflow connections'
    );
  },
  postWorkFlowNode: async (workflow_id: string, node_type_id: string): Promise<TWorkflowNode | undefined> => {
    return withErrorHandling(
      async () => {
        const data = { node_type: node_type_id, data: {} }
        const response = await apiClient.post(`/workflow/${workflow_id}/nodes/`, data);
        return response.data;
      },
      'Failed to create node'
    );
  },
  postWorkFlowConnection: async (workflow_id: string, connection: Connection): Promise<TWorkflowEdge | undefined> => {
    return withErrorHandling(
      async () => {
        const data = { source_node: connection.source, target_node: connection.target }
        const response = await apiClient.post(`/workflow/${workflow_id}/connections/`, data);
        return response.data;
      },
      'Failed to create connection'
    );
  },
  deleteWorkFlowNode: async (workflow_id: string, node_id: string): Promise<boolean | undefined> => {
    return withErrorHandling(
      async () => {
        const response = await apiClient.delete(`/workflow/${workflow_id}/nodes/${node_id}/`);
        if (response.status === 204) {
          return true
        }
        return false
      },
      'Delete Failed'
    );
  },
  deleteWorkFlowConnection: async (workflow_id: string, edge_id: string): Promise<boolean | undefined> => {
    return withErrorHandling(
      async () => {
        const response = await apiClient.delete(`/workflow/${workflow_id}/connections/${edge_id}/`);
        if (response.status === 204) {
          return true
        }
        return false
      },
      'Failed to delete connection'
    );
  },
  patchWorkFlowNodePosition: async (workflow_id: string, node_id: string, position: XYPosition): Promise<TWorkflowNode | undefined> => {
    return withErrorHandling(
      async () => {
        const newNodePosition = cvtXYPositionToWorkFlowPosition(position);
        const response = await apiClient.patch(`/workflow/${workflow_id}/nodes/${node_id}/`, newNodePosition);
        return response.data;
      },
      'Failed to update node position'
    );
  },
  patchWorkFlowNodeData: async (workflow_id: string, node_id: string, data: Record<string, any>): Promise<TWorkflowNode | undefined> => {
    return withErrorHandling(
      async () => {
        const newNodeData = {data:data};
        const response = await apiClient.patch(`/workflow/${workflow_id}/nodes/${node_id}/`, newNodeData);
        return response.data;
      },
      'Save Failed'
    );
  },
  startWorkFlowExecution: async (workflow_id: string): Promise<TExecutionResponse | undefined> => {
    return withErrorHandling(
      async () => {
        const response = await apiClient.get(`/workflow/${workflow_id}/start_execution`);
        return response.data;
      },
      'Failed to start workflow execution'
    );
  },
  stopWorkFlowExecution: async (workflow_id: string): Promise<TExecutionResponse | undefined> => {
    return withErrorHandling(
      async () => {
        const response = await apiClient.get(`/workflow/${workflow_id}/stop_execution`);
        return response.data;
      },
      'Failed to stop workflow execution'
    );
  },
  uploadWorkFlowNodeFile: async (workflow_id: string, node_id: string, key: string, file: File): Promise<TFileUploadResponse | undefined> => {
    return withErrorHandling(
      async () => {
        const formData = new FormData();
        formData.append('key', key);
        formData.append('file', file);
        
        const response = await apiClient.post(`/workflow/${workflow_id}/nodes/${node_id}/files/upload/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      },
      `File Upload Failed: ${key}`
    );
  },
  deleteWorkFlowNodeFile: async (workflow_id: string, node_id: string, file_id: string): Promise<boolean | undefined> => {
    return withErrorHandling(
      async () => {
        const response = await apiClient.delete(`/workflow/${workflow_id}/nodes/${node_id}/files/${file_id}/`);
        if (response.status === 204) {
          return true;
        }
        return false;
      },
      'File Delete Failed'
    );
  }

}