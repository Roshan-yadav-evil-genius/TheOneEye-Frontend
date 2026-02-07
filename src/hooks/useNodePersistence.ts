/**
 * useNodePersistence Hook
 * 
 * Single Responsibility: Handles persistence of node execution data.
 * Manages differences between standalone (localStorage) and workflow (DB) modes.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useNodeTestDataStore } from '@/stores/node-test-data-store';
import { useWorkflowCanvasStore } from '@/stores';
import { workflowApi } from '@/lib/api/services/workflow-api';
import { TNodeExecuteResponse } from '@/types';

export interface WorkflowPersistenceContext {
  workflowId: string;
  nodeInstanceId: string;
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

  // Subscribe to store to get latest node data (for workflow mode)
  const nodeInstanceId = workflowContext?.nodeInstanceId;
  const latestNodeData = useWorkflowCanvasStore(state => 
    nodeInstanceId ? state.nodes.find(n => n.id === nodeInstanceId) : null
  );

  // Subscribe to all nodes to detect when connected node output changes
  // This ensures the effect re-runs when any node's output_data updates,
  // allowing getConnectedNodeOutput() to read the latest data from the store
  const allNodes = useWorkflowCanvasStore(state => state.nodes);

  // Initialize state with empty defaults - data will be loaded from store when dialog opens
  const [inputData, setInputData] = useState<Record<string, unknown>>({});
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [outputData, setOutputData] = useState<TNodeExecuteResponse | null>(null);

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
        // In workflow mode: load merged input from all upstream nodes via API (not single connection)
        const loadMergedInput = async () => {
          if (!ctx?.workflowId || !ctx?.nodeInstanceId) return;
          try {
            const merged = await workflowApi.getNodeInputData(ctx.workflowId, ctx.nodeInstanceId);
            if (merged && Object.keys(merged).length > 0) {
              setInputData(merged);
            } else if (latestNodeData?.input_data) {
              setInputData(latestNodeData.input_data as Record<string, unknown>);
            }
          } catch {
            const connectedOutput = ctx?.getConnectedNodeOutput?.();
            if (connectedOutput && Object.keys(connectedOutput).length > 0) {
              setInputData(connectedOutput);
            } else if (latestNodeData?.input_data) {
              setInputData(latestNodeData.input_data as Record<string, unknown>);
            }
          }
        };
        void loadMergedInput();

        // Load form values from store (always up-to-date)
        if (latestNodeData?.form_values) {
          const formValues: Record<string, string> = {};
          for (const [key, value] of Object.entries(latestNodeData.form_values)) {
            formValues[key] = String(value ?? '');
          }
          setFormValues(formValues);
        }

        // Load output data from store
        if (latestNodeData?.output_data && Object.keys(latestNodeData.output_data).length > 0) {
          setOutputData({
            success: true,
            output: { data: latestNodeData.output_data },
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
    allNodes,
    workflowContext?.workflowId,
    workflowContext?.nodeInstanceId,
    getInputData,
    getFormData,
    getOutputData,
  ]);

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

