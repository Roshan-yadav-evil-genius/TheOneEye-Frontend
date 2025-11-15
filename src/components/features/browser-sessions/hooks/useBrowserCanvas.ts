import { useEffect, useRef, useCallback } from 'react';

// Canvas dimensions (internal resolution)
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

interface UseBrowserCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
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
   * Scale canvas to fit viewport while maintaining aspect ratio.
   * Accounts for toolbar and tabs height.
   */
  const scaleCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    // Get toolbar and tabs height (approximate, can be adjusted)
    const toolbarHeight = 64; // Approximate toolbar height
    const tabsHeight = 48; // Approximate tabs height

    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight - toolbarHeight - tabsHeight;

    const aspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;

    let displayWidth = maxWidth;
    let displayHeight = displayWidth / aspectRatio;

    if (displayHeight > maxHeight) {
      displayHeight = maxHeight;
      displayWidth = displayHeight * aspectRatio;
    }

    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';
  }, []);

  // Scale on mount and window resize
  useEffect(() => {
    scaleCanvas();
    window.addEventListener('resize', scaleCanvas);
    return () => {
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

