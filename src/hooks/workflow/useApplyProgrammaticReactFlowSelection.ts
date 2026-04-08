import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Edge, Node } from "reactflow";

/** Sets React Flow `selected` flags from id lists (e.g. after paste). Does not touch the clipboard store. */
export function useApplyProgrammaticReactFlowSelection(
  setNodes: Dispatch<SetStateAction<Node[]>>,
  setEdges: Dispatch<SetStateAction<Edge[]>>
): (nodeIds: string[], edgeIds: string[]) => void {
  return useCallback(
    (nodeIds: string[], edgeIds: string[]) => {
      const nodeSet = new Set(nodeIds);
      const edgeSet = new Set(edgeIds);
      setNodes((nds) => nds.map((n) => ({ ...n, selected: nodeSet.has(n.id) })));
      setEdges((eds) => eds.map((e) => ({ ...e, selected: edgeSet.has(e.id) })));
    },
    [setNodes, setEdges]
  );
}
