import { useCallback } from "react";
import type { OnSelectionChangeFunc } from "reactflow";
import { useWorkflowClipboardStore } from "@/stores/workflow/workflow-clipboard-store";

/**
 * Bridges React Flow selection → clipboard store (ids only).
 *
 * Guardrail: do not subscribe to `useWorkflowClipboardStore(selector)` in a component that also
 * writes `nodes[].selected` from that store on every render — that can loop with `onSelectionChange`.
 */
export function useSyncClipboardFromReactFlowSelection(
  enabled: boolean
): OnSelectionChangeFunc | undefined {
  const onSelectionChange = useCallback<OnSelectionChangeFunc>(
    ({ nodes: selectedFlowNodes, edges: selectedFlowEdges }) => {
      useWorkflowClipboardStore.getState().setCanvasSelection(
        selectedFlowNodes.map((n) => n.id),
        selectedFlowEdges.map((e) => e.id)
      );
    },
    []
  );
  return enabled ? onSelectionChange : undefined;
}
