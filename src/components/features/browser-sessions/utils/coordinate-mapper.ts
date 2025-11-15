import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants/streaming';

export interface MappedCoordinates {
  x: number;
  y: number;
}

/**
 * Map screen coordinates to canvas coordinates
 * Accounts for canvas scaling and aspect ratio
 * 
 * @param clientX - Screen X coordinate
 * @param clientY - Screen Y coordinate
 * @param canvas - Canvas element
 * @returns Mapped coordinates clamped to canvas bounds
 */
export function mapCoordinates(
  clientX: number,
  clientY: number,
  canvas: HTMLCanvasElement
): MappedCoordinates {
  const rect = canvas.getBoundingClientRect();
  const clickX = clientX - rect.left;
  const clickY = clientY - rect.top;

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const x = Math.round(clickX * scaleX);
  const y = Math.round(clickY * scaleY);

  // Clamp coordinates to canvas bounds
  const boundedX = Math.max(0, Math.min(x, CANVAS_WIDTH - 1));
  const boundedY = Math.max(0, Math.min(y, CANVAS_HEIGHT - 1));

  return { x: boundedX, y: boundedY };
}

