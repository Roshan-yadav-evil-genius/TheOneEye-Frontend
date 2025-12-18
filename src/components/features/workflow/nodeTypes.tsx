import { memo } from "react";
import { NodeProps, NodeTypes } from "reactflow";
import { CustomNode } from "./custom-node";

// Wrapper component to pass delete callback, workflow context, and execution state to CustomNode
interface CustomNodeData {
  onDeleteNode?: (nodeId: string) => void;
  workflowId?: string;
  getConnectedNodeOutput?: (nodeId: string) => Record<string, unknown> | null;
  isExecuting?: boolean;
  [key: string]: unknown;
}

const CustomNodeWrapper = memo((props: NodeProps) => {
  const { data, id, ...nodeProps } = props;
  const { onDeleteNode, workflowId, getConnectedNodeOutput, isExecuting, ...nodeData } = (data || {}) as CustomNodeData;
  
  // Build workflow context for the dialog
  const workflowContext = workflowId ? {
    workflowId,
    nodeInstanceId: id,
    getConnectedNodeOutput: getConnectedNodeOutput ? () => getConnectedNodeOutput(id) : undefined,
  } : undefined;
  
  return (
    <CustomNode 
      {...nodeProps} 
      id={id}
      data={nodeData} 
      onDelete={onDeleteNode} 
      workflowContext={workflowContext}
      isExecuting={isExecuting}
    />
  );
});
CustomNodeWrapper.displayName = 'CustomNodeWrapper';

export const nodeTypes: NodeTypes = {
  custom: CustomNodeWrapper,
};
