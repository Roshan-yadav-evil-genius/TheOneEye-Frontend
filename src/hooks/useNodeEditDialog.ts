import { useState, useEffect } from "react";
import { TNode } from "@/types";

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface ConditionWithOperator {
  condition: Condition;
  operator: "AND" | "OR" | "NOT";
}

interface GroupWithOperator {
  group: {
    id: string;
    conditions: ConditionWithOperator[];
  };
  operator: "AND" | "OR" | "NOT";
}

interface NodeData {
  id: string;
  label: string;
  type: string;
  status: string;
  category: string;
  description?: string;
  formConfiguration?: Record<string, unknown>;
  node_template?: {
    id: string;
    name: string;
    type: string;
    description?: string;
    logo?: string;
    form_configuration: Record<string, unknown>;
    tags: string[];
  } | null;
}

interface UseNodeEditDialogProps {
  nodeData: NodeData;
}

export const useNodeEditDialog = ({ nodeData }: UseNodeEditDialogProps) => {
  const [editData, setEditData] = useState({
    id: nodeData.id,
    label: nodeData.label,
    description: nodeData.description || "",
    type: nodeData.type,
    status: nodeData.status,
    category: nodeData.category,
    formConfiguration: nodeData.formConfiguration || {}
  });

  // State for standalone node data fetched from backend
  const [standaloneNodeData, setStandaloneNodeData] = useState<TNode | null>(null);
  const [isLoadingNodeData, setIsLoadingNodeData] = useState(false);
  const [nodeDataError, setNodeDataError] = useState<string | null>(null);

  const [groups, setGroups] = useState<GroupWithOperator[]>([
    {
      group: {
        id: "1",
        conditions: [
          {
            condition: { id: "1_condition", field: "{{ $json[0].Age }}", operator: "is greater than", value: "50" },
            operator: "AND"
          }
        ]
      },
      operator: "AND"
    }
  ]);

  const [convertTypes, setConvertTypes] = useState(false);
  const [activeInputTab, setActiveInputTab] = useState<"schema" | "json">("schema");
  const [activeOutputTab, setActiveOutputTab] = useState<"schema" | "json">("json");
  const [activeNodeTab, setActiveNodeTab] = useState<"parameters" | "settings" | "form">("form");

  // Use existing node_template data from workflow canvas
  useEffect(() => {
    if (nodeData.node_template) {
      // Convert node_template to TNode format
      const standaloneNode: TNode = {
        id: nodeData.node_template.id,
        name: nodeData.node_template.name,
        type: nodeData.node_template.type as TNode['type'],
        nodeGroup: '', // Not available in node_template
        nodeGroupName: '', // Not available in node_template
        nodeGroupIcon: undefined,
        description: nodeData.node_template.description || '',
        version: '1.0.0', // Default version
        isActive: true, // Assume active if in workflow
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'System',
        formConfiguration: nodeData.node_template.form_configuration,
        tags: nodeData.node_template.tags,
        logo: nodeData.node_template.logo,
      };
      setStandaloneNodeData(standaloneNode);
      setNodeDataError(null);
    } else {
      setStandaloneNodeData(null);
      setNodeDataError('No node template data available');
    }
    setIsLoadingNodeData(false);
  }, [nodeData.node_template]);

  // Update editData when nodeData changes
  useEffect(() => {
    setEditData({
      id: nodeData.id,
      label: nodeData.label,
      description: nodeData.description || "",
      type: nodeData.type,
      status: nodeData.status,
      category: nodeData.category,
      formConfiguration: nodeData.formConfiguration || {}
    });
  }, [nodeData]);

  const handleEditDataChange = (field: string, value: string | Record<string, unknown>) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFormConfigurationChange = (formConfig: Record<string, unknown>) => {
    setEditData(prev => ({
      ...prev,
      formConfiguration: formConfig
    }));
  };

  return {
    // State
    editData,
    groups,
    convertTypes,
    activeInputTab,
    activeOutputTab,
    activeNodeTab,
    
    // Standalone node data from backend
    standaloneNodeData,
    isLoadingNodeData,
    nodeDataError,
    
    // Actions
    setGroups,
    setConvertTypes,
    setActiveInputTab,
    setActiveOutputTab,
    setActiveNodeTab,
    handleEditDataChange,
    handleFormConfigurationChange,
  };
};
