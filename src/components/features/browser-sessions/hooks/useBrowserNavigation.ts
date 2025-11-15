import { useState, useEffect, useCallback } from 'react';

interface UseBrowserNavigationProps {
  setOnControlMessage: (callback: (data: Record<string, unknown>) => void) => void;
  sendMessage: (message: { type: string; [key: string]: unknown }) => void;
  isStreaming: boolean;
}

interface UseBrowserNavigationReturn {
  currentUrl: string;
  handleGoBack: () => void;
  handleGoForward: () => void;
  handleRefresh: () => void;
  handleGoToUrl: (url: string) => void;
  setCurrentUrl: (url: string) => void;
}

/**
 * Hook to handle browser navigation actions.
 * Single responsibility: Browser navigation actions only.
 */
export function useBrowserNavigation({
  setOnControlMessage,
  sendMessage,
  isStreaming,
}: UseBrowserNavigationProps): UseBrowserNavigationReturn {
  const [currentUrl, setCurrentUrlState] = useState<string>('');

  /**
   * Handle control messages related to navigation/URL changes.
   */
  const handleControlMessage = useCallback((data: Record<string, unknown>) => {
    if (data.type === 'url_changed' || data.type === 'page_switched') {
      // Update address bar with current URL
      if (data.url && typeof data.url === 'string') {
        setCurrentUrlState(data.url);
      }
    }
  }, []);

  // Register control message handler
  useEffect(() => {
    setOnControlMessage(handleControlMessage);
  }, [setOnControlMessage, handleControlMessage]);

  /**
   * Navigate back.
   */
  const handleGoBack = useCallback(() => {
    if (!isStreaming) return;

    sendMessage({
      type: 'navigate',
      action: 'back',
    });
  }, [isStreaming, sendMessage]);

  /**
   * Navigate forward.
   */
  const handleGoForward = useCallback(() => {
    if (!isStreaming) return;

    sendMessage({
      type: 'navigate',
      action: 'forward',
    });
  }, [isStreaming, sendMessage]);

  /**
   * Refresh current page.
   */
  const handleRefresh = useCallback(() => {
    if (!isStreaming) return;

    sendMessage({
      type: 'navigate',
      action: 'refresh',
    });
  }, [isStreaming, sendMessage]);

  /**
   * Navigate to a specific URL.
   */
  const handleGoToUrl = useCallback((url: string) => {
    if (!isStreaming) return;

    // Add protocol if missing
    let fullUrl = url.trim();
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = 'https://' + fullUrl;
    }

    sendMessage({
      type: 'navigate',
      action: 'goto',
      url: fullUrl,
    });
  }, [isStreaming, sendMessage]);

  /**
   * Set current URL (for manual updates).
   */
  const setCurrentUrl = useCallback((url: string) => {
    setCurrentUrlState(url);
  }, []);

  return {
    currentUrl,
    handleGoBack,
    handleGoForward,
    handleRefresh,
    handleGoToUrl,
    setCurrentUrl,
  };
}

