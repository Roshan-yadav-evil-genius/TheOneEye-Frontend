/**
 * Node Execution Service
 * 
 * Single Responsibility: Handles node execution business logic abstraction.
 * Separates execution concerns from UI components.
 */

import { nodeApi } from '@/lib/api/services/node-api';
import { workflowApi } from '@/lib/api/services/workflow-api';
import { TNodeExecuteResponse, TNodeExecuteRequest } from '@/types';

export interface NodeExecutionOptions {
  nodeIdentifier: string;
  formData: Record<string, string>;
  inputData: Record<string, unknown>;
  sessionId: string;
  isWorkflowMode: boolean;
  workflowContext?: {
    workflowId: string;
    nodeInstanceId: string;
  };
  onSuccess?: (response: TNodeExecuteResponse) => void;
  onError?: (error: Error) => void;
}

export interface WorkflowExecutionOptions {
  workflowId: string;
  nodeInstanceId: string;
  formData: Record<string, string>;
  inputData: Record<string, unknown>;
  sessionId: string;
  onSuccess?: (response: TNodeExecuteResponse) => void;
  onError?: (error: Error) => void;
}

export class NodeExecutionService {
  /**
   * Execute a node in standalone mode
   */
  async executeStandaloneNode(options: NodeExecutionOptions): Promise<TNodeExecuteResponse> {
    const { nodeIdentifier, formData, inputData, sessionId } = options;

    const request: TNodeExecuteRequest = {
      input_data: inputData,
      form_data: formData,
      session_id: sessionId,
    };

    try {
      const result = await nodeApi.executeNode(nodeIdentifier, request);
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (error: any) {
      // Error was caught by BaseApiService and ErrorNotificationService already showed toast
      // Extract form data if it's a FormValidationError to return in response
      const responseData = error?.context?.responseData || error?.data;
      const formData = responseData?.form;
      
      const errorResult: TNodeExecuteResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Execution failed',
        error_type: responseData?.error_code === 'FormValidationError' ? 'FormValidationError' : 'ExecutionError',
        form: formData,
      };

      if (options.onError) {
        options.onError(error instanceof Error ? error : new Error('Execution failed'));
      }

      return errorResult;
    }
  }

  /**
   * Execute a node in workflow mode
   */
  async executeWorkflowNode(options: WorkflowExecutionOptions): Promise<TNodeExecuteResponse> {
    const { workflowId, nodeInstanceId, formData, inputData, sessionId } = options;

    try {
      const response = await workflowApi.executeAndSaveNode(
        workflowId,
        nodeInstanceId,
        {
          form_values: formData,
          input_data: inputData,
          session_id: sessionId,
        }
      );

      // Convert workflow response to standard format
      const result: TNodeExecuteResponse = {
        success: response.success,
        output: response.output,
        error: response.error,
        error_type: response.error_type,
        message: response.message,
        form: response.form,
      };

      // Errors are now handled by BaseApiService → ErrorNotificationService automatically
      // No need to manually show notifications here

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (error) {
      const errorResult: TNodeExecuteResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Execution failed',
        error_type: 'ExecutionError',
      };

      if (options.onError) {
        options.onError(error instanceof Error ? error : new Error('Execution failed'));
      }

      return errorResult;
    }
  }

  /**
   * Reset a node session
   */
  async resetSession(nodeIdentifier: string, sessionId: string): Promise<void> {
    try {
      await nodeApi.resetNodeSession(nodeIdentifier, { session_id: sessionId });
    } catch (error) {
      console.error('Failed to reset session:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const nodeExecutionService = new NodeExecutionService();

