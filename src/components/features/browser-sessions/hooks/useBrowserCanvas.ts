import { useEffect, useRef, useCallback } from 'react';

// Canvas dimensions (internal resolution)
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

interface UseBrowserCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  scaleCanvas: () => void;
  renderFrame: (frameData: Blob | ArrayBuffer) => void;
}

/**
 * Hook to manage browser canvas rendering.
 * Single responsibility: Canvas rendering and frame display only.
 */
export function useBrowserCanvas(): UseBrowserCanvasReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize canvas dimensions and context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas internal size
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // Get 2D context
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('❌ Failed to get canvas 2D context');
      return;
    }
    contextRef.current = ctx;
  }, []);

  /**
   * Scale canvas to fit container while maintaining aspect ratio.
   * Dynamically measures container and sibling elements (tab bar, address bar).
   */
  const scaleCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the canvas container (the div wrapping the canvas)
    const canvasContainer = canvas.parentElement;
    if (!canvasContainer) return;

    // Get the parent container that holds tab bar, address bar, and canvas
    const parentContainer = canvasContainer.parentElement;
    if (!parentContainer) return;

    // Get container's actual dimensions using clientWidth/clientHeight (more reliable)
    const containerWidth = parentContainer.clientWidth;
    const containerHeight = parentContainer.clientHeight;

    // Dynamically measure tab bar and address bar heights
    // Sum heights of all sibling elements before the canvas container
    let usedHeight = 0;
    const children = Array.from(parentContainer.children);
    for (const child of children) {
      if (child === canvasContainer) {
        break; // Stop when we reach the canvas container
      }
      usedHeight += child.clientHeight || 0;
    }

    // Calculate available space for canvas
    // Account for padding on canvas container (p-1 = 4px on each side = 8px total)
    const padding = 8;
    const availableWidth = containerWidth - padding;
    const availableHeight = containerHeight - usedHeight - padding;

    // Ensure we have positive dimensions
    if (availableWidth <= 0 || availableHeight <= 0) {
      return; // Not enough space, skip scaling
    }

    // Calculate aspect ratio
    const aspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;

    // Calculate display dimensions maintaining aspect ratio
    // Start with width-based calculation
    let displayWidth = availableWidth;
    let displayHeight = displayWidth / aspectRatio;

    // If height exceeds available space, scale down based on height
    if (displayHeight > availableHeight) {
      displayHeight = availableHeight;
      displayWidth = displayHeight * aspectRatio;
    }

    // Ensure we don't exceed container width (safety check)
    if (displayWidth > availableWidth) {
      displayWidth = availableWidth;
      displayHeight = displayWidth / aspectRatio;
    }

    // Apply dimensions
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '100%';
    canvas.style.objectFit = 'contain';
  }, []);

  // Scale on mount, window resize, and container size changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial scale
    scaleCanvas();

    // Use ResizeObserver for container size changes (more reliable)
    const container = canvas.parentElement?.parentElement;
    let resizeObserver: ResizeObserver | null = null;

    if (container && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        // Small delay to ensure layout is complete
        setTimeout(scaleCanvas, 0);
      });
      resizeObserver.observe(container);
    }

    // Also listen to window resize as fallback
    window.addEventListener('resize', scaleCanvas);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', scaleCanvas);
    };
  }, [scaleCanvas]);

  /**
   * Render binary frame data (JPEG image) to canvas.
   */
  const renderFrame = useCallback((frameData: Blob | ArrayBuffer) => {
    const ctx = contextRef.current;
    if (!ctx) return;

    // Create Blob from binary data
    const blob = frameData instanceof Blob
      ? frameData
      : new Blob([frameData], { type: 'image/jpeg' });

    // Create object URL from blob
    const imageUrl = URL.createObjectURL(blob);

    // Create image and draw to canvas
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      // Revoke object URL to free memory
      URL.revokeObjectURL(imageUrl);
    };
    img.onerror = () => {
      console.error('❌ Error loading frame image');
      URL.revokeObjectURL(imageUrl);
    };
    img.src = imageUrl;
  }, []);

  return {
    canvasRef,
    scaleCanvas,
    renderFrame,
  };
}

