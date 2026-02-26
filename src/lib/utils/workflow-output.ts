/**
 * Workflow output utilities.
 * Single responsibility: resolving node output payloads from workflow execution data.
 */

/** Backend uses if_condition, if_condition_2, ... for multiple IfCondition nodes in path. */
const IF_CONDITION_KEY_PATTERN = /^if_condition(_\d+)?$/;

export type IfConditionPayload = {
  route?: string;
  expression?: string;
  result?: boolean;
};

/**
 * Get the if-condition payload from node output data.
 * Supports dynamic keys (if_condition, if_condition_2, ...) from backend get_unique_output_key.
 */
export function getIfConditionFromOutput(
  outputData: Record<string, unknown> | null | undefined
): IfConditionPayload | undefined {
  if (!outputData || typeof outputData !== 'object') return undefined;
  const key = Object.keys(outputData).find((k) => IF_CONDITION_KEY_PATTERN.test(k));
  if (!key) return undefined;
  const value = outputData[key];
  return value && typeof value === 'object' && 'route' in value
    ? (value as IfConditionPayload)
    : undefined;
}
