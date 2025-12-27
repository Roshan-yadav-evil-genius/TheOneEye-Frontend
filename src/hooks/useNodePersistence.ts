/**
 * useNodePersistence Hook
 * 
 * Single Responsibility: Handles persistence of node execution data.
 * Manages differences between standalone (localStorage) and workflow (DB) modes.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useNodeTestDataStore } from '@/stores/node-test-data-store';
import { useWorkflowCanvasStore } from '@/stores';
import { TNodeExecuteResponse } from '@/types';

export interface WorkflowPersistenceContext {
  workflowId: string;
  nodeInstanceId: string;
  savedFormValues?: Record<string, unknown>;
  savedInputData?: Record<string, unknown>;
  savedOutputData?: Record<string, unknown>;
  getConnectedNodeOutput?: () => Record<string, unknown> | null;
}

export interface NodePersistenceState {
  inputData: Record<string, unknown>;
  formValues: Record<string, string>;
  outputData: TNodeExecuteResponse | null;
}

/**
 * Hook for managing node execution data persistence
 */
export function useNodePersistence(
  nodeIdentifier: string,
  isWorkflowMode: boolean,
  workflowContext?: WorkflowPersistenceContext,
  isOpen?: boolean
) {
  // Get persisted test data from store (for standalone mode)
  const {
    getInputData,
    setInputData: persistInputData,
    getFormData,
    setFormData: persistFormData,
    getOutputData,
    setOutputData: persistOutputData,
  } = useNodeTestDataStore();

  // Get store method to update node execution data (for workflow mode)
  const updateNodeExecutionData = useWorkflowCanvasStore(
    (state) => state.updateNodeExecutionData
  );
  
  // Subscribe to store to get latest node data (for workflow mode)
  const nodeInstanceId = workflowContext?.nodeInstanceId;
  const latestNodeData = useWorkflowCanvasStore(state => 
    nodeInstanceId ? state.nodes.find(n => n.id === nodeInstanceId) : null
  );

  // Initialize state from workflow context or persisted store
  const [inputData, setInputData] = useState<Record<string, unknown>>(() => {
    if (isWorkflowMode) {
      // In workflow mode: prefer connected node's output, then saved input
      const connectedOutput = workflowContext?.getConnectedNodeOutput?.();
      if (connectedOutput && Object.keys(connectedOutput).length > 0) {
        return connectedOutput;
      }
      return (workflowContext?.savedInputData as Record<string, unknown>) || {};
    }
    return getInputData(nodeIdentifier);
  });

  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    if (isWorkflowMode && workflowContext?.savedFormValues) {
      // Convert Record<string, unknown> to Record<string, string>
      const formValues: Record<string, string> = {};
      for (const [key, value] of Object.entries(workflowContext.savedFormValues)) {
        formValues[key] = String(value ?? '');
      }
      return formValues;
    }
    return getFormData(nodeIdentifier);
  });

  const [outputData, setOutputData] = useState<TNodeExecuteResponse | null>(() => {
    if (isWorkflowMode && workflowContext?.savedOutputData && Object.keys(workflowContext.savedOutputData).length > 0) {
      return {
        success: true,
        output: { data: workflowContext.savedOutputData },
      };
    }
    // In standalone mode: load last output from store
    return getOutputData(nodeIdentifier);
  });

  // Load data when dialog opens or node changes
  // Use refs to avoid infinite loops from object dependencies
  const workflowContextRef = useRef(workflowContext);
  useEffect(() => {
    workflowContextRef.current = workflowContext;
  }, [workflowContext?.workflowId, workflowContext?.nodeInstanceId]);

  useEffect(() => {
    if (isOpen) {
      if (isWorkflowMode) {
        const ctx = workflowContextRef.current;
        // In workflow mode: load from store first (most up-to-date), then fall back to workflow context
        const connectedOutput = ctx?.getConnectedNodeOutput?.();
        if (connectedOutput && Object.keys(connectedOutput).length > 0) {
          setInputData(connectedOutput);
        } else if (latestNodeData?.input_data) {
          setInputData(latestNodeData.input_data as Record<string, unknown>);
        } else if (ctx?.savedInputData) {
          setInputData(ctx.savedInputData as Record<string, unknown>);
        }

        // Prefer store data over workflowContext prop (store is always up-to-date)
        const formValuesToUse = latestNodeData?.form_values || ctx?.savedFormValues;
        if (formValuesToUse) {
          const formValues: Record<string, string> = {};
          for (const [key, value] of Object.entries(formValuesToUse)) {
            formValues[key] = String(value ?? '');
          }
          setFormValues(formValues);
        }

        if (latestNodeData?.output_data && Object.keys(latestNodeData.output_data).length > 0) {
          setOutputData({
            success: true,
            output: { data: latestNodeData.output_data },
          });
        } else if (ctx?.savedOutputData && Object.keys(ctx.savedOutputData).length > 0) {
          setOutputData({
            success: true,
            output: { data: ctx.savedOutputData },
          });
        }
      } else {
        // In standalone mode: load from local store
        setInputData(getInputData(nodeIdentifier));
        setFormValues(getFormData(nodeIdentifier));
        setOutputData(getOutputData(nodeIdentifier));
      }
    }
  }, [
    isOpen,
    nodeIdentifier,
    isWorkflowMode,
    latestNodeData,
    getInputData,
    getFormData,
    getOutputData,
  ]);

  // Update form values when store data changes (for workflow mode)
  useEffect(() => {
    if (isWorkflowMode && isOpen && latestNodeData?.form_values) {
      const formValues: Record<string, string> = {};
      for (const [key, value] of Object.entries(latestNodeData.form_values)) {
        formValues[key] = String(value ?? '');
      }
      setFormValues(formValues);
    }
  }, [latestNodeData?.form_values, isWorkflowMode, isOpen]);

  // Persist input data whenever it changes (only in standalone mode)
  const handleInputDataChange = useCallback(
    (data: Record<string, unknown>) => {
      setInputData(data);
      if (!isWorkflowMode) {
        persistInputData(nodeIdentifier, data);
      }
    },
    [nodeIdentifier, persistInputData, isWorkflowMode]
  );

  // Persist form data whenever it changes (only in standalone mode)
  const handleFormValuesChange = useCallback(
    (data: Record<string, string>) => {
      setFormValues(data);
      if (!isWorkflowMode) {
        persistFormData(nodeIdentifier, data);
      }
    },
    [nodeIdentifier, persistFormData, isWorkflowMode]
  );

  // Persist output data
  // Note: This is a simple setter - workflow store updates are handled in useNodeExecution
  const handleOutputDataChange = useCallback(
    (data: TNodeExecuteResponse | null) => {
      setOutputData(data);
      if (!isWorkflowMode) {
        persistOutputData(nodeIdentifier, data);
      }
      // Workflow mode persistence is handled in useNodeExecution hook
    },
    [nodeIdentifier, isWorkflowMode, persistOutputData]
  );

  return {
    inputData,
    formValues,
    outputData,
    setInputData: handleInputDataChange,
    setFormValues: handleFormValuesChange,
    setOutputData: handleOutputDataChange,
  };
}

