"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconKeyOff, IconPlus } from "@tabler/icons-react";
import { listApiKeys, revokeApiKey } from "@/lib/api/services/api-keys-api";
import type { ApiKeyListItem } from "@/types";
import { CreateApiKeyDialog } from "@/components/features/api-keys/CreateApiKeyDialog";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [revokeOpen, setRevokeOpen] = useState(false);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listApiKeys();
      setKeys(data);
    } catch {
      setKeys([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleGenerateClick = () => {
    console.log("[API Keys] Generate API Key button clicked");
    setCreateOpen(true);
  };

  const handleRevokeClick = (id: string) => {
    setRevokeId(id);
    setRevokeOpen(true);
  };

  const handleRevokeConfirm = async () => {
    if (!revokeId) return;
    try {
      await revokeApiKey(revokeId);
      setRevokeOpen(false);
      setRevokeId(null);
      fetchKeys();
    } catch {
      // Error handled by service
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <IconKeyOff className="h-7 w-7" />
              API Keys
            </h1>
            <p className="text-muted-foreground mt-1">
              Create API keys to authenticate scripts and external callers for workflow operations (webhooks, execute, etc.).
            </p>
          </div>
          <Button type="button" onClick={handleGenerateClick}>
            <IconPlus className="mr-2 h-4 w-4" />
            Generate API Key
          </Button>
        </div>

        {/* How to use */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <h3 className="font-semibold mb-2">How to use</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Send your API key in the request header when calling workflow endpoints (e.g. webhooks, execute, start/stop).
            Use the header: <code className="bg-muted px-1 rounded">Authorization: Api-Key &lt;your_key&gt;</code> or <code className="bg-muted px-1 rounded">X-Api-Key: &lt;your_key&gt;</code>.
          </p>
          <p className="text-sm text-muted-foreground">
            Always use HTTPS when sending the key in production.
          </p>
        </div>

        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : keys.length === 0 ? (
          <div className="rounded-lg border p-8 text-center text-muted-foreground">
            No API keys yet. Click &quot;Generate API Key&quot; to create one.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Prefix</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="font-medium">{k.name}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{k.prefix}***</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(k.created_at)}</TableCell>
                  <TableCell>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleRevokeClick(k.id)}>
                      Revoke
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <CreateApiKeyDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onDone={fetchKeys}
        />

        {/* Revoke confirm */}
        <AlertDialog open={revokeOpen} onOpenChange={setRevokeOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revoke API Key?</AlertDialogTitle>
              <AlertDialogDescription>
                This will invalidate the key immediately. Any scripts using it will no longer be able to authenticate.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRevokeConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Revoke
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
