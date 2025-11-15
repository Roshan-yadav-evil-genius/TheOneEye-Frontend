import { useEffect } from 'react';

interface UseBrowserKeyboardEventsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  sendMessage: (message: { type: string; [key: string]: unknown }) => void;
  isStreaming: boolean;
}

/**
 * Hook to handle keyboard events for browser canvas.
 * Single responsibility: Keyboard event handling only.
 */
export function useBrowserKeyboardEvents({
  canvasRef,
  sendMessage,
  isStreaming,
}: UseBrowserKeyboardEventsProps) {
  /**
   * Send keyboard event to backend via WebSocket.
   */
  const sendKeyboardEvent = (type: string, event: KeyboardEvent) => {
    if (!isStreaming) return;

    // Only send if canvas is focused
    if (document.activeElement !== canvasRef.current) {
      return;
    }

    const message: Record<string, unknown> = {
      type,
      key: event.key,
      code: event.code,
      ctrlKey: event.ctrlKey || false,
      altKey: event.altKey || false,
      shiftKey: event.shiftKey || false,
      metaKey: event.metaKey || false,
    };

    // Add repeat property for keydown events
    if (type === 'keydown') {
      message.repeat = event.repeat || false;
    }

    sendMessage(message);
  };

  // Setup keyboard event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent common browser shortcuts
      if (event.ctrlKey || event.metaKey) {
        const key = event.key.toLowerCase();
        // Prevent Ctrl+R (refresh), Ctrl+W (close), Ctrl+N (new window), Ctrl+T (new tab), etc.
        if (key === 'r' || key === 'w' || key === 'n' || key === 't') {
          event.preventDefault();
          event.stopPropagation();
        }
      }

      // Prevent default browser behavior for all keys when canvas is focused
      event.preventDefault();
      event.stopPropagation();
      sendKeyboardEvent('keydown', event);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Prevent default browser behavior for all keys when canvas is focused
      event.preventDefault();
      event.stopPropagation();
      sendKeyboardEvent('keyup', event);
    };

    canvas.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('keyup', handleKeyUp);

    return () => {
      canvas.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('keyup', handleKeyUp);
    };
  }, [canvasRef, isStreaming, sendKeyboardEvent]);
}

