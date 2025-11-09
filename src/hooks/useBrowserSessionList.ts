import { useState } from 'react';
import { TBrowserSession } from '@/types/browser-session';
import { useBrowserSessionStore } from '@/stores/browser-session-store';
import { useUIStore } from '@/stores/ui-store';
import { uiHelpers } from '@/stores/ui-store';

interface UseBrowserSessionListProps {
  sessions: TBrowserSession[];
}

export function useBrowserSessionList({ sessions }: UseBrowserSessionListProps) {
  const { deleteSession, launchBrowser } = useBrowserSessionStore();
  const { modals } = useUIStore();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<TBrowserSession | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<TBrowserSession | null>(null);

  const handleEdit = (session: TBrowserSession) => {
    setSessionToEdit(session);
    setEditDialogOpen(true);
  };

  const handleView = (session: TBrowserSession) => {
    // TODO: Implement view functionality
    console.log('View session:', session);
    uiHelpers.showInfo("View Session", `Viewing session: ${session.name}`);
  };

  const handleDelete = (session: TBrowserSession) => {
    setSessionToDelete(session);
    setDeleteDialogOpen(true);
  };

  const handleLaunch = async (session: TBrowserSession) => {
    try {
      await launchBrowser(session.id);
      uiHelpers.showSuccess("Browser Launched", `Browser session "${session.name}" launched successfully (dummy)`);
    } catch (error) {
      uiHelpers.showError("Launch Failed", "Failed to launch browser session");
    }
  };

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteSession(sessionToDelete.id);
      uiHelpers.showSuccess("Session Deleted", "Browser session deleted successfully");
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    } catch (error) {
      uiHelpers.showError("Delete Failed", "Failed to delete browser session");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSessionToDelete(null);
  };

  const handleCreate = () => {
    useUIStore.getState().openModal('createBrowserSession');
  };

  return {
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
  };
}






