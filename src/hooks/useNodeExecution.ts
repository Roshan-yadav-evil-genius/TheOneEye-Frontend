/**
 * useNodeExecution Hook
 * 
 * Single Responsibility: Handles node execution logic.
 * Manages execution state and coordinates between execution service and persistence.
 */

import { useState, useCallback, useRef } from 'react';
import { nodeExecutionService } from '@/services/node-execution-service';
import { TNodeExecuteResponse, TNodeFormData } from '@/types';
import { uiHelpers } from '@/stores/ui';
import { workflowApi } from '@/lib/api/services/workflow-api';
import { useWorkflowCanvasStore } from '@/stores';

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
      inputData: Record<string, unknown>
    ): Promise<TNodeExecuteResponse> => {
      setIsExecuting(true);
      onOutputChange?.(null);

      try {
        let result: TNodeExecuteResponse;

        if (isWorkflowMode && workflowContext) {
          // Workflow mode: use execute_and_save_node API (saves to DB)
          const response = await workflowApi.executeAndSaveNode(
            workflowContext.workflowId,
            workflowContext.nodeInstanceId,
            {
              form_values: formData,
              input_data: inputData,
              session_id: sessionId,
            }
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

          // Handle form validation errors - show in form
          if (!response.success && response.error_type === 'FormValidationError' && response.form) {
            setExecutionFormState(response.form);
          } else if (!response.success) {
            // Show non-field errors in toast
            uiHelpers.showError(
              'Execution Failed',
              response.error || response.message || 'An error occurred during execution'
            );
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
          result = await nodeExecutionService.executeStandaloneNode({
            nodeIdentifier,
            formData,
            inputData,
            sessionId,
            isWorkflowMode: false,
          });

          // Handle errors for standalone mode too
          if (!result.success) {
            if (result.error_type === 'FormValidationError' && result.form) {
              setExecutionFormState(result.form);
            } else {
              uiHelpers.showError(
                'Execution Failed',
                result.error || result.message || 'An error occurred during execution'
              );
              setExecutionFormState(null);
            }
          } else {
            setExecutionFormState(null);
          }
        }

        onOutputChange?.(result);
        return result;
      } catch (error) {
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

