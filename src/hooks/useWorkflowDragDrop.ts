import { useCallback, useRef, useState } from "react";
import { ReactFlowInstance } from "reactflow";

interface UseWorkflowDragDropProps {
  addNodeFromDrag: (nodeData: any, position: { x: number; y: number }) => void;
  setIsDragOver: (isDragOver: boolean) => void;
}

export const useWorkflowDragDrop = ({ addNodeFromDrag, setIsDragOver }: UseWorkflowDragDropProps) => {
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
        const nodeData = JSON.parse(type);
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
    [reactFlowInstance, addNodeFromDrag, setIsDragOver]
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
