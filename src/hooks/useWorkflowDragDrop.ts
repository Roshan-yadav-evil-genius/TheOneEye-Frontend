import { useCallback, useRef, useState } from "react";
import { ReactFlowInstance } from "reactflow";
import { TNodeMetadata } from "@/types/node";
import { WorkflowType } from "@/types/common/constants";
import { isNodeCompatibleWithWorkflowType, getNodeCompatibilityMessage } from "@/lib/utils/node-compatibility";
import { toastService } from "@/lib/services/toast-service";

interface UseWorkflowDragDropProps {
  addNodeFromDrag: (nodeData: TNodeMetadata, position: { x: number; y: number }) => void;
  setIsDragOver: (isDragOver: boolean) => void;
  workflowType?: WorkflowType;
}

export const useWorkflowDragDrop = ({ addNodeFromDrag, setIsDragOver, workflowType }: UseWorkflowDragDropProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }, [setIsDragOver]);

  const onDragLeave = useCallback((event: React.DragEvent) => {
    // Only set isDragOver to false if we're leaving the entire canvas area
    if (!reactFlowWrapper.current?.contains(event.relatedTarget as Element)) {
      setIsDragOver(false);
    }
  }, [setIsDragOver]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type || !reactFlowBounds || !reactFlowInstance) {
        return;
      }

      try {
        const nodeData: TNodeMetadata = JSON.parse(type);
        
        // Check node compatibility with workflow type
        if (workflowType && !isNodeCompatibleWithWorkflowType(nodeData, workflowType)) {
          const message = getNodeCompatibilityMessage(nodeData, workflowType);
          toastService.error('Incompatible Node', {
            description: `"${nodeData.label || nodeData.name}" cannot be added to this workflow. ${message}`,
          });
          setIsDragOver(false);
          return;
        }
        
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        addNodeFromDrag(nodeData, position);
        setIsDragOver(false);
      } catch (error) {
        setIsDragOver(false);
      }
    },
    [reactFlowInstance, addNodeFromDrag, setIsDragOver, workflowType]
  );

  return {
    reactFlowWrapper,
    reactFlowInstance,
    setReactFlowInstance,
    onDragOver,
    onDragLeave,
    onDrop,
  };
};
