import { cvtXYPositionToWorkFlowPosition } from '@/lib/typeConverter';
import { TExecutionResponse, TFileUploadResponse, TNodeType, TWorkFlow, TWorkflowEdge, TWorkflowNode, TWorkFlowNodePosition } from '@/types/backendService';
import { Connection, Edge, XYPosition } from '@xyflow/react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

const backend = axios.create({
  baseURL: API_BASE_URL,

});

export const backendService = {
  getWorkFlows: async (): Promise<TWorkFlow[]> => {
    const response = await backend.get("/workflow/");
    return response.data;
  },
  getWorkFlow: async (workflow_id: string): Promise<TWorkFlow> => {
    const response = await backend.get(`/workflow/${workflow_id}/`);
    return response.data;
  },
  getWorkFlowNodeTypes: async (): Promise<TNodeType[]> => {
    const response = await backend.get(`/node-types/`);
    return response.data;
  },
  getWorkFlowNodes: async (workflow_id: string): Promise<TWorkflowNode[]> => {
    const response = await backend.get(`/workflow/${workflow_id}/nodes/`);
    return response.data;
  },
  getWorkFlowConnections: async (workflow_id: string): Promise<TWorkflowEdge[]> => {
    const response = await backend.get(`/workflow/${workflow_id}/connections/`);
    return response.data;
  },
  postWorkFlowNode: async (workflow_id: string, node_type_id: string): Promise<TWorkflowNode> => {
    const data = { node_type: node_type_id, data: {} }
    const response = await backend.post(`/workflow/${workflow_id}/nodes/`, data);
    return response.data;
  },
  postWorkFlowConnection: async (workflow_id: string, connection: Connection): Promise<TWorkflowEdge> => {
    const data = { source_node: connection.source, target_node: connection.target }
    const response = await backend.post(`/workflow/${workflow_id}/connections/`, data);
    return response.data;
  },
  deleteWorkFlowNode: async (workflow_id: string, node_id: string): Promise<boolean> => {
    const response = await backend.delete(`/workflow/${workflow_id}/nodes/${node_id}/`);
    if (response.status === 204) {
      return true
    }
    return false
  },
  deleteWorkFlowConnection: async (workflow_id: string, edge_id: string): Promise<boolean> => {
    const response = await backend.delete(`/workflow/${workflow_id}/connections/${edge_id}/`);
    if (response.status === 204) {
      return true
    }
    return false
  },
  patchWorkFlowNodePosition: async (workflow_id: string, node_id: string, position: XYPosition): Promise<TWorkflowNode> => {
    const newNodePosition = cvtXYPositionToWorkFlowPosition(position);
    const response = await backend.patch(`/workflow/${workflow_id}/nodes/${node_id}/`, newNodePosition);
    return response.data;
  },
  patchWorkFlowNodeData: async (workflow_id: string, node_id: string, data: Record<string, any>): Promise<TWorkflowNode> => {
    const newNodeData = {data:data};
    const response = await backend.patch(`/workflow/${workflow_id}/nodes/${node_id}/`, newNodeData);
    return response.data;
  },
  startWorkFlowExecution:async(workflow_id:string):Promise<TExecutionResponse>=>{
    const response = await backend.get(`/workflow/${workflow_id}/start_execution`);
    return response.data;
  },
  stopWorkFlowExecution:async(workflow_id:string):Promise<TExecutionResponse>=>{
    const response = await backend.get(`/workflow/${workflow_id}/stop_execution`);
    return response.data;
  },
  uploadWorkFlowNodeFile: async (workflow_id: string, node_id: string, key: string, file: File): Promise<TFileUploadResponse> => {
    const formData = new FormData();
    formData.append('key', key);
    formData.append('file', file);
    
    const response = await backend.post(`/workflow/${workflow_id}/nodes/${node_id}/files/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

}