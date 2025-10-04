import { memo } from "react";
import { NodeProps, NodeTypes } from "reactflow";
import { CustomNode } from "./custom-node";

// Wrapper component to pass delete callback to CustomNode
interface CustomNodeData {
  onDeleteNode?: (nodeId: string) => void;
  [key: string]: unknown;
}

const CustomNodeWrapper = memo((props: NodeProps) => {
  const { data, ...nodeProps } = props;
  const { onDeleteNode, ...nodeData } = data || {};
  return <CustomNode {...nodeProps} data={nodeData} onDelete={onDeleteNode} />;
});
CustomNodeWrapper.displayName = 'CustomNodeWrapper';

export const nodeTypes: NodeTypes = {
  custom: CustomNodeWrapper,
};
