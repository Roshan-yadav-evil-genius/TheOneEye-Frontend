import { useState } from "react";
import { BackendNodeType } from "@/types/api/backend";

export function useNodeDragDrop() {
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, node: BackendNodeType) => {
    setDraggedNodeId(node.id);
    e.dataTransfer.setData('application/reactflow', JSON.stringify({
      id: node.id,
      name: node.name,
      type: node.type,
      nodeGroup: node.node_group?.id,
      nodeGroupName: node.node_group?.name,
      nodeGroupIcon: node.node_group?.icon,
      description: node.description,
      logo: node.logo
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedNodeId(null);
    e.dataTransfer.clearData();
  };

  return {
    draggedNodeId,
    handleDragStart,
    handleDragEnd
  };
}
