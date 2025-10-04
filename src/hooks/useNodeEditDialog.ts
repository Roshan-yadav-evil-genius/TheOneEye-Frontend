import { useState, useEffect } from "react";

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
  const [activeNodeTab, setActiveNodeTab] = useState<"parameters" | "settings" | "form">("parameters");

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
