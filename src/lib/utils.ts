import { WorkflowNode } from "@/types/backendService"
import { Node } from "@xyflow/react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function cvtWorkflowNodeToReactFlowNode(workflownode: WorkflowNode): Node {
  return {
    id: workflownode.id,
    dragHandle:".dragByVerticalGrip",
    type: workflownode.node_type.id,
    position: { x: workflownode.position_x, y: workflownode.position_y },
    data: workflownode.data
  }
}