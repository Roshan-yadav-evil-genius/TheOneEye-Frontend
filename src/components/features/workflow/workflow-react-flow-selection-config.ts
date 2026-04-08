import { SelectionMode } from "@reactflow/core";

/**
 * Marquee / multi-select interaction defaults for the workflow canvas.
 *
 * - selectionOnDrag: left-drag on empty pane draws a selection rectangle (when not running).
 * - panOnDrag: when editing, left = marquee only; middle + right mouse buttons pan (see RF docs).
 * - selectNodesOnDrag: false — avoid dragging a node from also changing selection in confusing ways.
 * - elevateNodesOnSelect: false — keeps z-order stable; edges use elevateEdgesOnSelect on the canvas.
 */
/** Middle + right mouse pan while editing; full pan when running (see React Flow `panOnDrag`). */
const PAN_MOUSE_BUTTONS_EDIT_MODE: number[] = [1, 2];

export function getWorkflowReactFlowSelectionProps(isRunning: boolean) {
  return {
    deleteKeyCode: isRunning ? null : ("Delete" as const),
    selectionOnDrag: !isRunning,
    selectionMode: SelectionMode.Partial,
    panOnDrag: isRunning ? true : PAN_MOUSE_BUTTONS_EDIT_MODE,
    selectNodesOnDrag: false,
    elevateEdgesOnSelect: true,
    elevateNodesOnSelect: false,
    nodeDragThreshold: 6,
  };
}
