"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconCopy } from "@tabler/icons-react";
import { createApiKey } from "@/lib/api/services/api-keys-api";
import type { ApiKeyCreateResponse } from "@/types";

interface CreateApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone: () => void;
}

export function CreateApiKeyDialog({ open, onOpenChange, onDone }: CreateApiKeyDialogProps) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createdKey, setCreatedKey] = useState<ApiKeyCreateResponse | null>(null);

  // Reset when dialog opens
  useEffect(() => {
    if (open) {
      setName("");
      setSubmitting(false);
      setCreatedKey(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[API Keys] Generate (form submit) clicked", { name: name.trim(), submitting });
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      console.log("[API Keys] Calling createApiKey...");
      const result = await createApiKey(name.trim());
      console.log("[API Keys] createApiKey success", { id: result.id, prefix: result.prefix });
      setCreatedKey(result);
    } catch (err) {
      console.log("[API Keys] createApiKey error", err);
      // Error handled by base service / toast
    } finally {
      setSubmitting(false);
    }
  };

  const handleDone = () => {
    onDone();
    onOpenChange(false);
    setCreatedKey(null);
  };

  const handleCopyKey = () => {
    if (createdKey?.key && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(createdKey.key);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {createdKey == null ? (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Generate API Key</DialogTitle>
              <DialogDescription>
                Give this key a name so you can identify it later (e.g. &quot;Production script&quot;).
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="api-key-name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="api-key-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Production script"
                  autoComplete="off"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!name.trim() || submitting}>
                {submitting ? "Creating…" : "Generate"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>API Key Created</DialogTitle>
              <DialogDescription>
                Copy your key now. You won&apos;t be able to see it again.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Key</label>
                <div className="flex gap-2">
                  <Input readOnly value={createdKey.key} className="font-mono" />
                  <Button type="button" variant="outline" size="icon" onClick={handleCopyKey} title="Copy">
                    <IconCopy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-amber-600 dark:text-amber-500">
                Store this key securely. Use it in the Authorization header as: Api-Key &lt;key&gt;
              </p>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleDone}>
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
