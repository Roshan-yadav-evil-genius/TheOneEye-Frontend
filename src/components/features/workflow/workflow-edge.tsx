"use client";

import { memo, type CSSProperties } from "react";
import {
  BezierEdge,
  StraightEdge,
  StepEdge,
  SmoothStepEdge,
  type EdgeProps,
  type EdgeTypes,
} from "reactflow";

const SELECTED_STROKE = "var(--primary)";
const SELECTED_WIDTH = 3.5;
const DEFAULT_WIDTH = 2;

function mergeEdgeStyle(
  base: CSSProperties | undefined,
  selected: boolean,
  runningStroke: string | undefined
): CSSProperties {
  const stroke = base?.stroke ?? runningStroke;
  return {
    ...base,
    stroke: selected ? SELECTED_STROKE : stroke,
    strokeWidth: selected ? SELECTED_WIDTH : (base?.strokeWidth as number) ?? DEFAULT_WIDTH,
    filter: selected ? "drop-shadow(0 0 4px var(--primary))" : undefined,
  };
}

function makeWorkflowEdge(
  EdgeComponent: typeof BezierEdge,
  displayName: string
) {
  const Wrapped = memo((props: EdgeProps) => {
    const { selected, style, data } = props;
    const runningStroke = (data as { runningStroke?: string } | undefined)?.runningStroke;
    const mergedStyle = mergeEdgeStyle(style, Boolean(selected), runningStroke);
    return <EdgeComponent {...props} style={mergedStyle} />;
  });
  Wrapped.displayName = displayName;
  return Wrapped;
}

export const WorkflowBezierEdge = makeWorkflowEdge(BezierEdge, "WorkflowBezierEdge");
export const WorkflowStraightEdge = makeWorkflowEdge(StraightEdge, "WorkflowStraightEdge");
export const WorkflowStepEdge = makeWorkflowEdge(StepEdge, "WorkflowStepEdge");
export const WorkflowSmoothStepEdge = makeWorkflowEdge(SmoothStepEdge, "WorkflowSmoothStepEdge");

export const workflowEdgeTypes: EdgeTypes = {
  workflowBezier: WorkflowBezierEdge,
  workflowStraight: WorkflowStraightEdge,
  workflowStep: WorkflowStepEdge,
  workflowSmoothStep: WorkflowSmoothStepEdge,
};
