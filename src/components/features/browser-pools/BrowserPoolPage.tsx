"use client";

import { useState } from "react";
import { BrowserPoolTable } from "./BrowserPoolTable";
import { CreateBrowserPoolDialog } from "./CreateBrowserPoolDialog";
import { EditBrowserPoolDialog } from "./EditBrowserPoolDialog";
import { DeleteBrowserPoolDialog } from "./DeleteBrowserPoolDialog";
import { Button } from "@/components/ui/button";
import { IconPlus, IconStack2 } from "@tabler/icons-react";
import type { TBrowserPool } from "@/types/browser-pool";
import { useBrowserPoolStore } from "@/stores/browser-pool-store";

interface BrowserPoolPageProps {
  pools: TBrowserPool[];
  isLoading: boolean;
}

export function BrowserPoolPage({ pools, isLoading }: BrowserPoolPageProps) {
  const { deletePool } = useBrowserPoolStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [poolToEdit, setPoolToEdit] = useState<TBrowserPool | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [poolToDelete, setPoolToDelete] = useState<TBrowserPool | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (pool: TBrowserPool) => {
    setPoolToEdit(pool);
    setEditOpen(true);
  };

  const handleDelete = (pool: TBrowserPool) => {
    setPoolToDelete(pool);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!poolToDelete) return;
    setIsDeleting(true);
    try {
      await deletePool(poolToDelete.id);
      setDeleteOpen(false);
      setPoolToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading pools...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pools.length > 0 ? (
        <BrowserPoolTable
          pools={pools}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreate={() => setCreateOpen(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <IconStack2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No browser pools found</h3>
          <p className="text-muted-foreground mb-4">
            Create a pool of sessions for domain-based rotation.
          </p>
          <Button onClick={() => setCreateOpen(true)}>
            <IconPlus className="mr-2 h-4 w-4" />
            Create Pool
          </Button>
        </div>
      )}

      <CreateBrowserPoolDialog open={createOpen} onOpenChange={setCreateOpen} />
      <EditBrowserPoolDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setPoolToEdit(null);
        }}
        pool={poolToEdit}
      />
      <DeleteBrowserPoolDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!open) setPoolToDelete(null);
          setDeleteOpen(open);
        }}
        poolName={poolToDelete?.name ?? ""}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
