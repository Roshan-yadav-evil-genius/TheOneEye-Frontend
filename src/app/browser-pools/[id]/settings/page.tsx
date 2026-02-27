"use client";

import React, { useEffect, useState, useCallback } from "react";
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
  IconSettings2,
  IconPhoto,
  IconFileTypeCss,
  IconTypography,
  IconVideo,
  IconScript,
  IconFileText,
  IconApi,
  IconCloudDownload,
  IconDots,
} from "@tabler/icons-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { usePoolDomainThrottleStore } from "@/stores/pool-domain-throttle-store";
import { useBrowserPoolStore } from "@/stores/browser-pool-store";
import type { TBrowserPool, TPoolDomainThrottleRule } from "@/types/browser-pool";
import { RESOURCE_TYPE_OPTIONS } from "@/types/browser-session";

const RESOURCE_TYPE_ICONS: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  image: IconPhoto,
  stylesheet: IconFileTypeCss,
  font: IconTypography,
  media: IconVideo,
  script: IconScript,
  document: IconFileText,
  xhr: IconApi,
  fetch: IconCloudDownload,
  other: IconDots,
};

interface PoolSettingsPageProps {
  params: Promise<{ id: string }>;
}

type TableRowType = { type: "throttle"; rule: TPoolDomainThrottleRule };

function buildTableRows(rules: TPoolDomainThrottleRule[]): TableRowType[] {
  return rules.map((rule) => ({ type: "throttle", rule }));
}

export default function PoolSettingsPage({ params }: PoolSettingsPageProps) {
  const resolvedParams = React.use(params);
  const poolId = resolvedParams.id;
  const [pool, setPool] = useState<TBrowserPool | null>(null);
  const [addThrottleOpen, setAddThrottleOpen] = useState(false);
  const [editRule, setEditRule] = useState<TPoolDomainThrottleRule | null>(null);
  const [deleteRule, setDeleteRule] = useState<TPoolDomainThrottleRule | null>(null);
  const [formDomain, setFormDomain] = useState("");
  const [formDelay, setFormDelay] = useState("");
  const [formEnabled, setFormEnabled] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  const handleResourceBlockingMasterChange = useCallback(
    async (checked: boolean) => {
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
    },
    [pool, poolId, updatePool, loadPool]
  );

  const handleResourceBlockingTypeChange = useCallback(
    async (value: string, checked: boolean) => {
      if (!pool) return;
      const current = pool.blocked_resource_types ?? [];
      const newTypes = checked
        ? [...current, value]
        : current.filter((t) => t !== value);
      try {
        await updatePool(poolId, {
          resource_blocking_enabled: pool.resource_blocking_enabled ?? false,
          blocked_resource_types: newTypes,
        });
        await loadPool();
      } catch {
        // Error handled by store
      }
    },
    [pool, poolId, updatePool, loadPool]
  );

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

  const tableRows = buildTableRows(rules);

  return (
    <DashboardLayout>
      <main className="p-4">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">
            Pool settings {pool ? `– ${pool.name}` : ""}
          </h1>
          {rulesError && (
            <div className="rounded-md bg-destructive/10 text-destructive px-4 py-2 text-sm">
              {rulesError}
            </div>
          )}

          {pool && (
            <div className="rounded-lg border bg-muted/20 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Resource blocking</h2>
                <Switch
                  id="resource-blocking-master"
                  checked={pool.resource_blocking_enabled ?? false}
                  onCheckedChange={handleResourceBlockingMasterChange}
                />
              </div>
              <p className="text-muted-foreground text-sm">
                Block selected resource types for this pool to improve efficiency. Applies to all sessions in the pool.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {RESOURCE_TYPE_OPTIONS.map((opt) => {
                  const IconComponent = RESOURCE_TYPE_ICONS[opt.value] ?? IconDots;
                  return (
                  <div
                    key={opt.value}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <Label
                      htmlFor={`resource-block-${opt.value}`}
                      className="font-normal cursor-pointer flex items-center gap-2"
                    >
                      <IconComponent className="h-5 w-5 shrink-0 text-muted-foreground" size={20} />
                      {opt.label}
                    </Label>
                    <Switch
                      id={`resource-block-${opt.value}`}
                      checked={(pool.blocked_resource_types ?? []).includes(opt.value)}
                      onCheckedChange={(checked) =>
                        handleResourceBlockingTypeChange(opt.value, !!checked)
                      }
                      disabled={!pool.resource_blocking_enabled}
                    />
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="rounded-lg border bg-muted/20 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Throttling</h2>
              <Button onClick={handleAddThrottleOpen}>
                <IconPlus className="mr-2 h-4 w-4" />
                Add throttling
              </Button>
            </div>
            {rulesLoading && rules.length === 0 ? (
              <div className="rounded-md border flex items-center justify-center py-16">
                <div className="text-center">
                  <IconLoader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-semibold mb-2">Loading throttling rules</h3>
                  <p className="text-muted-foreground text-sm">
                    Please wait while we load throttling rules...
                  </p>
                </div>
              </div>
            ) : !rulesLoading && rules.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 rounded-md border border-dashed">
                <IconSettings2 className="h-14 w-14 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No throttling rules</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-6">
                  Add throttling rules to control request delays per domain for this pool.
                </p>
                <Button onClick={handleAddThrottleOpen}>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add throttling rule
                </Button>
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
                    {tableRows.map((row, index) => (
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
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
    </DashboardLayout>
  );
}
