import { useCallback, useMemo, useState, useEffect } from "react";
import { Node, Edge, addEdge, Connection, useNodesState, useEdgesState } from "reactflow";
import { initialNodes, initialEdges } from "../data/workflow-initial-data";

interface WorkflowStateProps {
  lineType: string;
  selectedNodes: string[];
  searchTerm: string;
  filters: {
    category: string;
  };
}

export const useWorkflowState = ({ lineType, selectedNodes, searchTerm, filters }: WorkflowStateProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isDragOver, setIsDragOver] = useState(false);

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
    (params: Connection) => {
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
      
      // Create a new edge with a unique ID
      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}-${Date.now()}`,
        animated: true,
        type: lineType,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, edges, lineType]
  );

  const handleDeleteNode = useCallback((nodeId: string) => {
    // Remove the node
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    
    // Remove all edges connected to this node
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const addNodeFromDrag = useCallback((nodeData: any, position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `${nodeData.id}-${Date.now()}`, // Ensure unique ID
      type: 'custom',
      position,
      data: {
        label: nodeData.name,
        type: nodeData.type,
        status: 'active',
        category: nodeData.category,
        description: nodeData.description,
        formConfiguration: nodeData.formConfiguration || {},
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

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
    setIsDragOver,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNodeFromDrag,
  };
};
