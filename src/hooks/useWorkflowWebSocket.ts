"use client";

/**
 * WebSocket hook for real-time workflow execution updates.
 * 
 * Handles:
 * - Connection management with auto-reconnect
 * - State sync on connect
 * - Real-time node execution events
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useWorkflowExecutionStore } from '@/stores/workflow/workflow-execution-store';

type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

// Event types from the server
export interface NodeExecutionInfo {
  node_id: string;
  node_type: string;
  started_at: string;
  duration_seconds: number;
}

export interface WorkflowState {
  workflow_id: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  total_duration_seconds?: number;
  executing_nodes: Record<string, NodeExecutionInfo>;
  completed_nodes: Array<{
    node_id: string;
    node_type: string;
    completed_at: string;
    duration_seconds: number;
    route?: string;
  }>;
  completed_count: number;
  total_nodes: number;
  error?: string;
}

interface WorkflowWebSocketMessage {
  type: string;
  state?: WorkflowState;
  node_id?: string;
  node_type?: string;
  started_at?: string;
  duration?: number;
  route?: string;
  output_data?: Record<string, unknown>;
  error?: string;
  status?: string;
}

interface UseWorkflowWebSocketOptions {
  workflowId: string | null;
  autoConnect?: boolean;
  onNodeStarted?: (nodeId: string, nodeType: string) => void;
  onNodeCompleted?: (nodeId: string, route?: string, duration?: number) => void;
  onNodeFailed?: (nodeId: string, error: string) => void;
  onWorkflowCompleted?: (status: string, duration: number) => void;
  onWorkflowFailed?: (error: string) => void;
}

interface UseWorkflowWebSocketReturn {
  status: WebSocketStatus;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  requestState: () => void;
  currentState: WorkflowState | null;
}

export function useWorkflowWebSocket(
  options: UseWorkflowWebSocketOptions
): UseWorkflowWebSocketReturn {
  const {
    workflowId,
    autoConnect = true,
    onNodeStarted,
    onNodeCompleted,
    onNodeFailed,
    onWorkflowCompleted,
    onWorkflowFailed,
  } = options;

  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [currentState, setCurrentState] = useState<WorkflowState | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isMountedRef = useRef(true);
  const isConnectingRef = useRef(false);
  
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  // Store actions
  const { 
    setExecutingNodes, 
    addExecutingNode, 
    removeExecutingNode,
    setStatus: setStoreStatus,
  } = useWorkflowExecutionStore();

  const getWebSocketUrl = useCallback((): string => {
    if (!workflowId) return '';
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:7878/api';
    let wsUrl = apiUrl.replace(/\/api$/, '');
    wsUrl = wsUrl.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');
    
    return `${wsUrl}/ws/workflow/${workflowId}/`;
  }, [workflowId]);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (!isMountedRef.current) return;

    try {
      const message: WorkflowWebSocketMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case 'state_sync':
          // Full state sync on connect
          if (message.state) {
            setCurrentState(message.state);
            
            // Update store with executing nodes
            const executingNodes = new Map<string, NodeExecutionInfo>();
            Object.entries(message.state.executing_nodes).forEach(([nodeId, info]) => {
              executingNodes.set(nodeId, info);
            });
            setExecutingNodes(executingNodes);
            
            // Update workflow status
            if (message.state.status === 'running') {
              setStoreStatus('running');
            } else if (message.state.status === 'completed') {
              setStoreStatus('completed');
            } else if (message.state.status === 'failed') {
              setStoreStatus('failed');
            }
          }
          break;
          
        case 'node_started':
          if (message.node_id && message.node_type) {
            addExecutingNode(message.node_id, {
              node_id: message.node_id,
              node_type: message.node_type,
              started_at: message.started_at || new Date().toISOString(),
              duration_seconds: 0,
            });
            onNodeStarted?.(message.node_id, message.node_type);
          }
          break;
          
        case 'node_completed':
          if (message.node_id) {
            removeExecutingNode(message.node_id);
            onNodeCompleted?.(message.node_id, message.route, message.duration);
          }
          break;
          
        case 'node_failed':
          if (message.node_id) {
            removeExecutingNode(message.node_id);
            onNodeFailed?.(message.node_id, message.error || 'Unknown error');
          }
          break;
          
        case 'workflow_completed':
          setStoreStatus('completed');
          onWorkflowCompleted?.(message.status || 'success', message.duration || 0);
          break;
          
        case 'workflow_failed':
          setStoreStatus('failed');
          onWorkflowFailed?.(message.error || 'Unknown error');
          break;
          
        case 'pong':
          // Heartbeat response
          break;
          
        default:
          console.log('Unknown WebSocket message type:', message.type);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }, [
    onNodeStarted, 
    onNodeCompleted, 
    onNodeFailed, 
    onWorkflowCompleted, 
    onWorkflowFailed,
    setExecutingNodes,
    addExecutingNode,
    removeExecutingNode,
    setStoreStatus,
  ]);

  const connect = useCallback(() => {
    if (!workflowId || !isMountedRef.current) return;
    if (isConnectingRef.current) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    // Clean up existing connection
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (e) {
        // Ignore
      }
      wsRef.current = null;
    }

    try {
      isConnectingRef.current = true;
      setStatus('connecting');
      
      const wsUrl = getWebSocketUrl();
      console.log('🔌 Connecting to workflow WebSocket:', wsUrl);
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        if (!isMountedRef.current) {
          ws.close();
          return;
        }
        console.log('✅ Workflow WebSocket connected');
        isConnectingRef.current = false;
        setStatus('connected');
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = handleMessage;

      ws.onerror = (error) => {
        console.error('❌ Workflow WebSocket error:', error);
      };

      ws.onclose = (event) => {
        isConnectingRef.current = false;
        
        if (!isMountedRef.current) return;

        console.log('🔌 Workflow WebSocket closed:', {
          code: event.code,
          reason: event.reason,
        });

        wsRef.current = null;

        // Reconnect logic
        if (event.code !== 1000 && isMountedRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(`🔄 Reconnecting (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              connect();
            }
          }, reconnectDelay);
        } else {
          if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            setStatus('error');
          } else {
            setStatus('disconnected');
          }
        }
      };

      wsRef.current = ws;
    } catch (error) {
      isConnectingRef.current = false;
      console.error('❌ Failed to create WebSocket:', error);
      setStatus('error');
    }
  }, [workflowId, getWebSocketUrl, handleMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    reconnectAttemptsRef.current = 0;
    
    if (wsRef.current) {
      try {
        wsRef.current.close(1000, 'Manual disconnect');
      } catch (e) {
        // Ignore
      }
      wsRef.current = null;
    }
    
    isConnectingRef.current = false;
    setStatus('disconnected');
  }, []);

  const requestState = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'request_state' }));
    }
  }, []);

  // Auto-connect when workflowId changes
  useEffect(() => {
    if (autoConnect && workflowId) {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [workflowId, autoConnect, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (wsRef.current) {
        try {
          wsRef.current.close(1000, 'Component unmounting');
        } catch (e) {
          // Ignore
        }
      }
    };
  }, []);

  return {
    status,
    isConnected: status === 'connected',
    connect,
    disconnect,
    requestState,
    currentState,
  };
}

