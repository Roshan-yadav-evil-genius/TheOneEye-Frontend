"use client";

import React, { useEffect, useState } from "react";
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
import { IconArrowLeft, IconLoader2, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useDomainThrottleStore } from "@/stores/domain-throttle-store";
import { useBrowserSessionStore } from "@/stores/browser-session-store";
import type { TDomainThrottleRule } from "@/types/browser-session";

interface DomainThrottlePageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: DomainThrottlePageProps) {
  const resolvedParams = React.use(params);
  const sessionId = resolvedParams.id;
  const [sessionName, setSessionName] = useState<string>("");
  const [addOpen, setAddOpen] = useState(false);
  const [editRule, setEditRule] = useState<TDomainThrottleRule | null>(null);
  const [deleteRule, setDeleteRule] = useState<TDomainThrottleRule | null>(null);
  const [formDomain, setFormDomain] = useState("");
  const [formDelay, setFormDelay] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const {
    rules,
    isLoading,
    error,
    listRules,
    createRule,
    updateRule,
    deleteRule: deleteRuleApi,
    reset,
  } = useDomainThrottleStore();

  const { getSessionById } = useBrowserSessionStore();

  useEffect(() => {
    if (!sessionId) return;
    const load = async () => {
      try {
        const session = await getSessionById(sessionId);
        setSessionName(session.name);
      } catch {
        setSessionName("");
      }
    };
    load();
  }, [sessionId, getSessionById]);

  useEffect(() => {
    if (!sessionId) return;
    reset();
    listRules(sessionId).catch(() => {});
  }, [sessionId, listRules, reset]);

  const handleAddOpen = () => {
    setFormDomain("");
    setFormDelay("");
    setFormError(null);
    setAddOpen(true);
  };

  const handleAddSubmit = async () => {
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
      await createRule(sessionId, { domain, delay_seconds: delayNum });
      setAddOpen(false);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to create rule");
    }
  };

  const handleEditOpen = (rule: TDomainThrottleRule) => {
    setEditRule(rule);
    setFormDomain(rule.domain);
    setFormDelay(String(rule.delay_seconds));
    setFormError(null);
  };

  const handleEditSubmit = async () => {
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
      await updateRule(sessionId, editRule.id, { domain, delay_seconds: delayNum });
      setEditRule(null);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Failed to update rule");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRule) return;
    try {
      await deleteRuleApi(sessionId, deleteRule.id);
      setDeleteRule(null);
    } catch {
      // Store error is set
    }
  };

  return (
    <DashboardLayout>
      <main className="p-4">
        <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            Domain throttle
            ({sessionName ? `${sessionName}` : ""})
          </h1>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 text-destructive px-4 py-2 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {rules.length} rule{rules.length !== 1 ? "s" : ""}
          </span>
          <Button onClick={handleAddOpen}>
            <IconPlus className="mr-2 h-4 w-4" />
            Add rule
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Delay (seconds)</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && rules.length === 0 ? (
                <TableRow key="loading">
                  <TableCell colSpan={3} className="text-center py-8">
                    <IconLoader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading rules...
                  </TableCell>
                </TableRow>
              ) : rules.length === 0 ? (
                <TableRow key="empty">
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No domain throttle rules. Add a rule to enforce a delay between requests to that domain.
                  </TableCell>
                </TableRow>
              ) : (
                rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.domain}</TableCell>
                    <TableCell>{rule.delay_seconds}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditOpen(rule)}
                        >
                          <IconEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteRule(rule)}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        </div>
      </main>

      {/* Add rule dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add domain throttle rule</DialogTitle>
            <DialogDescription>
              Set the minimum delay (in seconds) between requests to this domain when using the browser session.
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
            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubmit}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit rule dialog */}
      <Dialog open={!!editRule} onOpenChange={(open) => !open && setEditRule(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit domain throttle rule</DialogTitle>
            <DialogDescription>
              Update the domain or delay for this rule.
            </DialogDescription>
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
            {formError && (
              <p className="text-sm text-destructive">{formError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRule(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteRule} onOpenChange={(open) => !open && setDeleteRule(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete rule</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove the throttle rule for "{deleteRule?.domain}"? Requests to this domain will no longer be delayed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteRule(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
