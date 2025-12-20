import { useCallback, useMemo, useEffect } from "react";
import React from "react";
import { Node, Edge, Connection, useNodesState, useEdgesState, NodeChange } from "reactflow";
import { useWorkflowCanvasStore, useWorkflowSelectionStore } from "@/stores";
import { TWorkflowNodeCreateRequest } from "@/types";

interface WorkflowStateProps {
  workflowId: string;
  lineType: string;
  selectedNodes: string[];
  searchTerm: string;
  filters: {
    nodeGroup: string;
  };
  isRunning: boolean;
}

export const useWorkflowState = ({ workflowId, lineType, selectedNodes, searchTerm, filters, isRunning }: WorkflowStateProps) => {
  // Get workflow canvas store state and actions
  const {
    nodes: workflowNodes,
    connections: workflowConnections,
    isLoading,
    isSaving,
    error,
    isDragOver,
    loadWorkflowCanvas,
    addNode,
    updateNodePosition,
    removeNode,
    addConnection,
    setDragOver,
  } = useWorkflowCanvasStore();

  // Get selection store actions (now separate from canvas store)
  const {
    selectNode,
    clearSelection,
  } = useWorkflowSelectionStore();

  // Convert workflow nodes to ReactFlow format
  const reactFlowNodes = useMemo(() => {
    return workflowNodes.map((workflowNode): Node => {
      return {
        id: workflowNode.id,
        type: 'custom',
        position: workflowNode.position,
        data: workflowNode,
        dragHandle: '.drag-handle',
      };
    });
  }, [workflowNodes]);

  // Convert workflow connections to ReactFlow format
  const reactFlowEdges = useMemo(() => {
    return workflowConnections.map((connection): Edge => ({
      id: connection.id,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle || 'default',
      type: lineType,
      animated: isRunning,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    }));
  }, [workflowConnections, lineType, isRunning]);

  // ReactFlow state management
  const [nodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(reactFlowEdges);

  // Custom handler for node changes that also saves position to backend
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    // Apply changes to local state first
    onNodesChange(changes);
  }, [onNodesChange]);

  // Handle node drag stop to save position
  const handleNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    updateNodePosition(node.id, node.position);
  }, [updateNodePosition]);

  // Sync ReactFlow state with workflow store
  useEffect(() => {
    setNodes(reactFlowNodes);
  }, [reactFlowNodes, setNodes]);

  useEffect(() => {
    setEdges(reactFlowEdges);
  }, [reactFlowEdges, setEdges]);

  // Load workflow data on mount
  useEffect(() => {
    if (workflowId) {
      loadWorkflowCanvas(workflowId);
    }
  }, [workflowId, loadWorkflowCanvas]);

  // Update existing edges when lineType changes
  useEffect(() => {
    setEdges((currentEdges) =>
      currentEdges.map((edge) => ({
        ...edge,
        type: lineType,
      }))
    );
  }, [lineType, setEdges]);

  const onConnect = useCallback(
    async (params: Connection) => {
      // Prevent self-connections
      if (params.source === params.target) {
        return;
      }
      
      // Check if connection already exists (including sourceHandle)
      const connectionExists = edges.some(
        edge => edge.source === params.source && 
                edge.target === params.target &&
                edge.sourceHandle === params.sourceHandle
      );
      
      if (connectionExists) {
        return;
      }
      
      // Add connection to workflow store with sourceHandle
      if (params.source && params.target) {
        await addConnection({
          source: params.source,
          target: params.target,
          sourceHandle: params.sourceHandle || 'default',
        });
      }
    },
    [edges, addConnection]
  );

  const addNodeFromDrag = useCallback(async (nodeData: { identifier: string }, position: { x: number; y: number }) => {
    const nodeRequest: TWorkflowNodeCreateRequest = {
      nodeTemplate: nodeData.identifier, // The node identifier from TNodeMetadata
      position,
      form_values: {},
    };

    await addNode(nodeRequest);
  }, [addNode]);

  // Filter nodes based on search and filters
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchesSearch = node.data?.node_type?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesCategory = filters.nodeGroup === "all";
      
      return matchesSearch && matchesCategory;
    });
  }, [nodes, searchTerm, filters]);

  // Helper function to get connected node's output data
  const getConnectedNodeOutput = useCallback((nodeId: string): Record<string, unknown> | null => {
    // Find incoming edge to this node
    const incomingEdge = edges.find(edge => edge.target === nodeId);
    if (!incomingEdge) return null;
    
    // Find the source node
    const sourceNode = nodes.find(n => n.id === incomingEdge.source);
    if (!sourceNode) return null;
    
    // Get the source node's output_data
    const outputData = sourceNode.data?.output_data as Record<string, unknown> | null;
    if (!outputData) return null;
    
    // Check if source is a conditional node with routing info
    const ifCondition = outputData?.if_condition as { route?: string } | undefined;
    if (ifCondition?.route) {
      const edgeSourceHandle = incomingEdge.sourceHandle || 'default';
      // Only return data if this edge comes from the active route
      if (edgeSourceHandle !== ifCondition.route) {
        return null; // This branch was not taken
      }
    }
    
    return outputData;
  }, [edges, nodes]);

  // Update node selection and add delete callback, workflow context, and execution state
  const updatedNodes = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      selected: selectedNodes.includes(node.id),
      data: {
        ...node.data,
        onDeleteNode: removeNode,
        workflowId: workflowId,
        getConnectedNodeOutput: getConnectedNodeOutput,
        isExecuting: isRunning,
      },
    }));
  }, [nodes, selectedNodes, removeNode, workflowId, getConnectedNodeOutput, isRunning]);

  return {
    nodes: updatedNodes,
    edges,
    filteredNodes,
    isDragOver,
    setIsDragOver: setDragOver,
    onNodesChange: handleNodesChange,
    onEdgesChange,
    onConnect,
    onNodeDragStop: handleNodeDragStop,
    addNodeFromDrag,
    removeNode,
    isLoading,
    isSaving,
    error,
  };
};
