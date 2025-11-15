"use client";

import { useState } from "react";
import { BrowserSessionTable } from "./browser-session-table";
import { CreateBrowserSessionDialog } from "./create-browser-session-dialog";
import { EditBrowserSessionDialog } from "./edit-browser-session-dialog";
import { DeleteBrowserSessionDialog } from "./delete-browser-session-dialog";
import { Button } from "@/components/ui/button";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { TBrowserSession } from "@/types/browser-session";
import { useBrowserSessionList } from "@/hooks/useBrowserSessionList";
import { useUIStore } from "@/stores/ui-store";

interface BrowserSessionListProps {
  sessions: TBrowserSession[];
}

export function BrowserSessionList({ sessions }: BrowserSessionListProps) {
  const {
    modals,
    deleteDialogOpen,
    sessionToDelete,
    isDeleting,
    editDialogOpen,
    setEditDialogOpen,
    sessionToEdit,
    handleEdit,
    handleView,
    handleDelete,
    handleLaunch,
    handleConfirmDelete,
    handleCancelDelete,
    handleCreate,
  } = useBrowserSessionList({ sessions });

  return (
    <div className="space-y-6">
      {/* Browser Session table */}
      {sessions.length > 0 ? (
        <BrowserSessionTable
          sessions={sessions}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onLaunch={handleLaunch}
          onCreate={handleCreate}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <IconSearch className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No browser sessions found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first browser session
          </p>
          <Button onClick={handleCreate}>
            <IconPlus className="mr-2 h-4 w-4" />
            Create Session
          </Button>
        </div>
      )}

      {/* Create Browser Session Dialog */}
      <CreateBrowserSessionDialog
        open={modals.createBrowserSession}
        onOpenChange={(open) => {
          if (!open) {
            useUIStore.getState().closeModal('createBrowserSession');
          }
        }}
      />

      {/* Edit Browser Session Dialog */}
      <EditBrowserSessionDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        session={sessionToEdit}
      />

      {/* Delete Browser Session Dialog */}
      <DeleteBrowserSessionDialog
        open={deleteDialogOpen}
        onOpenChange={handleCancelDelete}
        sessionName={sessionToDelete?.name || ""}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}








