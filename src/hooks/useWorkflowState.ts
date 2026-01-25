import { useCallback, useMemo, useEffect } from "react";
import React from "react";
import { Node, Edge, Connection, useNodesState, useEdgesState, NodeChange, EdgeChange } from "reactflow";
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
    highlightedEdges,
    loadWorkflowCanvas,
    addNode,
    updateNodePosition,
    removeNode,
    addConnection,
    removeConnection,
    setDragOver,
    highlightEdge,
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
    return workflowConnections.map((connection): Edge => {
      const isHighlighted = connection.id in highlightedEdges;
      const highlightColor = highlightedEdges[connection.id];
      
      return {
        id: connection.id,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle || 'default',
        type: lineType,
        animated: isRunning,
        style: { 
          stroke: highlightColor || '#3b82f6', 
          strokeWidth: isHighlighted ? 3 : 2,
        },
      };
    });
  }, [workflowConnections, lineType, isRunning, highlightedEdges]);

  // ReactFlow state management
  const [nodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(reactFlowEdges);

  // Custom handler for node changes that also saves position to backend
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    // Apply changes to local state first
    onNodesChange(changes);
  }, [onNodesChange]);

  // Custom handler for edge changes that persists deletions to backend
  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    // Filter for removals and persist to backend
    changes.forEach(change => {
      if (change.type === 'remove') {
        removeConnection(change.id);
      }
    });
    
    // Apply all changes to ReactFlow state
    onEdgesChange(changes);
  }, [removeConnection, onEdgesChange]);

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

  // Highlight outgoing edges from a node (for visual feedback on execution)
  const highlightNodeOutputEdges = useCallback((nodeId: string, route?: string) => {
    // Find outgoing edges from this node
    const outgoingEdges = edges.filter(edge => edge.source === nodeId);
    
    for (const edge of outgoingEdges) {
      // If route is specified (conditional node), only highlight matching handle
      if (route) {
        if (edge.sourceHandle === route) {
          highlightEdge(edge.id, '#22c55e', 1000); // Green for 2 seconds
        }
      } else {
        // Regular node: highlight all outgoing edges
        highlightEdge(edge.id, '#22c55e', 1000); // Green for 2 seconds
      }
    }
  }, [edges, highlightEdge]);

  // Helper function to get connected node's output data
  // IMPORTANT: Read directly from store to get latest data, not from ReactFlow state
  // ReactFlow state may lag behind store updates
  const getConnectedNodeOutput = useCallback((nodeId: string): Record<string, unknown> | null => {
    // Get latest data directly from store
    const storeState = useWorkflowCanvasStore.getState();
    const storeNodes = storeState.nodes;
    const storeConnections = storeState.connections;
    
    // Find incoming edge to this node
    const incomingEdge = storeConnections.find(conn => conn.target === nodeId);
    if (!incomingEdge) return null;
    
    // Find the source node from store
    const sourceNode = storeNodes.find(n => n.id === incomingEdge.source);
    if (!sourceNode) return null;
    
    // Get the source node's output_data
    const outputData = sourceNode.output_data as Record<string, unknown> | null;
    if (!outputData) return null;
    
    // IMPORTANT: Only apply routing check if source is ACTUALLY a conditional node
    // The if_condition data is passed through all downstream nodes, so we must check
    // the source node's type, not just if the data contains if_condition
    const isConditionalNode = sourceNode.node_type?.identifier === 'if-condition';
    
    if (isConditionalNode) {
      const ifCondition = outputData?.if_condition as { route?: string } | undefined;
      if (ifCondition?.route) {
        const edgeSourceHandle = incomingEdge.sourceHandle || 'default';
        // Only return data if this edge comes from the active route
        if (edgeSourceHandle !== ifCondition.route) {
          return null; // This branch was not taken
        }
      }
    }
    
    return outputData;
  }, []); // No dependencies - reads directly from store each time

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
        highlightNodeOutputEdges: highlightNodeOutputEdges,
        isExecuting: isRunning,
      },
    }));
  }, [nodes, selectedNodes, removeNode, workflowId, getConnectedNodeOutput, highlightNodeOutputEdges, isRunning]);

  return {
    nodes: updatedNodes,
    edges,
    filteredNodes,
    isDragOver,
    setIsDragOver: setDragOver,
    onNodesChange: handleNodesChange,
    onEdgesChange: handleEdgesChange,
    onConnect,
    onNodeDragStop: handleNodeDragStop,
    addNodeFromDrag,
    removeNode,
    isLoading,
    isSaving,
    error,
  };
};
