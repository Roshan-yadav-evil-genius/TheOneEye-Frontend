// Shared node styling constants for consistency across components
// Centralized source of truth for node type colors matching backend types:
// BlockingNode, NonBlockingNode, ProducerNode, and default for everything else

// Node types that come from the backend (metadata_extractor.py)
export type NodeType = 'BlockingNode' | 'NonBlockingNode' | 'ProducerNode';

// Node colors for canvas borders/backgrounds
export const nodeColors = {
  BlockingNode: "border-blue-400 bg-blue-50 dark:bg-blue-950/20",
  NonBlockingNode: "border-green-400 bg-green-50 dark:bg-green-950/20",
  ProducerNode: "border-pink-400 bg-pink-50 dark:bg-pink-950/20",
  default: "border-gray-400 bg-gray-50 dark:bg-gray-950/20",
} as const;

// Icon colors for node logos/icons
export const iconColors = {
  BlockingNode: "text-blue-600 dark:text-blue-400",
  NonBlockingNode: "text-green-600 dark:text-green-400",
  ProducerNode: "text-pink-600 dark:text-pink-400",
  default: "text-gray-600 dark:text-gray-400",
} as const;

// Badge styles for tables/lists (includes background and text colors with border)
export const badgeStyles = {
  BlockingNode: { bg: "bg-blue-500/20 border-blue-500/50", text: "text-blue-400" },
  NonBlockingNode: { bg: "bg-green-500/20 border-green-500/50", text: "text-green-400" },
  ProducerNode: { bg: "bg-pink-500/20 border-pink-500/50", text: "text-pink-400" },
  default: { bg: "bg-zinc-600/30 border-zinc-500/50", text: "text-zinc-400" },
} as const;

// Badge colors for UI badge components (simpler format)
export const badgeColors = {
  BlockingNode: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  NonBlockingNode: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  ProducerNode: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
} as const;

type NodeColorKey = keyof typeof nodeColors;
type BadgeStyleKey = keyof typeof badgeStyles;

/**
 * Get node canvas colors (border and background) for a given node type
 */
export function getNodeColor(type: string): string {
  const key = type as NodeColorKey;
  return nodeColors[key] || nodeColors.default;
}

/**
 * Get icon color for a given node type
 */
export function getIconColor(type: string): string {
  const key = type as NodeColorKey;
  return iconColors[key] || iconColors.default;
}

/**
 * Get badge styles (bg and text classes) for a given node type
 * Used in tables, lists, and drag items
 */
export function getBadgeStyles(type: string): { bg: string; text: string } {
  const key = type as BadgeStyleKey;
  return badgeStyles[key] || badgeStyles.default;
}

/**
 * Get badge color class for UI badge components
 */
export function getBadgeColor(type: string): string {
  const key = type as NodeColorKey;
  return badgeColors[key] || badgeColors.default;
}

/**
 * Get all node colors (canvas color and icon color) for a given node type
 * Backward compatible with existing getNodeColors usage
 */
export function getNodeColors(nodeType: string) {
  return {
    colorClass: getNodeColor(nodeType),
    iconColorClass: getIconColor(nodeType),
  };
}
