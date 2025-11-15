import { useEffect, useRef, useState, useCallback } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT, getWebSocketUrl, getButtonName } from '../constants/streaming';
import { mapCoordinates } from '../utils/coordinate-mapper';

export interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export interface UseBrowserWebSocketReturn {
  isConnected: boolean;
  isStreaming: boolean;
  status: string;
  activePageIds: Set<string>;
  currentPageId: string | null;
  currentUrl: string;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: WebSocketMessage) => void;
  sendMouseEvent: (type: string, event: MouseEvent) => void;
  sendKeyboardEvent: (type: string, event: KeyboardEvent) => void;
  sendNavigate: (action: 'back' | 'forward' | 'refresh' | 'goto', url?: string) => void;
  sendPageSwitch: (pageId: string) => void;
  sendNewTab: () => void;
  sendCloseTab: (pageId: string) => void;
}

export function useBrowserWebSocket(): UseBrowserWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [status, setStatus] = useState<string>('Disconnected');
  const [activePageIds, setActivePageIds] = useState<Set<string>>(new Set());
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousemoveThrottleRef = useRef<NodeJS.Timeout | null>(null);

  const handleBinaryFrame = useCallback((binaryData: Blob | ArrayBuffer) => {
    if (!canvasRef.current) return;

    const blob = binaryData instanceof Blob 
      ? binaryData 
      : new Blob([binaryData], { type: 'image/jpeg' });
    
    const imageUrl = URL.createObjectURL(blob);
    const img = new Image();
    const ctx = canvasRef.current.getContext('2d');
    
    if (!ctx) {
      URL.revokeObjectURL(imageUrl);
      return;
    }

    img.onload = () => {
      ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      URL.revokeObjectURL(imageUrl);
    };
    
    img.onerror = () => {
      console.error('Error loading frame image');
      URL.revokeObjectURL(imageUrl);
    };
    
    img.src = imageUrl;
  }, []);

  const handleControlMessage = useCallback((data: WebSocketMessage) => {
    switch (data.type) {
      case 'error':
        setStatus(`Error: ${data.message}`);
        setIsStreaming(false);
        break;
      case 'page_added':
        if (data.page_id) {
          setActivePageIds(prev => new Set([...prev, data.page_id]));
        }
        break;
      case 'page_removed':
        if (data.page_id) {
          setActivePageIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.page_id);
            return newSet;
          });
          // If removed page was current, clear current page
          if (currentPageId === data.page_id) {
            setCurrentPageId(null);
          }
        }
        break;
      case 'pages_sync':
        if (data.page_ids && Array.isArray(data.page_ids)) {
          setActivePageIds(new Set(data.page_ids));
        }
        break;
      case 'page_switched':
        if (data.page_id) {
          setCurrentPageId(data.page_id);
        }
        if (data.url) {
          setCurrentUrl(data.url);
        }
        break;
      case 'url_changed':
        if (data.url) {
          setCurrentUrl(data.url);
        }
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }, [currentPageId]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = getWebSocketUrl();
    const ws = new WebSocket(wsUrl);
    ws.binaryType = 'blob';

    ws.onopen = () => {
      setIsConnected(true);
      setStatus('Connected');
      ws.send(JSON.stringify({ type: 'start' }));
      setIsStreaming(true);
      if (canvasRef.current) {
        canvasRef.current.focus();
      }
    };

    ws.onmessage = (event) => {
      if (event.data instanceof Blob || event.data instanceof ArrayBuffer) {
        handleBinaryFrame(event.data);
      } else {
        try {
          const data = JSON.parse(event.data);
          handleControlMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setStatus('WebSocket error');
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsStreaming(false);
      setStatus('Disconnected');
      setActivePageIds(new Set());
      setCurrentPageId(null);
    };

    wsRef.current = ws;
  }, [handleBinaryFrame, handleControlMessage]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsStreaming(false);
    setStatus('Disconnected');
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const sendMouseEvent = useCallback((type: string, event: MouseEvent) => {
    if (!isStreaming || !canvasRef.current) return;

    const coords = mapCoordinates(event.clientX, event.clientY, canvasRef.current);
    const message: WebSocketMessage = {
      type,
      x: coords.x,
      y: coords.y,
    };

    if (event.button !== undefined) {
      message.button = getButtonName(event.button);
    }

    if (type === 'wheel') {
      message.deltaX = event.deltaX || 0;
      message.deltaY = event.deltaY || 0;
      message.deltaZ = event.deltaZ || 0;
    }

    sendMessage(message);
  }, [isStreaming, sendMessage]);

  const sendKeyboardEvent = useCallback((type: string, event: KeyboardEvent) => {
    if (!isStreaming) return;

    const message: WebSocketMessage = {
      type,
      key: event.key,
      code: event.code,
      ctrlKey: event.ctrlKey || false,
      altKey: event.altKey || false,
      shiftKey: event.shiftKey || false,
      metaKey: event.metaKey || false,
    };

    if (type === 'keydown') {
      message.repeat = event.repeat || false;
    }

    sendMessage(message);
  }, [isStreaming, sendMessage]);

  const sendNavigate = useCallback((action: 'back' | 'forward' | 'refresh' | 'goto', url?: string) => {
    const message: WebSocketMessage = {
      type: 'navigate',
      action,
    };
    if (url) {
      message.url = url;
    }
    sendMessage(message);
  }, [sendMessage]);

  const sendPageSwitch = useCallback((pageId: string) => {
    sendMessage({ type: 'page_switch', page_id: pageId });
  }, [sendMessage]);

  const sendNewTab = useCallback(() => {
    sendMessage({ type: 'new_tab' });
  }, [sendMessage]);

  const sendCloseTab = useCallback((pageId: string) => {
    sendMessage({ type: 'close_tab', page_id: pageId });
  }, [sendMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
      if (mousemoveThrottleRef.current) {
        clearTimeout(mousemoveThrottleRef.current);
      }
    };
  }, [disconnect]);

  return {
    isConnected,
    isStreaming,
    status,
    activePageIds,
    currentPageId,
    currentUrl,
    canvasRef,
    connect,
    disconnect,
    sendMessage,
    sendMouseEvent,
    sendKeyboardEvent,
    sendNavigate,
    sendPageSwitch,
    sendNewTab,
    sendCloseTab,
  };
}

