import { memo } from "react";
import { NodeProps, NodeTypes } from "reactflow";
import { CustomNode } from "./custom-node";

// Wrapper component to pass delete callback and workflow context to CustomNode
interface CustomNodeData {
  onDeleteNode?: (nodeId: string) => void;
  workflowId?: string;
  [key: string]: unknown;
}

const CustomNodeWrapper = memo((props: NodeProps) => {
  const { data, ...nodeProps } = props;
  const { onDeleteNode, workflowId, ...nodeData } = data || {};
  return <CustomNode {...nodeProps} data={nodeData} onDelete={onDeleteNode} workflowId={workflowId} />;
});
CustomNodeWrapper.displayName = 'CustomNodeWrapper';

export const nodeTypes: NodeTypes = {
  custom: CustomNodeWrapper,
};
