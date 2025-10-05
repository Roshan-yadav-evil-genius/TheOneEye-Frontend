import { useCallback, useMemo, useEffect } from "react";
import { Node, Edge, addEdge, Connection, useNodesState, useEdgesState } from "reactflow";
import { useWorkflowCanvasStore } from "@/stores";
import { TWorkflowNodeCreateRequest } from "@/types";
import { TWorkflowNode } from "@/types/common/entities";

interface WorkflowStateProps {
  workflowId: string;
  lineType: string;
  selectedNodes: string[];
  searchTerm: string;
  filters: {
    category: string;
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
      const nodeTemplate = (workflowNode as any).node_template;
      
      return {
        id: workflowNode.id,
        type: 'custom',
        position: workflowNode.position,
        data: {
          // Use node template information if available, fallback to data field
          label: nodeTemplate?.name || workflowNode.data.label,
          type: nodeTemplate?.type || workflowNode.data.type,
          status: 'active',
          category: nodeTemplate?.type || workflowNode.data.category,
          description: nodeTemplate?.description || workflowNode.data.description,
          icon: nodeTemplate?.logo || workflowNode.data.icon,
          template_id: workflowNode.data.template_id,
          node_template: nodeTemplate,
          onDeleteNode: (nodeId: string) => removeNode(nodeId),
        },
      };
    });
  }, [workflowNodes, removeNode]);

  // Convert workflow connections to ReactFlow format
  const reactFlowEdges = useMemo(() => {
    return workflowConnections.map((connection): Edge => ({
      id: connection.id,
      source: connection.sourceNodeId,
      target: connection.targetNodeId,
      type: lineType,
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
    }));
  }, [workflowConnections, lineType]);

  // ReactFlow state management
  const [nodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(reactFlowEdges);

  // Sync ReactFlow state with workflow store
  useEffect(() => {
    setNodes(reactFlowNodes);
  }, [reactFlowNodes, setNodes]);

  useEffect(() => {
    setEdges(reactFlowEdges);
  }, [reactFlowEdges, setEdges]);

  // Load workflow data on mount
  useEffect(() => {
    console.log('useWorkflowState useEffect triggered', { 
      workflowId, 
      timestamp: Date.now(),
      hasWorkflowId: !!workflowId 
    });
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

  const handleDeleteNode = useCallback((nodeId: string) => {
    removeNode(nodeId);
  }, [removeNode]);

  const addNodeFromDrag = useCallback(async (nodeData: any, position: { x: number; y: number }) => {
    const nodeRequest: TWorkflowNodeCreateRequest = {
      nodeTemplate: nodeData.id, // This should be the StandaloneNode ID
      position,
      data: {
        name: nodeData.name,
        description: nodeData.description,
        icon: nodeData.logo,
        category: nodeData.type,
      },
    };

    await addNode(nodeRequest);
  }, [addNode]);

  // Filter nodes based on search and filters
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchesSearch = node.data.label.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filters.category === "all" || node.data.category === filters.category;
      
      return matchesSearch && matchesCategory;
    });
  }, [nodes, searchTerm, filters]);

  // Update node selection and add delete callback
  const updatedNodes = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      selected: selectedNodes.includes(node.id),
      data: {
        ...node.data,
        onDeleteNode: handleDeleteNode,
      },
    }));
  }, [nodes, selectedNodes, handleDeleteNode]);

  return {
    nodes: updatedNodes,
    edges,
    filteredNodes,
    isDragOver,
    setIsDragOver: setDragOver,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNodeFromDrag,
    isLoading,
    isSaving,
    error,
  };
};
