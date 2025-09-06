import { NodeType, WorkFlow, WorkflowEdge, WorkflowNode } from '@/types/backendService';
import { Edge } from '@xyflow/react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

const backend = axios.create({
  baseURL: API_BASE_URL,

});

export const backendService={
    getWorkFlows:async ():Promise<WorkFlow[]>=>{
        const response = await backend.get("/workflow/");
        return response.data;
    },
    getWorkFlow:async(workflow_id:string):Promise<WorkFlow>=>{
      const response = await backend.get(`/workflow/${workflow_id}/`);
      return response.data;
    },
    getWorkFlowNodeTypes:async():Promise<NodeType[]>=>{
      const response = await backend.get(`/node-types/`);
      return response.data;
    },
    getWorkFlowNodes:async(workflow_id:string):Promise<WorkflowNode[]>=>{
      const response = await backend.get(`/workflow/${workflow_id}/nodes/`);
      return response.data;
    },
    getWorkFlowConnections:async(workflow_id:string):Promise<WorkflowEdge[]>=>{
      const response = await backend.get(`/workflow/${workflow_id}/connections/`);
      return response.data;
    }

}