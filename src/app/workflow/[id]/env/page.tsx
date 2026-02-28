"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconArrowLeft, IconLoader2, IconPlus, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { workflowApi } from "@/lib/api/services/workflow-api";
import { BackendWorkflow } from "@/lib/api/transformers/workflow-transformer";
import { uiHelpers } from "@/stores";

type EnvRow = {
  key: string;
  value: string;
  type: "user_defined" | "workflow_defined";
};

interface EnvPageProps {
  params: Promise<{ id: string }>;
}

export default function WorkflowEnvPage({ params }: EnvPageProps) {
  const resolvedParams = React.use(params);
  const workflowId = resolvedParams.id;
  const [workflow, setWorkflow] = useState<BackendWorkflow | null>(null);
  const [rows, setRows] = useState<EnvRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWorkflow = useCallback(async () => {
    if (!workflowId) return;
    try {
      setIsLoading(true);
      setError(null);
      const list = await workflowApi.getWorkflows();
      const found = list.find((w) => w.id === workflowId);
      if (found) {
        setWorkflow(found);
        const env = found.env ?? {};
        setRows(
          Object.entries(env).map(([key, value]) => ({
            key,
            value: typeof value === "string" ? value : String(value ?? ""),
            type: "user_defined" as const,
          }))
        );
      } else {
        setError(`Workflow "${workflowId}" not found`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load workflow");
    } finally {
      setIsLoading(false);
    }
  }, [workflowId]);

  useEffect(() => {
    loadWorkflow();
  }, [loadWorkflow]);

  const addRow = () => {
    setRows((prev) => [...prev, { key: "", value: "", type: "user_defined" }]);
  };

  const updateRow = (index: number, field: "key" | "value", value: string) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!workflow) return;
    const env: Record<string, string> = {};
    rows.forEach((r) => {
      const k = r.key.trim();
      if (k) env[k] = r.value;
    });
    try {
      setIsSaving(true);
      await workflowApi.updateWorkflow(workflow.id, { ...workflow, env });
      uiHelpers.showSuccess("Saved", "Env variables updated.");
      setWorkflow((w) => (w ? { ...w, env } : null));
    } catch (err) {
      uiHelpers.showError(
        "Save failed",
        err instanceof Error ? err.message : "Failed to save env variables"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="px-4 lg:px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/workflow">
              <Button variant="outline" size="sm">
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Back to Workflows
              </Button>
            </Link>
          </div>
          <div className="flex justify-center py-12">
            <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !workflow) {
    return (
      <DashboardLayout>
        <div className="px-4 lg:px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/workflow">
              <Button variant="outline" size="sm">
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Back to Workflows
              </Button>
            </Link>
          </div>
          <p className="text-destructive">{error ?? "Workflow not found"}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 lg:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/workflow">
              <Button variant="outline" size="sm">
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Back to Workflows
              </Button>
            </Link>
            <Link href={`/workflow/${workflowId}`}>
              <Button variant="ghost" size="sm">
                Open workflow
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={addRow} variant="outline" size="sm">
              <IconPlus className="mr-2 h-4 w-4" />
              Add
            </Button>
            <Button onClick={handleSave} disabled={isSaving} size="sm">
              {isSaving ? (
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save
            </Button>
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-2">Env variables</h1>
        <p className="text-muted-foreground mb-6">
          Use <code className="rounded bg-muted px-1">{"{{ workflowenv.<key> }}"}</code> in node form
          fields (Jinja) to reference these values.
        </p>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No variables. Click Add to create one.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={row.key}
                        onChange={(e) => updateRow(index, "key", e.target.value)}
                        placeholder="e.g. API_KEY"
                        className="font-mono"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.value}
                        onChange={(e) => updateRow(index, "value", e.target.value)}
                        placeholder="Value"
                        className="font-mono"
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.type === "user_defined" ? "User defined" : "Workflow defined"}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeRow(index)}
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
