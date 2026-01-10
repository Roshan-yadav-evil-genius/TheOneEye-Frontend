/**
 * useNodeExecution Hook
 * 
 * Single Responsibility: Handles node execution logic.
 * Manages execution state and coordinates between execution service and persistence.
 */

import { useState, useCallback, useRef } from 'react';
import { nodeExecutionService } from '@/services/node-execution-service';
import { TNodeExecuteResponse, TNodeFormData } from '@/types';
import { workflowApi } from '@/lib/api/services/workflow-api';
import { useWorkflowCanvasStore } from '@/stores';
import { errorNotificationService } from '@/lib/services/error-notification-service';

export interface NodeExecutionOptions {
  nodeIdentifier: string;
  sessionId: string;
  isWorkflowMode: boolean;
  workflowContext?: {
    workflowId: string;
    nodeInstanceId: string;
  };
  onOutputChange?: (output: TNodeExecuteResponse | null) => void;
}

/**
 * Hook for managing node execution
 */
export function useNodeExecution(options: NodeExecutionOptions) {
  const { nodeIdentifier, sessionId, isWorkflowMode, workflowContext, onOutputChange } = options;

  const [isExecuting, setIsExecuting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [executionFormState, setExecutionFormState] = useState<TNodeFormData | null>(null);
  const isResettingRef = useRef(false);

  const updateNodeExecutionData = useWorkflowCanvasStore(
    (state) => state.updateNodeExecutionData
  );

  // Execute node
  const execute = useCallback(
    async (
      formData: Record<string, string>,
      inputData: Record<string, unknown>,
      timeout?: number
    ): Promise<TNodeExecuteResponse> => {
      setIsExecuting(true);
      onOutputChange?.(null);

      try {
        let result: TNodeExecuteResponse;

        if (isWorkflowMode && workflowContext) {
          // Workflow mode: use execute_and_save_node API (saves to DB)
          // If FormValidationException is raised, it will be caught by BaseApiService
          // and ErrorNotificationService will show toast automatically
          const response = await workflowApi.executeAndSaveNode(
            workflowContext.workflowId,
            workflowContext.nodeInstanceId,
            {
              form_values: formData,
              input_data: inputData,
              session_id: sessionId,
            },
            timeout
          );

          // Convert workflow response to standard format
          result = {
            success: response.success,
            output: response.output,
            error: response.error,
            error_type: response.error_type,
            message: response.message,
            form: response.form,
          };

          // Handle form validation errors - set form state for inline errors
          // Toast notification is already handled by ErrorNotificationService via BaseApiService
          if (!response.success && response.error_type === 'FormValidationError' && response.form) {
            setExecutionFormState(response.form);
          } else if (!response.success) {
            // For backward compatibility: if error is still in response (not raised as exception)
            // Show notification (though this shouldn't happen after full refactoring)
            errorNotificationService.notifyNodeExecutionError(result);
            setExecutionFormState(null);
          } else {
            setExecutionFormState(null);
          }

          // Update the local store with the execution data so it persists without page refresh
          if (response.success) {
            // Extract output_data from the response
            const outputPayload = response.output;
            let outputData: Record<string, unknown> = {};
            if (outputPayload && typeof outputPayload === 'object' && 'data' in outputPayload) {
              outputData = (outputPayload as { data: Record<string, unknown> }).data || {};
            } else if (outputPayload && typeof outputPayload === 'object') {
              outputData = outputPayload as Record<string, unknown>;
            }

            updateNodeExecutionData(workflowContext.nodeInstanceId, {
              form_values: formData,
              input_data: inputData,
              output_data: outputData,
            });
          }
        } else {
          // Standalone mode: use regular execute API with session_id for stateful execution
          // If FormValidationException is raised, it will be caught by BaseApiService
          result = await nodeExecutionService.executeStandaloneNode({
            nodeIdentifier,
            formData,
            inputData,
            sessionId,
            isWorkflowMode: false,
            timeout,
          });

          // Handle errors for standalone mode
          // Toast notification is already handled by ErrorNotificationService via BaseApiService
          if (!result.success) {
            if (result.error_type === 'FormValidationError' && result.form) {
              // Set form state for inline errors
              setExecutionFormState(result.form);
            } else {
              // For backward compatibility: if error is still in response
              errorNotificationService.notifyNodeExecutionError(result);
              setExecutionFormState(null);
            }
          } else {
            setExecutionFormState(null);
          }
        }

        onOutputChange?.(result);
        return result;
      } catch (error: any) {
        // Error was caught by BaseApiService and ErrorNotificationService already showed toast
        // But we need to extract form data if it's a FormValidationError to show inline errors
        const responseData = error?.context?.responseData || error?.data;
        if (responseData && (responseData.error_code === 'FormValidationError' || responseData.form)) {
          // Extract form data from error response
          const formData = responseData.form;
          if (formData) {
            setExecutionFormState(formData);
          }
        } else {
          setExecutionFormState(null);
        }

        console.error('Node execution failed:', error);
        const errorResult: TNodeExecuteResponse = {
          success: false,
          error: error instanceof Error ? error.message : 'Execution failed',
          error_type: 'ExecutionError',
        };

        onOutputChange?.(errorResult);
        return errorResult;
      } finally {
        setIsExecuting(false);
      }
    },
    [
      nodeIdentifier,
      sessionId,
      isWorkflowMode,
      workflowContext,
      updateNodeExecutionData,
      onOutputChange,
    ]
  );

  // Reset session - clears server-side state (keeps deterministic session_id)
  const reset = useCallback(async () => {
    if (isResettingRef.current) return;
    isResettingRef.current = true;

    try {
      // Clear server-side session
      await nodeExecutionService.resetSession(nodeIdentifier, sessionId);
      onOutputChange?.(null);
    } catch (error) {
      console.error('Failed to reset session:', error);
    } finally {
      isResettingRef.current = false;
    }
  }, [nodeIdentifier, sessionId, onOutputChange]);

  // Save form values to DB (workflow mode only)
  const save = useCallback(
    async (formValues: Record<string, string>) => {
      if (!isWorkflowMode || !workflowContext) return;

      setIsSaving(true);
      try {
        await workflowApi.updateNodeFormValues(
          workflowContext.workflowId,
          workflowContext.nodeInstanceId,
          formValues
        );
        // Update local store
        updateNodeExecutionData(workflowContext.nodeInstanceId, {
          form_values: formValues,
        });
      } catch (error) {
        console.error('Failed to save form values:', error);
      } finally {
        setIsSaving(false);
      }
    },
    [isWorkflowMode, workflowContext, updateNodeExecutionData]
  );

  return {
    execute,
    reset,
    save,
    isExecuting,
    isSaving,
    executionFormState,
    setExecutionFormState,
  };
}

