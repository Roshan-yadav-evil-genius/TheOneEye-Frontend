"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useBrowserSessionStore } from "@/stores/browser-session-store";

export interface BrowserPoolFormData {
  name: string;
  description: string;
  session_ids: string[];
}

interface BrowserPoolFormProps {
  initialData?: Partial<BrowserPoolFormData>;
  onSubmit: (data: BrowserPoolFormData) => Promise<void>;
  submitButtonText: string;
  onCancel: () => void;
}

export function BrowserPoolForm({
  initialData,
  onSubmit,
  submitButtonText,
  onCancel,
}: BrowserPoolFormProps) {
  const { sessions, loadSessions } = useBrowserSessionStore();
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [sessionIds, setSessionIds] = useState<string[]>(initialData?.session_ids ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const toggleSession = (id: string) => {
    setSessionIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (sessionIds.length < 1) {
      setError("At least one session must be selected.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || "",
        session_ids: sessionIds,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pool-name">Name</Label>
        <Input
          id="pool-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Pool name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pool-desc">Description (optional)</Label>
        <Input
          id="pool-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
        />
      </div>
      <div className="space-y-2">
        <Label>Sessions (select at least one)</Label>
        <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions. Create sessions first.</p>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`session-${session.id}`}
                  checked={sessionIds.includes(session.id)}
                  onCheckedChange={() => toggleSession(session.id)}
                />
                <label htmlFor={`session-${session.id}`} className="text-sm font-medium leading-none cursor-pointer">
                  {session.name}
                </label>
              </div>
            ))
          )}
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || sessions.length === 0}>
          {isSubmitting ? "Saving..." : submitButtonText}
        </Button>
      </div>
    </form>
  );
}
