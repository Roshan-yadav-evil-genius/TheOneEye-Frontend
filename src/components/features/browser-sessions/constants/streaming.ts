// Browser streaming constants

export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;
export const MOUSEMOVE_THROTTLE_MS = 16; // ~60fps for mouse movement

/**
 * Get WebSocket URL for video streaming
 */
export function getWebSocketUrl(): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws/video/`;
}

/**
 * Map mouse button number to button name
 */
export function getButtonName(button: number): 'left' | 'middle' | 'right' {
  const buttonMap: Record<number, 'left' | 'middle' | 'right'> = {
    0: 'left',
    1: 'middle',
    2: 'right',
  };
  return buttonMap[button] || 'left';
}

