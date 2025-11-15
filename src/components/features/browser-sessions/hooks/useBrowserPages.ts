import { useState, useEffect, useCallback } from 'react';

interface UseBrowserPagesProps {
  setOnControlMessage: (callback: (data: Record<string, unknown>) => void) => void;
  sendMessage: (message: { type: string; [key: string]: unknown }) => void;
  isStreaming: boolean;
}

interface UseBrowserPagesReturn {
  activePageIds: string[];
  currentPageId: string | null;
  handlePageSwitch: (pageId: string) => void;
  handleCloseTab: (pageId: string) => void;
  handleNewTab: () => void;
}

/**
 * Hook to manage browser pages/tabs from backend WebSocket messages.
 * Single responsibility: Page/tab management from backend only.
 */
export function useBrowserPages({
  setOnControlMessage,
  sendMessage,
  isStreaming,
}: UseBrowserPagesProps): UseBrowserPagesReturn {
  const [activePageIdsSet, setActivePageIdsSet] = useState<Set<string>>(new Set());
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);

  /**
   * Handle control messages related to pages.
   */
  const handleControlMessage = useCallback((data: Record<string, unknown>) => {
    if (data.type === 'page_added') {
      // Add page ID to tracking set
      if (data.page_id && typeof data.page_id === 'string') {
        setActivePageIdsSet((prev) => {
          const newSet = new Set(prev);
          newSet.add(data.page_id as string);
          return newSet;
        });
      }
    } else if (data.type === 'page_removed') {
      // Remove page ID from tracking set
      if (data.page_id && typeof data.page_id === 'string') {
        setActivePageIdsSet((prev) => {
          const newSet = new Set(prev);
          newSet.delete(data.page_id as string);
          return newSet;
        });
        // If removed page was current, clear current page
        if (currentPageId === data.page_id) {
          setCurrentPageId(null);
        }
      }
    } else if (data.type === 'pages_sync') {
      // Initialize/sync all page IDs
      if (data.page_ids && Array.isArray(data.page_ids)) {
        setActivePageIdsSet(new Set(data.page_ids as string[]));
      }
    } else if (data.type === 'page_switched') {
      // Update current page ID
      if (data.page_id && typeof data.page_id === 'string') {
        setCurrentPageId(data.page_id as string);
      }
    }
  }, [currentPageId]);

  // Register control message handler
  useEffect(() => {
    setOnControlMessage(handleControlMessage);
  }, [setOnControlMessage, handleControlMessage]);

  /**
   * Switch to a different page/tab.
   */
  const handlePageSwitch = useCallback((pageId: string) => {
    if (!isStreaming) return;

    sendMessage({
      type: 'page_switch',
      page_id: pageId,
    });
  }, [isStreaming, sendMessage]);

  /**
   * Close a page/tab.
   */
  const handleCloseTab = useCallback((pageId: string) => {
    if (!isStreaming) return;

    sendMessage({
      type: 'close_tab',
      page_id: pageId,
    });
  }, [isStreaming, sendMessage]);

  /**
   * Create a new tab.
   */
  const handleNewTab = useCallback(() => {
    if (!isStreaming) return;

    sendMessage({
      type: 'new_tab',
    });
  }, [isStreaming, sendMessage]);

  return {
    activePageIds: Array.from(activePageIdsSet),
    currentPageId,
    handlePageSwitch,
    handleCloseTab,
    handleNewTab,
  };
}

