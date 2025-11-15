"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface UseVideoWebSocketReturn {
  status: WebSocketStatus;
  sendMessage: (message: { type: string; [key: string]: unknown }) => void;
  connect: () => void;
  disconnect: () => void;
  isConnected: boolean;
}

export function useVideoWebSocket(): UseVideoWebSocketReturn {
  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectingRef = useRef(false);
  const isMountedRef = useRef(true);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  const getWebSocketUrl = (): string => {
    // Get base URL from environment or default
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:7878/api';
    
    // Convert HTTP URL to WebSocket URL
    // Remove /api suffix if present, and convert http:// to ws:// or https:// to wss://
    let wsUrl = apiUrl.replace(/\/api$/, ''); // Remove /api suffix
    wsUrl = wsUrl.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');
    
    // Append the WebSocket endpoint with trailing slash (as shown in Postman)
    let finalUrl = `${wsUrl}/ws/video/`;
    
    // Add authentication token as query parameter if available
    // WebSocket connections can't set custom headers, so we pass token as query param
    if (typeof window !== 'undefined') {
      try {
        const authStore = localStorage.getItem('auth-store');
        if (authStore) {
          const authData = JSON.parse(authStore);
          if (authData.state?.token) {
            finalUrl += `?token=${encodeURIComponent(authData.state.token)}`;
          }
        }
      } catch (error) {
        console.warn('⚠️ Failed to get auth token for WebSocket:', error);
      }
    }
    
    return finalUrl;
  };

  const connect = useCallback(() => {
    // Don't reconnect if already connected, connecting, or component unmounted
    if (!isMountedRef.current) {
      return;
    }

    if (isConnectingRef.current) {
      console.log('⚠️ Connection already in progress, skipping...');
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('✅ WebSocket already connected');
      return;
    }

    // Clean up any existing connection
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (e) {
        // Ignore errors when closing
      }
      wsRef.current = null;
    }

    try {
      isConnectingRef.current = true;
      setStatus('connecting');
      const wsUrl = getWebSocketUrl();
      console.log('🔌 Attempting WebSocket connection to:', wsUrl.replace(/\?token=.*/, '?token=***'));
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        if (!isMountedRef.current) {
          ws.close();
          return;
        }
        console.log('✅ WebSocket connected successfully');
        isConnectingRef.current = false;
        setStatus('connected');
        reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection
      };

      ws.onmessage = (event) => {
        if (!isMountedRef.current) return;
        console.log('📨 WebSocket message received:', event.data);
        // Handle incoming messages if needed
      };

      ws.onerror = (error) => {
        if (!isMountedRef.current) return;
        console.error('❌ WebSocket error event:', error);
        // Don't set error status here - wait for onclose to determine the actual state
        // The error might be transient and the connection might still succeed
      };

      ws.onclose = (event) => {
        isConnectingRef.current = false;
        
        if (!isMountedRef.current) {
          return;
        }

        const wasNormalClosure = event.code === 1000;
        
        console.log('🔌 WebSocket closed:', {
          code: event.code,
          reason: event.reason || 'No reason provided',
          wasClean: event.wasClean,
        });

        wsRef.current = null;

        // Only attempt to reconnect if:
        // 1. It's not a normal closure (code 1000) - normal closures are intentional disconnects
        // 2. Component is still mounted
        // 3. We haven't exceeded max attempts
        if (!wasNormalClosure && isMountedRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(`🔄 Scheduling reconnect attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts} in ${reconnectDelay}ms...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              connect();
            }
          }, reconnectDelay);
        } else {
          if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            console.error('❌ Max reconnection attempts reached');
            setStatus('error');
          } else {
            setStatus('disconnected');
          }
        }
      };

      wsRef.current = ws;
    } catch (error) {
      isConnectingRef.current = false;
      console.error('❌ Failed to create WebSocket connection:', error);
      if (isMountedRef.current) {
        setStatus('error');
      }
    }
  }, []);

  const sendMessage = useCallback((message: { type: string; [key: string]: unknown }) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        const messageStr = JSON.stringify(message);
        wsRef.current.send(messageStr);
        console.log('📤 WebSocket message sent:', messageStr);
      } catch (error) {
        console.error('❌ Failed to send WebSocket message:', error);
      }
    } else {
      console.warn('⚠️ WebSocket is not connected. Cannot send message:', message);
    }
  }, []);

  const disconnect = useCallback(() => {
    // Clear any pending reconnection attempts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    reconnectAttemptsRef.current = 0; // Reset reconnect attempts
    
    if (wsRef.current) {
      try {
        wsRef.current.close(1000, 'Manual disconnect');
      } catch (e) {
        // Ignore errors when closing
      }
      wsRef.current = null;
    }
    
    isConnectingRef.current = false;
    setStatus('disconnected');
  }, []);

  // Setup mount tracking and cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      isConnectingRef.current = false;
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      if (wsRef.current) {
        try {
          // Close with normal closure code
          wsRef.current.close(1000, 'Component unmounting');
        } catch (e) {
          // Ignore errors when closing
        }
        wsRef.current = null;
      }
    };
  }, []);

  return {
    status,
    sendMessage,
    connect,
    disconnect,
    isConnected: status === 'connected',
  };
}

