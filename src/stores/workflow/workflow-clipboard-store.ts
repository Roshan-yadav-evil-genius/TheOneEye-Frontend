/**
 * Canvas selection + subgraph clipboard (copy/paste).
 * Single responsibility: selection ids and clipboard payload for workflow canvas.
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { WorkflowSubgraphClipboardV1 } from '@/lib/workflow/workflow-subgraph-clipboard';
import {
  applyPasteOffset,
  buildSubgraphClipboard,
  parseClipboardPayload,
} from '@/lib/workflow/workflow-subgraph-clipboard';
import { useWorkflowCanvasStore } from '@/stores/workflow/workflow-canvas-store';

interface WorkflowClipboardState {
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  /** Last successful copy (in-memory). */
  clipboard: WorkflowSubgraphClipboardV1 | null;
}

interface WorkflowClipboardActions {
  setCanvasSelection: (nodeIds: string[], edgeIds: string[]) => void;
  clearCanvasSelection: () => void;
  setClipboard: (payload: WorkflowSubgraphClipboardV1 | null) => void;
  /** Copy current selection from canvas store into clipboard + optional system clipboard. */
  copySelection: () => Promise<boolean>;
  /** Paste clipboard into current workflow; returns new node ids (empty if nothing pasted). */
  pasteClipboard: () => Promise<{ newNodeIds: string[]; newEdgeIds: string[] }>;
  resetForWorkflowChange: () => void;
}

type WorkflowClipboardStore = WorkflowClipboardState & WorkflowClipboardActions;

const initialState: WorkflowClipboardState = {
  selectedNodeIds: [],
  selectedEdgeIds: [],
  clipboard: null,
};

export const useWorkflowClipboardStore = create<WorkflowClipboardStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      setCanvasSelection: (nodeIds, edgeIds) => {
        set((state) => {
          state.selectedNodeIds = nodeIds;
          state.selectedEdgeIds = edgeIds;
        });
      },

      clearCanvasSelection: () => {
        set((state) => {
          state.selectedNodeIds = [];
          state.selectedEdgeIds = [];
        });
      },

      setClipboard: (payload) => {
        set((state) => {
          state.clipboard = payload;
        });
      },

      copySelection: async () => {
        const { selectedNodeIds } = get();
        const { nodes, connections } = useWorkflowCanvasStore.getState();
        const payload = buildSubgraphClipboard(selectedNodeIds, nodes, connections);
        if (!payload) {
          return false;
        }
        set((state) => {
          state.clipboard = payload;
        });
        try {
          await navigator.clipboard.writeText(JSON.stringify(payload));
        } catch {
          /* optional; in-memory still set */
        }
        return true;
      },

      pasteClipboard: async () => {
        let payload = get().clipboard;
        if (!payload) {
          try {
            const text = await navigator.clipboard.readText();
            payload = parseClipboardPayload(text);
            if (payload) {
              set((s) => {
                s.clipboard = payload;
              });
            }
          } catch {
            return { newNodeIds: [], newEdgeIds: [] };
          }
        }
        if (!payload || payload.nodes.length === 0) {
          return { newNodeIds: [], newEdgeIds: [] };
        }

        const canvas = useWorkflowCanvasStore.getState();
        const { addNode, addConnection } = canvas;
        const workflowId = canvas.workflowId;
        if (!workflowId) {
          return { newNodeIds: [], newEdgeIds: [] };
        }

        const toPaste = applyPasteOffset(payload);

        const localToNewId = new Map<string, string>();
        const newNodeIds: string[] = [];

        for (const n of toPaste.nodes) {
          const created = await addNode(
            {
              nodeTemplate: n.nodeTemplate,
              position: n.position,
              form_values: n.form_values ?? {},
              input_data: n.input_data,
              output_data: n.output_data,
              config: n.config,
            },
            { silent: true }
          );
          if (!created?.id) {
            continue;
          }
          localToNewId.set(n.localId, created.id);
          newNodeIds.push(created.id);
        }

        const newEdgeIds: string[] = [];
        for (const e of toPaste.edges) {
          const source = localToNewId.get(e.sourceLocalId);
          const target = localToNewId.get(e.targetLocalId);
          if (!source || !target) continue;
          const conn = await addConnection(
            {
              source,
              target,
              sourceHandle: e.sourceHandle,
            },
            { silent: true }
          );
          if (conn?.id) newEdgeIds.push(conn.id);
        }

        return { newNodeIds, newEdgeIds };
      },

      resetForWorkflowChange: () => {
        set((state) => {
          state.selectedNodeIds = [];
          state.selectedEdgeIds = [];
          state.clipboard = null;
        });
      },
    })),
    { name: 'workflow-clipboard-store' }
  )
);
