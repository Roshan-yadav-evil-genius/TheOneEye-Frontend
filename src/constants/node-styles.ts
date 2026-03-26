// Shared node styling constants for consistency across components
// Centralized source of truth for node type colors matching backend types:
// BlockingNode, NonBlockingNode, ProducerNode, and default for everything else

// Node types that come from the backend (metadata_extractor.py)
export type NodeType = 'BlockingNode' | 'NonBlockingNode' | 'ProducerNode';

// Node colors for canvas borders/backgrounds
export const nodeColors = {
  BlockingNode: "border-node-blocking bg-node-blocking/20",
  NonBlockingNode: "border-node-non-blocking bg-node-non-blocking/20",
  ProducerNode: "border-node-producer bg-node-producer/20",
  default: "border-muted-foreground/50 bg-muted/40",
} as const;

// Icon colors for node logos/icons
export const iconColors = {
  BlockingNode: "text-node-blocking",
  NonBlockingNode: "text-node-non-blocking",
  ProducerNode: "text-node-producer",
  default: "text-muted-foreground",
} as const;

// Badge styles for tables/lists (includes background and text colors with border)
export const badgeStyles = {
  BlockingNode: { bg: "bg-node-blocking/30 border-node-blocking/90", text: "text-node-blocking" },
  NonBlockingNode: { bg: "bg-node-non-blocking/30 border-node-non-blocking/90", text: "text-node-non-blocking" },
  ProducerNode: { bg: "bg-node-producer/30 border-node-producer/90", text: "text-node-producer" },
  default: { bg: "bg-muted/60 border-muted-foreground/40", text: "text-muted-foreground" },
} as const;

// Badge colors for UI badge components (simpler format)
export const badgeColors = {
  BlockingNode: "bg-node-blocking/30 text-node-blocking border border-node-blocking/90",
  NonBlockingNode: "bg-node-non-blocking/30 text-node-non-blocking border border-node-non-blocking/90",
  ProducerNode: "bg-node-producer/30 text-node-producer border border-node-producer/90",
  default: "bg-muted/60 text-muted-foreground border border-muted-foreground/40",
} as const;

type NodeColorKey = keyof typeof nodeColors;
type BadgeStyleKey = keyof typeof badgeStyles;

function isConditionNode(type: string, identifier?: string): boolean {
  const normalizedIdentifier = (identifier || "").toLowerCase();
  const normalizedType = (type || "").toLowerCase();
  return normalizedIdentifier.includes("condition") || normalizedType.includes("condition");
}

/**
 * Get node canvas colors (border and background) for a given node type
 */
export function getNodeColor(type: string, identifier?: string): string {
  if (isConditionNode(type, identifier)) {
    return "border-node-condition bg-node-condition/20";
  }
  const key = type as NodeColorKey;
  return nodeColors[key] || nodeColors.default;
}

/**
 * Get icon color for a given node type
 */
export function getIconColor(type: string, identifier?: string): string {
  if (isConditionNode(type, identifier)) {
    return "text-node-condition";
  }
  const key = type as NodeColorKey;
  return iconColors[key] || iconColors.default;
}

/**
 * Get badge styles (bg and text classes) for a given node type
 * Used in tables, lists, and drag items
 */
export function getBadgeStyles(type: string, identifier?: string): { bg: string; text: string } {
  if (isConditionNode(type, identifier)) {
    return {
      bg: "bg-node-condition/30 border-node-condition/90",
      text: "text-node-condition",
    };
  }
  const key = type as BadgeStyleKey;
  return badgeStyles[key] || badgeStyles.default;
}

/**
 * Get badge color class for UI badge components
 */
export function getBadgeColor(type: string, identifier?: string): string {
  if (isConditionNode(type, identifier)) {
    return "bg-node-condition/30 text-node-condition border border-node-condition/90";
  }
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
