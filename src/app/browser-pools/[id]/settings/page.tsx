"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  IconLoader2,
  IconPlus,
  IconEdit,
  IconTrash,
  IconChevronDown,
  IconArrowLeft,
  IconSettings2,
} from "@tabler/icons-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { usePoolDomainThrottleStore } from "@/stores/pool-domain-throttle-store";
import { useBrowserPoolStore } from "@/stores/browser-pool-store";
import type { TBrowserPool, TPoolDomainThrottleRule } from "@/types/browser-pool";
import { RESOURCE_TYPE_OPTIONS } from "@/types/browser-session";

interface PoolSettingsPageProps {
  params: Promise<{ id: string }>;
}

type TableRowType =
  | { type: "throttle"; rule: TPoolDomainThrottleRule }
  | { type: "resource_blocking" };

function buildTableRows(
  rules: TPoolDomainThrottleRule[],
  pool: TBrowserPool | null
): TableRowType[] {
  const rows: TableRowType[] = rules.map((rule) => ({ type: "throttle", rule }));
  const hasResourceBlocking =
    pool?.resource_blocking_enabled ||
    (pool?.blocked_resource_types && pool.blocked_resource_types.length > 0);
  if (hasResourceBlocking) {
    rows.push({ type: "resource_blocking" });
  }
  return rows;
}

