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
  const ifConditionKeys = Object.keys(outputData).filter((k) => IF_CONDITION_KEY_PATTERN.test(k));
  if (ifConditionKeys.length === 0) return undefined;
  // Choose the latest IF key: if_condition_10 > if_condition_2 > if_condition
  const key = ifConditionKeys.sort((a, b) => {
    const aMatch = a.match(/^if_condition(?:_(\d+))?$/);
    const bMatch = b.match(/^if_condition(?:_(\d+))?$/);
    const aIndex = aMatch?.[1] ? Number(aMatch[1]) : 1;
    const bIndex = bMatch?.[1] ? Number(bMatch[1]) : 1;
    return bIndex - aIndex;
  })[0];
  if (!key) return undefined;
  const value = outputData[key];
  return value && typeof value === 'object' && 'route' in value
    ? (value as IfConditionPayload)
    : undefined;
}
