import { useEffect } from "react";
import { useWorkflowClipboardStore } from "@/stores/workflow/workflow-clipboard-store";

/** Drops clipboard selection ids that no longer exist on the canvas (delete, refresh). */
export function usePruneClipboardSelectionWhenGraphChanges(
  workflowNodes: { id: string }[],
  workflowConnections: { id: string }[]
): void {
  useEffect(() => {
    const validNodeIds = new Set(workflowNodes.map((n) => n.id));
    const validEdgeIds = new Set(workflowConnections.map((c) => c.id));
    const clip = useWorkflowClipboardStore.getState();
    const nextNodes = clip.selectedNodeIds.filter((id) => validNodeIds.has(id));
    const nextEdges = clip.selectedEdgeIds.filter((id) => validEdgeIds.has(id));
    if (
      nextNodes.length !== clip.selectedNodeIds.length ||
      nextEdges.length !== clip.selectedEdgeIds.length
    ) {
      clip.setCanvasSelection(nextNodes, nextEdges);
    }
  }, [workflowNodes, workflowConnections]);
}
