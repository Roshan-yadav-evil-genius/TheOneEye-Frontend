import { BaseApiService } from '../base-api-service';
import { 
  TWorkflow,
  TWorkflowConnection,
  TWorkflowCanvasData,
  TWorkflowNodeCreateRequest,
  TWorkflowConnectionCreateRequest,
  TWorkflowNodeCreateResponse,
  BackendWorkflowCanvasResponse,
  BackendWorkflowConnection,
  WorkflowNodeExecuteResponse,
} from '@/types';
import { BackendWorkflow } from '../transformers/workflow-transformer';

/**
 * Workflow API Service
 * Handles all workflow-related API operations including CRUD, canvas, and execution
 */
class WorkflowApiService extends BaseApiService {
  // Workflow CRUD operations
  async getWorkflows(): Promise<BackendWorkflow[]> {
    const response = await this.get<{ results: BackendWorkflow[] } | BackendWorkflow[]>('/workflow/');
    
    // Handle paginated response (DRF returns { results: [...] }) or direct array
    if (Array.isArray(response)) {
      return response;
    }
    
    // If it's a paginated response, return the results array
    if (response && typeof response === 'object' && 'results' in response) {
      return (response as { results: BackendWorkflow[] }).results;
    }
    
    // Fallback: return empty array if unexpected format
    return [];
  }

  async createWorkflow(workflowData: Partial<BackendWorkflow>): Promise<BackendWorkflow> {
    return this.post<BackendWorkflow>('/workflow/', workflowData);
  }

  async updateWorkflow(id: string, workflowData: Partial<BackendWorkflow>): Promise<BackendWorkflow> {
    return this.put<BackendWorkflow>(`/workflow/${id}/`, workflowData);
  }

  async deleteWorkflow(id: string): Promise<void> {
    return this.delete<void>(`/workflow/${id}/`);
  }

  // Workflow Canvas Operations
  async getWorkflowCanvasData(workflowId: string): Promise<TWorkflowCanvasData> {
    const requestKey = `workflow-canvas-${workflowId}`;
    
    return this.executeRequest(
      requestKey,
      async () => {
        const response = await this.get<BackendWorkflowCanvasResponse>(
          `/workflow/${workflowId}/canvas_data/`
        );
        
        // Transform the response to match our types
        return {
          nodes: response.nodes,
          edges: response.edges,
          workflow: response.workflow
        };
      }
    );
  }

  async addNodeToWorkflow(
    workflowId: string, 
    nodeData: TWorkflowNodeCreateRequest
  ): Promise<TWorkflowNodeCreateResponse> {
    const response = await this.post<TWorkflowNodeCreateResponse>(`/workflow/${workflowId}/nodes/add/`, nodeData);
    
    return {
      id: response.id,
      position: response.position,
      form_values: response.form_values,
      node_type: response.node_type
    };
  }

  async updateNodePosition(
    workflowId: string, 
    nodeId: string, 
    position: { x: number; y: number }
  ): Promise<void> {
    return this.patch(`/workflow/${workflowId}/nodes/${nodeId}/position/`, {
      position
    });
  }

  async removeNodeFromWorkflow(workflowId: string, nodeId: string): Promise<void> {
    return this.delete(`/workflow/${workflowId}/nodes/${nodeId}/remove/`);
  }

  async addConnectionToWorkflow(
    workflowId: string, 
    connectionData: TWorkflowConnectionCreateRequest
  ): Promise<TWorkflowConnection> {
    const response = await this.post<BackendWorkflowConnection>(`/workflow/${workflowId}/connections/add/`, connectionData);
    return {
      id: response.id,
      source: response.source_node,
      target: response.target_node,
      sourceHandle: response.source_handle || 'default',
    };
  }

  async removeConnectionFromWorkflow(workflowId: string, connectionId: string): Promise<void> {
    return this.delete(`/workflow/${workflowId}/connections/${connectionId}/remove/`);
  }

  async updateNodeFormValues(
    workflowId: string, 
    nodeId: string, 
    formValues: Record<string, unknown>
  ): Promise<void> {
    return this.patch(`/workflow/${workflowId}/nodes/${nodeId}/`, {
      form_values: formValues
    });
  }

  // Workflow Execution Operations
  async getTaskStatus(taskId: string): Promise<{ state: string; result?: unknown; error?: string; progress?: number }> {
    return this.get<{ state: string; result?: unknown; error?: string; progress?: number }>(`/celery/task/${taskId}/status/`);
  }

  async startWorkflowExecution(workflowId: string): Promise<{ task_id: string; status: string }> {
    return this.get<{ task_id: string; status: string }>(`/workflow/${workflowId}/start_execution/`);
  }

  async stopWorkflowExecution(workflowId: string): Promise<{ task_id: string; status: string }> {
    return this.get<{ task_id: string; status: string }>(`/workflow/${workflowId}/stop_execution/`);
  }

  async getWorkflowTaskStatus(workflowId: string): Promise<{ task_id: string; status: string }> {
    return this.get<{ task_id: string; status: string }>(`/workflow/${workflowId}/task_status/`);
  }

  async getNodeInputData(workflowId: string, nodeId: string): Promise<Record<string, unknown>> {
    return this.get<Record<string, unknown>>(`/workflow/${workflowId}/nodes/${nodeId}/input/`);
  }

  async getNodeOutputData(workflowId: string, nodeId: string): Promise<Record<string, unknown>> {
    return this.get<Record<string, unknown>>(`/workflow/${workflowId}/nodes/${nodeId}/output/`);
  }

  /**
   * Execute a workflow node and save all execution data to the database.
   * 
   * Flow:
   * 1. Save form_values and input_data to Node model
   * 2. Execute the node using core engine
   * 3. Save output_data to Node model
   * 4. Return execution result
   */
  async executeAndSaveNode(
    workflowId: string,
    nodeId: string,
    data: {
      form_values: Record<string, unknown>;
      input_data: Record<string, unknown>;
      session_id?: string;
    },
    timeout?: number
  ): Promise<WorkflowNodeExecuteResponse> {
    return this.post<WorkflowNodeExecuteResponse>(
      `/workflow/${workflowId}/execute_and_save_node/`,
      {
        node_id: nodeId,
        form_values: data.form_values,
        input_data: data.input_data,
        session_id: data.session_id,
        timeout: timeout, // Timeout in seconds for backend
      },
      timeout ? { timeout: timeout * 1000 } : undefined // Convert seconds to ms for axios
    );
  }
}

// Export singleton instance
export const workflowApi = new WorkflowApiService();

// Export individual methods for easier importing
export const {
  getWorkflows,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  getWorkflowCanvasData,
  addNodeToWorkflow,
  updateNodePosition,
  removeNodeFromWorkflow,
  addConnectionToWorkflow,
  removeConnectionFromWorkflow,
  updateNodeFormValues,
  getTaskStatus,
  startWorkflowExecution,
  stopWorkflowExecution,
  getWorkflowTaskStatus,
  getNodeInputData,
  getNodeOutputData,
  executeAndSaveNode,
} = workflowApi;
