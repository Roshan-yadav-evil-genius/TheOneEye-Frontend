import { memo } from "react";
import { NodeProps, NodeTypes } from "reactflow";
import { CustomNode } from "./custom-node";

// Wrapper component to pass delete callback and workflow context to CustomNode
interface CustomNodeData {
  onDeleteNode?: (nodeId: string) => void;
  workflowId?: string;
  getConnectedNodeOutput?: (nodeId: string) => Record<string, unknown> | null;
  [key: string]: unknown;
}

const CustomNodeWrapper = memo((props: NodeProps) => {
  const { data, id, ...nodeProps } = props;
  const { onDeleteNode, workflowId, getConnectedNodeOutput, ...nodeData } = (data || {}) as CustomNodeData;
  
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
    />
  );
});
CustomNodeWrapper.displayName = 'CustomNodeWrapper';

export const nodeTypes: NodeTypes = {
  custom: CustomNodeWrapper,
};
