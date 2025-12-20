import { useEffect, useRef, useCallback, useState } from 'react';

// Default canvas dimensions (used until first frame with viewport info arrives)
const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;

// Header size in bytes (width: 4 bytes + height: 4 bytes)
const VIEWPORT_HEADER_SIZE = 8;

interface UseBrowserCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  scaleCanvas: () => void;
  renderFrame: (frameData: Blob | ArrayBuffer) => void;
  /** Current viewport width from the browser */
  viewportWidth: number;
  /** Current viewport height from the browser */
  viewportHeight: number;
}

/**
 * Hook to manage browser canvas rendering with dynamic viewport support.
 * Single responsibility: Canvas rendering and frame display only.
 * 
 * Frame format from backend: [width: 4 bytes][height: 4 bytes][JPEG data]
 */
export function useBrowserCanvas(): UseBrowserCanvasReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Track current viewport dimensions from the browser
  const [viewportWidth, setViewportWidth] = useState(DEFAULT_WIDTH);
  const [viewportHeight, setViewportHeight] = useState(DEFAULT_HEIGHT);
  
  // Use refs for dimensions to avoid stale closures in callbacks
  const viewportRef = useRef({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set initial canvas internal size
    canvas.width = DEFAULT_WIDTH;
    canvas.height = DEFAULT_HEIGHT;

    // Get 2D context
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('❌ Failed to get canvas 2D context');
      return;
    }
    contextRef.current = ctx;
  }, []);

  /**
   * Update canvas internal dimensions when viewport changes.
   */
  const updateCanvasDimensions = useCallback((width: number, height: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Only update if dimensions actually changed
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }, []);

  /**
   * Scale canvas to fit container while maintaining aspect ratio.
   * Uses current viewport dimensions for aspect ratio calculation.
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

    // Calculate aspect ratio using current viewport dimensions
    const { width: vpWidth, height: vpHeight } = viewportRef.current;
    const aspectRatio = vpWidth / vpHeight;

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

  // Re-scale when viewport dimensions change
  useEffect(() => {
    scaleCanvas();
  }, [viewportWidth, viewportHeight, scaleCanvas]);

  /**
   * Parse viewport dimensions from frame header.
   * Frame format: [width: 4 bytes BE][height: 4 bytes BE][JPEG data]
   */
  const parseViewportHeader = useCallback((data: ArrayBuffer): { width: number; height: number; imageData: ArrayBuffer } => {
    const view = new DataView(data);
    const width = view.getUint32(0, false); // big-endian
    const height = view.getUint32(4, false); // big-endian
    const imageData = data.slice(VIEWPORT_HEADER_SIZE);
    return { width, height, imageData };
  }, []);

  /**
   * Render binary frame data (with viewport header) to canvas.
   * Parses viewport dimensions from header and updates canvas accordingly.
   */
  const renderFrame = useCallback((frameData: Blob | ArrayBuffer) => {
    const ctx = contextRef.current;
    if (!ctx) return;

    // Convert Blob to ArrayBuffer if needed
    if (frameData instanceof Blob) {
      frameData.arrayBuffer().then((buffer) => {
        processFrame(buffer);
      });
    } else {
      processFrame(frameData);
    }

    function processFrame(data: ArrayBuffer) {
      // Check if data has viewport header (at least 8 bytes + some image data)
      if (data.byteLength < VIEWPORT_HEADER_SIZE + 100) {
        console.warn('Frame data too small, skipping');
        return;
      }

      // Parse viewport dimensions from header
      const { width, height, imageData } = parseViewportHeader(data);
      
      // Update viewport dimensions if changed
      if (width !== viewportRef.current.width || height !== viewportRef.current.height) {
        viewportRef.current = { width, height };
        setViewportWidth(width);
        setViewportHeight(height);
        updateCanvasDimensions(width, height);
      }

      // Create Blob from image data (without header)
      const blob = new Blob([imageData], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);

      // Create image and draw to canvas
      const img = new Image();
      img.onload = () => {
        // Draw at actual viewport dimensions
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(imageUrl);
      };
      img.onerror = () => {
        console.error('❌ Error loading frame image');
        URL.revokeObjectURL(imageUrl);
      };
      img.src = imageUrl;
    }
  }, [parseViewportHeader, updateCanvasDimensions]);

  return {
    canvasRef,
    scaleCanvas,
    renderFrame,
    viewportWidth,
    viewportHeight,
  };
}