export default function PoolSettingsPage({ params }: PoolSettingsPageProps) {
  const resolvedParams = React.use(params);
  const poolId = resolvedParams.id;
  const [pool, setPool] = useState<TBrowserPool | null>(null);
  const [addThrottleOpen, setAddThrottleOpen] = useState(false);
  const [editRule, setEditRule] = useState<TPoolDomainThrottleRule | null>(null);
  const [deleteRule, setDeleteRule] = useState<TPoolDomainThrottleRule | null>(null);
  const [resourceBlockingOpen, setResourceBlockingOpen] = useState(false);
  const [formDomain, setFormDomain] = useState("");
  const [formDelay, setFormDelay] = useState("");
  const [formEnabled, setFormEnabled] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [blockingTypes, setBlockingTypes] = useState<string[]>([]);
  const [deleteResourceBlockingOpen, setDeleteResourceBlockingOpen] = useState(false);

  const {
    rules,
    isLoading: rulesLoading,
    error: rulesError,
    listRules,
    createRule,
    updateRule,
    deleteRule: deleteRuleApi,
    reset,
  } = usePoolDomainThrottleStore();

  const { getPoolById, updatePool } = useBrowserPoolStore();

  const loadPool = useCallback(async () => {
    if (!poolId) return;
    try {
      const p = await getPoolById(poolId);
      setPool(p ?? null);
    } catch {
      setPool(null);
    }
  }, [poolId, getPoolById]);

  useEffect(() => {
    loadPool();
  }, [loadPool]);

  useEffect(() => {
    if (!poolId) return;
    reset();
    listRules(poolId).catch(() => {});
  }, [poolId, listRules, reset]);

  const handleAddThrottleOpen = () => {
    setFormDomain("");
    setFormDelay("");
    setFormEnabled(false);
    setFormError(null);
    setAddThrottleOpen(true);
  };

  const handleAddThrottleSubmit = async () => {
    setFormError(null);
    const domain = formDomain.trim();
    const delayNum = Number(formDelay);
    if (!domain) {
      setFormError("Domain is required");
      return;
    }
    if (Number.isNaN(delayNum) || delayNum < 0) {
      setFormError("Delay must be a number >= 0");
      return;
    }
    try {
      await createRule(poolId, {
        domain,
        delay_seconds: delayNum,
        enabled: formEnabled,
      });
      setAddThrottleOpen(false);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to create rule");
    }
  };

  const handleEditThrottleOpen = (rule: TPoolDomainThrottleRule) => {
    setEditRule(rule);
    setFormDomain(rule.domain);
    setFormDelay(String(rule.delay_seconds));
    setFormEnabled(rule.enabled ?? false);
    setFormError(null);
  };

  const handleEditThrottleSubmit = async () => {
    if (!editRule) return;
    setFormError(null);
    const domain = formDomain.trim();
    const delayNum = Number(formDelay);
    if (!domain) {
      setFormError("Domain is required");
      return;
    }
    if (Number.isNaN(delayNum) || delayNum < 0) {
      setFormError("Delay must be a number >= 0");
      return;
    }
    try {
      await updateRule(poolId, editRule.id, {
        domain,
        delay_seconds: delayNum,
        enabled: formEnabled,
      });
      setEditRule(null);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to update rule");
    }
  };

  const handleDeleteThrottleConfirm = async () => {
    if (!deleteRule) return;
    try {
      await deleteRuleApi(poolId, deleteRule.id);
      setDeleteRule(null);
    } catch {
      // Store error is set
    }
  };

  const handleThrottleRuleEnabledChange = async (
    rule: TPoolDomainThrottleRule,
    checked: boolean
  ) => {
    const id = rule?.id;
    if (id == null || id === "") return;
    try {
      await updateRule(poolId, String(id), { enabled: checked });
    } catch {
      // Error handled by store
    }
  };

  const handleResourceBlockingEnabledChange = async (checked: boolean) => {
    if (!pool) return;
    try {
      await updatePool(poolId, {
        resource_blocking_enabled: checked,
        blocked_resource_types: pool.blocked_resource_types ?? [],
      });
      await loadPool();
    } catch {
      // Error handled by store
    }
  };

  const handleResourceBlockingEditOpen = () => {
    setBlockingTypes(pool?.blocked_resource_types ?? []);
    setResourceBlockingOpen(true);
  };

  const handleResourceBlockingSave = async () => {
    if (!pool) return;
    try {
      await updatePool(poolId, {
        resource_blocking_enabled: pool.resource_blocking_enabled ?? false,
        blocked_resource_types: blockingTypes,
      });
      await loadPool();
      setResourceBlockingOpen(false);
    } catch {
      // Error handled by store
    }
  };

  const toggleBlockingType = (value: string) => {
    setBlockingTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const handleDeleteResourceBlockingConfirm = async () => {
    if (!pool) return;
    try {
      await updatePool(poolId, {
        resource_blocking_enabled: false,
        blocked_resource_types: [],
      });
      await loadPool();
      setDeleteResourceBlockingOpen(false);
    } catch {
      // Error handled by store
    }
  };

  const tableRows = buildTableRows(rules, pool);

  return (
    <DashboardLayout>
      <main className="p-4">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/browser-pools">
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Back to pools
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              Pool settings {pool ? `– ${pool.name}` : ""}
            </h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add
                  <IconChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleAddThrottleOpen}>
                  Add throttling
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleResourceBlockingEditOpen}>
                  Add resource blocking
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {rulesError && (
            <div className="rounded-md bg-destructive/10 text-destructive px-4 py-2 text-sm">
              {rulesError}
            </div>
          )}

          {rulesLoading && rules.length === 0 ? (
            <div className="rounded-md border flex items-center justify-center py-16">
              <div className="text-center">
                <IconLoader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
                <h2 className="text-lg font-semibold mb-2">Loading settings</h2>
                <p className="text-muted-foreground text-sm">
                  Please wait while we load pool settings...
                </p>
              </div>
            </div>
          ) : tableRows.length === 0 ? (
            <div className="rounded-lg border bg-muted/20 flex flex-col items-center justify-center py-16 px-6">
              <IconSettings2 className="h-14 w-14 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No settings configured</h2>
              <p className="text-muted-foreground text-center max-w-sm mb-6">
                Add throttling rules to control request delays per domain, or enable resource blocking to skip images, stylesheets, and other resource types for this pool.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={handleAddThrottleOpen}>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add throttling rule
                </Button>
                <Button variant="outline" onClick={handleResourceBlockingEditOpen}>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add resource blocking
                </Button>
              </div>
            </div>
          ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead className="w-[100px]">Enabled</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableRows.map((row, index) => {
                    if (row.type === "throttle") {
                      return (
                        <TableRow key={row.rule.id ?? `throttle-${index}`}>
                          <TableCell>
                            <Badge variant="secondary">Throttling</Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {row.rule.domain} – {row.rule.delay_seconds}s delay
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={row.rule.enabled ?? false}
                              onCheckedChange={(checked) =>
                                handleThrottleRuleEnabledChange(row.rule, checked)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditThrottleOpen(row.rule)}
                              >
                                <IconEdit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => setDeleteRule(row.rule)}
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    }
                    const blocked = pool?.blocked_resource_types ?? [];
                    const summary =
                      blocked.length > 0
                        ? RESOURCE_TYPE_OPTIONS.filter((o) => blocked.includes(o.value))
                            .map((o) => o.label)
                            .join(", ")
                        : "Not configured";
                    return (
                      <TableRow key={`resource-blocking-${index}`}>
                        <TableCell>
                          <Badge variant="outline">Resource blocking</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{summary}</TableCell>
                        <TableCell>
                          <Switch
                            checked={pool?.resource_blocking_enabled ?? false}
                            onCheckedChange={handleResourceBlockingEnabledChange}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleResourceBlockingEditOpen}
                            >
                              <IconEdit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteResourceBlockingOpen(true)}
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
          )}
        </div>
      </main>

      {/* Add throttle dialog */}
      <Dialog open={addThrottleOpen} onOpenChange={setAddThrottleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add throttling rule</DialogTitle>
            <DialogDescription>
              Set the minimum delay (in seconds) between requests to this domain when using this pool.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="add-domain">Domain</Label>
              <Input
                id="add-domain"
                placeholder="e.g. linkedin.com"
                value={formDomain}
                onChange={(e) => setFormDomain(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-delay">Delay (seconds)</Label>
              <Input
                id="add-delay"
                type="number"
                min={0}
                step={0.5}
                placeholder="e.g. 2"
                value={formDelay}
                onChange={(e) => setFormDelay(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="add-enabled"
                checked={formEnabled}
                onCheckedChange={(c) => setFormEnabled(!!c)}
              />
              <Label htmlFor="add-enabled" className="font-normal">Enabled</Label>
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddThrottleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddThrottleSubmit}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit throttle dialog */}
      <Dialog open={!!editRule} onOpenChange={(open) => !open && setEditRule(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit throttling rule</DialogTitle>
            <DialogDescription>Update the domain or delay for this rule.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-domain">Domain</Label>
              <Input
                id="edit-domain"
                placeholder="e.g. linkedin.com"
                value={formDomain}
                onChange={(e) => setFormDomain(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-delay">Delay (seconds)</Label>
              <Input
                id="edit-delay"
                type="number"
                min={0}
                step={0.5}
                placeholder="e.g. 2"
                value={formDelay}
                onChange={(e) => setFormDelay(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-enabled"
                checked={formEnabled}
                onCheckedChange={(c) => setFormEnabled(!!c)}
              />
              <Label htmlFor="edit-enabled" className="font-normal">Enabled</Label>
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRule(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditThrottleSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete throttle dialog */}
      <Dialog open={!!deleteRule} onOpenChange={(open) => !open && setDeleteRule(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete rule</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove the throttle rule for &quot;{deleteRule?.domain}&quot;? Requests to this domain will no longer be delayed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteRule(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteThrottleConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit resource blocking dialog */}
      <Dialog open={resourceBlockingOpen} onOpenChange={setResourceBlockingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resource blocking</DialogTitle>
            <DialogDescription>
              Block selected resource types for this pool to improve efficiency (e.g. images, stylesheets). Applies to all sessions in the pool.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Block these resource types</Label>
              <div className="grid grid-cols-2 gap-2">
                {RESOURCE_TYPE_OPTIONS.map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`block-${opt.value}`}
                      checked={blockingTypes.includes(opt.value)}
                      onCheckedChange={() => toggleBlockingType(opt.value)}
                    />
                    <Label htmlFor={`block-${opt.value}`} className="font-normal cursor-pointer">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResourceBlockingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResourceBlockingSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete resource blocking confirmation */}
      <Dialog open={deleteResourceBlockingOpen} onOpenChange={setDeleteResourceBlockingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove resource blocking</DialogTitle>
            <DialogDescription>
              This will disable resource blocking and clear all blocked types for this pool. You can add it again later from the Add menu.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteResourceBlockingOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteResourceBlockingConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
