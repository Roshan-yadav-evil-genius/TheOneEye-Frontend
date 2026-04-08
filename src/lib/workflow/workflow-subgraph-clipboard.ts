import type { BackendWorkflowNode } from '@/types/api/backend';
import type { TWorkflowConnection } from '@/types/common/entities';

export const WORKFLOW_SUBGRAPH_CLIPBOARD_KIND = 'theoneeye/workflow-subgraph' as const;

/** v1 payload for in-memory buffer and optional system clipboard JSON */
export interface WorkflowSubgraphClipboardV1 {
  kind: typeof WORKFLOW_SUBGRAPH_CLIPBOARD_KIND;
  version: 1;
  nodes: Array<{
    localId: string;
    nodeTemplate: string;
    position: { x: number; y: number };
    form_values?: Record<string, unknown>;
    input_data?: Record<string, unknown>;
    output_data?: Record<string, unknown>;
    config?: Record<string, unknown>;
  }>;
  edges: Array<{
    sourceLocalId: string;
    targetLocalId: string;
    sourceHandle: string;
  }>;
}

export function parseClipboardPayload(raw: string): WorkflowSubgraphClipboardV1 | null {
  try {
    const data = JSON.parse(raw) as unknown;
    if (
      data &&
      typeof data === 'object' &&
      (data as WorkflowSubgraphClipboardV1).kind === WORKFLOW_SUBGRAPH_CLIPBOARD_KIND &&
      (data as WorkflowSubgraphClipboardV1).version === 1
    ) {
      return data as WorkflowSubgraphClipboardV1;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Build a clipboard snapshot from the current canvas store.
 * Only includes edges whose source and target are both in the selected node id set.
 */
export function buildSubgraphClipboard(
  selectedNodeIds: string[],
  storeNodes: BackendWorkflowNode[],
  storeConnections: TWorkflowConnection[]
): WorkflowSubgraphClipboardV1 | null {
  const idSet = new Set(selectedNodeIds);
  if (idSet.size === 0) return null;

  const oldIdToLocal = new Map<string, string>();
  const nodes: WorkflowSubgraphClipboardV1['nodes'] = [];

  for (const id of selectedNodeIds) {
    const bn = storeNodes.find((n) => n.id === id);
    if (!bn?.node_type?.identifier) continue;
    const localId = crypto.randomUUID();
    oldIdToLocal.set(id, localId);
    nodes.push({
      localId,
      nodeTemplate: bn.node_type.identifier,
      position: { x: bn.position.x, y: bn.position.y },
      form_values: bn.form_values ? { ...bn.form_values } : undefined,
      input_data: bn.input_data && Object.keys(bn.input_data).length > 0 ? { ...bn.input_data } : undefined,
      output_data: bn.output_data && Object.keys(bn.output_data).length > 0 ? { ...bn.output_data } : undefined,
    });
  }

  if (nodes.length === 0) return null;

  const edges: WorkflowSubgraphClipboardV1['edges'] = [];
  for (const c of storeConnections) {
    if (!idSet.has(c.source) || !idSet.has(c.target)) continue;
    const s = oldIdToLocal.get(c.source);
    const t = oldIdToLocal.get(c.target);
    if (!s || !t) continue;
    edges.push({
      sourceLocalId: s,
      targetLocalId: t,
      sourceHandle: c.sourceHandle || 'default',
    });
  }

  return {
    kind: WORKFLOW_SUBGRAPH_CLIPBOARD_KIND,
    version: 1,
    nodes,
    edges,
  };
}

const PASTE_OFFSET = { x: 48, y: 48 };

/** Shift every node position by a fixed offset (duplicate cluster). */
export function applyPasteOffset(payload: WorkflowSubgraphClipboardV1): WorkflowSubgraphClipboardV1 {
  return {
    ...payload,
    nodes: payload.nodes.map((n) => ({
      ...n,
      position: {
        x: n.position.x + PASTE_OFFSET.x,
        y: n.position.y + PASTE_OFFSET.y,
      },
    })),
  };
}
