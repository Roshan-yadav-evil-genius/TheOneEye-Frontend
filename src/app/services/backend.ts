import { WorkFlow } from '@/types/backendService';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const backend = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
    getWorkFlowNodes:async(workflow_id:string):Promise<WorkFlow>=>{
      const response = await backend.get(`/workflow/${workflow_id}/nodes/`);
      return response.data;
    },
    getWorkFlowConnections:async(workflow_id:string):Promise<WorkFlow>=>{
      const response = await backend.get(`/workflow/${workflow_id}/connections/`);
      return response.data;
    }

}