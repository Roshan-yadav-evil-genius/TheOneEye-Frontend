import type { TWorkflow } from "@/types";

/** Active workflows first, then inactive, then error/unknown. */
const STATUS_RANK: Record<string, number> = {
  active: 0,
  inactive: 1,
  error: 2,
};

function statusRank(status: string): number {
  return STATUS_RANK[status] ?? 99;
}

/** Stable key: sorted tags joined; empty/missing tags sort last. */
function tagsSortKey(tags: string[] | undefined): string {
  if (!tags?.length) return "\uffff";
  return [...tags].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" })).join("\0");
}

/**
 * Workflows list order: Status → Tags → Category → Name (all ascending).
 */
export function compareWorkflowsTableOrder(a: TWorkflow, b: TWorkflow): number {
  const byStatus = statusRank(a.status) - statusRank(b.status);
  if (byStatus !== 0) return byStatus;

  const byTags = tagsSortKey(a.tags).localeCompare(tagsSortKey(b.tags), undefined, {
    sensitivity: "base",
  });
  if (byTags !== 0) return byTags;

  const ac = (a.category || "").toLowerCase();
  const bc = (b.category || "").toLowerCase();
  const byCategory = ac.localeCompare(bc, undefined, { sensitivity: "base" });
  if (byCategory !== 0) return byCategory;

  return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
}
