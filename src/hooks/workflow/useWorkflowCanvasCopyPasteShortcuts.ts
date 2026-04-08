import { useEffect, useRef } from "react";
import { isEditableKeyboardEventTarget } from "@/lib/dom/is-editable-keyboard-target";
import { toastService } from "@/lib/services/toast-service";
import { useWorkflowCanvasStore } from "@/stores/workflow/workflow-canvas-store";
import { useWorkflowClipboardStore } from "@/stores/workflow/workflow-clipboard-store";

interface UseWorkflowCanvasCopyPasteShortcutsOptions {
  enabled: boolean;
  applyCanvasSelection: (nodeIds: string[], edgeIds: string[]) => void;
}

/**
 * Ctrl/Cmd+C / V for workflow subgraph clipboard. When paste creates nodes, applies RF selection
 * once those node ids exist in the canvas store (avoids racing `setNodes` vs store sync).
 */
export function useWorkflowCanvasCopyPasteShortcuts({
  enabled,
  applyCanvasSelection,
}: UseWorkflowCanvasCopyPasteShortcutsOptions): void {
  const nodes = useWorkflowCanvasStore((s) => s.nodes);
  const pendingPasteSelectionRef = useRef<{ nodeIds: string[]; edgeIds: string[] } | null>(null);

  useEffect(() => {
    const pending = pendingPasteSelectionRef.current;
    if (!pending || pending.nodeIds.length === 0) return;
    const valid = new Set(nodes.map((n) => n.id));
    if (pending.nodeIds.every((id) => valid.has(id))) {
      applyCanvasSelection(pending.nodeIds, pending.edgeIds);
      pendingPasteSelectionRef.current = null;
    }
  }, [nodes, applyCanvasSelection]);

  useEffect(() => {
    if (!enabled) {
      pendingPasteSelectionRef.current = null;
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      if (isEditableKeyboardEventTarget(event.target)) return;

      const key = event.key.toLowerCase();
      if (key === "c") {
        event.preventDefault();
        void (async () => {
          const { selectedNodeIds, copySelection } = useWorkflowClipboardStore.getState();
          if (selectedNodeIds.length === 0) {
            toastService.info("Nothing selected", {
              description: "Select one or more nodes to copy.",
            });
            return;
          }
          const ok = await copySelection();
          const clip = useWorkflowClipboardStore.getState().clipboard;
          if (ok && clip) {
            toastService.success("Copied", {
              description: `${clip.nodes.length} node(s), ${clip.edges.length} internal connection(s).`,
            });
          }
        })();
        return;
      }

      if (key === "v") {
        event.preventDefault();
        void (async () => {
          const { pasteClipboard, setCanvasSelection } = useWorkflowClipboardStore.getState();
          const { newNodeIds, newEdgeIds } = await pasteClipboard();
          if (newNodeIds.length === 0) {
            toastService.info("Nothing to paste", {
              description: "Copy a selection first (Ctrl+C).",
            });
            return;
          }
          setCanvasSelection(newNodeIds, newEdgeIds);
          pendingPasteSelectionRef.current = { nodeIds: newNodeIds, edgeIds: newEdgeIds };
          toastService.success("Pasted", {
            description: `${newNodeIds.length} node(s)${newEdgeIds.length ? `, ${newEdgeIds.length} connection(s)` : ""}.`,
          });
        })();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, applyCanvasSelection]);
}
