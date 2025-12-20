import { useEffect, useRef, useCallback } from 'react';

// Throttle mousemove events to avoid overwhelming backend
const MOUSEMOVE_THROTTLE_MS = 16; // ~60fps for mouse movement

interface UseBrowserMouseEventsProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  sendMessage: (message: { type: string; [key: string]: unknown }) => void;
  isStreaming: boolean;
  /** Current viewport width from the browser (dynamic) */
  viewportWidth: number;
  /** Current viewport height from the browser (dynamic) */
  viewportHeight: number;
}

/**
 * Hook to handle mouse events for browser canvas.
 * Single responsibility: Mouse event handling only.
 * 
 * Uses dynamic viewport dimensions for accurate coordinate mapping,
 * even when popup windows have different sizes than the main browser.
 */
export function useBrowserMouseEvents({
  canvasRef,
  sendMessage,
  isStreaming,
  viewportWidth,
  viewportHeight,
}: UseBrowserMouseEventsProps) {
  const mousemoveThrottleRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use refs for viewport dimensions to avoid stale closures
  const viewportRef = useRef({ width: viewportWidth, height: viewportHeight });
  
  // Update ref when viewport changes
  useEffect(() => {
    viewportRef.current = { width: viewportWidth, height: viewportHeight };
  }, [viewportWidth, viewportHeight]);

  /**
   * Map mouse button number to button name.
   */
  const getButtonName = useCallback((button: number): string => {
    const buttonMap: Record<number, string> = {
      0: 'left',
      1: 'middle',
      2: 'right',
    };
    return buttonMap[button] || 'left';
  }, []);

  /**
   * Map coordinates from display to browser viewport resolution.
   * Uses dynamic viewport dimensions for accurate mapping regardless of popup size.
   */
  const mapCoordinates = useCallback((clientX: number, clientY: number): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;
    
    // Use canvas internal dimensions (which now match viewport)
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.round(clickX * scaleX);
    const y = Math.round(clickY * scaleY);
    
    // Bound to current viewport dimensions
    const { width, height } = viewportRef.current;
    const boundedX = Math.max(0, Math.min(x, width - 1));
    const boundedY = Math.max(0, Math.min(y, height - 1));
    
    return { x: boundedX, y: boundedY };
  }, [canvasRef]);

  /**
   * Send mouse event to backend via WebSocket.
   */
  const sendMouseEvent = useCallback((type: string, event: MouseEvent | WheelEvent) => {
    if (!isStreaming) return;

    const coords = mapCoordinates(event.clientX, event.clientY);
    const message: { type: string; [key: string]: unknown } = {
      type,
      x: coords.x,
      y: coords.y,
    };

    // Add button info for mouse events
    if ('button' in event && event.button !== undefined) {
      message.button = getButtonName(event.button);
    }

    // Add wheel delta for wheel events
    if (type === 'wheel' && 'deltaX' in event) {
      message.deltaX = event.deltaX || 0;
      message.deltaY = event.deltaY || 0;
      message.deltaZ = event.deltaZ || 0;
    }

    sendMessage(message);
  }, [isStreaming, mapCoordinates, getButtonName, sendMessage]);

  // Setup mouse event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Prevent context menu on right click
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    // Mouse move handler with throttling
    const handleMouseMove = (event: MouseEvent) => {
      if (!isStreaming) return;

      // Throttle mousemove events
      if (mousemoveThrottleRef.current) {
        clearTimeout(mousemoveThrottleRef.current);
      }

      mousemoveThrottleRef.current = setTimeout(() => {
        sendMouseEvent('mousemove', event);
      }, MOUSEMOVE_THROTTLE_MS);
    };

    // Mouse down handler
    const handleMouseDown = (event: MouseEvent) => {
      sendMouseEvent('mousedown', event);
    };

    // Mouse up handler
    const handleMouseUp = (event: MouseEvent) => {
      sendMouseEvent('mouseup', event);
    };

    // Wheel/scroll handler
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault(); // Prevent page scroll
      sendMouseEvent('wheel', event);
    };

    // Mouse leave handler (clear pending mousemove events)
    const handleMouseLeave = () => {
      if (mousemoveThrottleRef.current) {
        clearTimeout(mousemoveThrottleRef.current);
        mousemoveThrottleRef.current = null;
      }
    };

    canvas.addEventListener('contextmenu', handleContextMenu);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('contextmenu', handleContextMenu);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mouseleave', handleMouseLeave);

      // Clear any pending throttle
      if (mousemoveThrottleRef.current) {
        clearTimeout(mousemoveThrottleRef.current);
        mousemoveThrottleRef.current = null;
      }
    };
  }, [canvasRef, isStreaming, sendMouseEvent]);
}
