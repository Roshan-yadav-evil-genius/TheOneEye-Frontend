import { useCallback, useMemo, useEffect } from "react";
import React from "react";
import { Node, Edge, addEdge, Connection, useNodesState, useEdgesState, NodeChange } from "reactflow";
import { useWorkflowCanvasStore } from "@/stores";
import { TWorkflowNodeCreateRequest } from "@/types";
import { TWorkflowNode } from "@/types/common/entities";

interface WorkflowStateProps {
  workflowId: string;
  lineType: string;
  selectedNodes: string[];
  searchTerm: string;
  filters: {
    nodeGroup: string;
  };
}

export const useWorkflowState = ({ workflowId, lineType, selectedNodes, searchTerm, filters }: WorkflowStateProps) => {
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
    removeConnection,
    setDragOver,
    selectNode,
    clearSelection,
  } = useWorkflowCanvasStore();

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
      type: lineType,
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    }));
  }, [workflowConnections, lineType]);

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
    console.log('Node drag stopped:', node.id, node.position);
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
      console.log(params)
      if (params.source === params.target) {
        return;
      }
      
      // Check if connection already exists
      const connectionExists = edges.some(
        edge => edge.source === params.source && edge.target === params.target
      );
      
      if (connectionExists) {
        return;
      }
      
      // Add connection to workflow store
      if (params.source && params.target) {
        await addConnection({
          source: params.source,
          target: params.target,
        });
      }
    },
    [edges, addConnection]
  );

  const addNodeFromDrag = useCallback(async (nodeData: any, position: { x: number; y: number }) => {
    const nodeRequest: TWorkflowNodeCreateRequest = {
      nodeTemplate: nodeData.id, // This should be the StandaloneNode ID
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

  // Update node selection and add delete callback and workflow context
  const updatedNodes = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      selected: selectedNodes.includes(node.id),
      data: {
        ...node.data,
        onDeleteNode: removeNode,
        workflowId: workflowId,
      },
    }));
  }, [nodes, selectedNodes, removeNode, workflowId]);

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
