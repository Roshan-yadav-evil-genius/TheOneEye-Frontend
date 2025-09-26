import { TWorkflowEdge, TWorkflowNode, TWorkFlowNodePosition } from "@/types/backendService"
import { Edge, Node, XYPosition } from "@xyflow/react"

export function cvtWorkflowNodeToReactFlowNode(workflownode: TWorkflowNode): Node {
  return {
    id: workflownode.id,
    dragHandle: ".dragByVerticalGrip",
    type: "BaseNode",
    position: { x: workflownode.position_x, y: workflownode.position_y },
    data: {
      node_type: workflownode.node_type,
      config: workflownode.data
    }
  }
}

export function cvtWorkFlowEdgeToReactFlowEdge(workflowedge: TWorkflowEdge): Edge {
  return {
    id: workflowedge.id,
    type: "BaseEdge",
    animated: false,
    source: workflowedge.source_node,
    target: workflowedge.target_node
  }
}

export function cvtXYPositionToWorkFlowPosition(pos: XYPosition): TWorkFlowNodePosition {
  return {
    position_x: pos.x,
    position_y: pos.y
  }
}