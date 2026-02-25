/**
 * Singleton WebSocket Manager for Workflow Execution
 * 
 * Lives completely outside React's render cycle to avoid infinite loop issues.
 * Components interact via:
 * - workflowWsManager.connect(workflowId)
 * - workflowWsManager.disconnect()
 * - workflowWsManager.on(event, callback)
 * - workflowWsManager.off(event, callback)
 */

import { apiConfig } from '@/lib/config/app-config';

// Event types
export type WebSocketEvent = 
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'state_sync'
  | 'node_started'
  | 'node_completed'
  | 'node_failed'
  | 'workflow_completed'
  | 'workflow_failed';

// Event data interfaces
export interface NodeStartedData {
  node_id: string;
  node_type: string;
  started_at: string;
}

export interface NodeCompletedData {
  node_id: string;
  node_type: string;
  duration: number;
  route?: string;
  output_data?: Record<string, unknown>;
}

export interface NodeFailedData {
  node_id: string;
  node_type: string;
  error: string;
}

export interface WorkflowCompletedData {
  status: string;
  duration: number;
}

export interface WorkflowFailedData {
  error: string;
}

export interface StateSyncData {
  workflow_id: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  total_duration_seconds?: number;
  executing_nodes: Record<string, {
    node_id: string;
    node_type: string;
    started_at: string;
    duration_seconds: number;
  }>;
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

export type EventCallback<T = unknown> = (data: T) => void;

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

class WorkflowWebSocketManager {
  private static instance: WorkflowWebSocketManager;
  
  private ws: WebSocket | null = null;
  private workflowId: string | null = null;
  private status: ConnectionStatus = 'disconnected';
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private intentionalDisconnect = false;
  
  private constructor() {
    // Private constructor for singleton
  }
  
  static getInstance(): WorkflowWebSocketManager {
    if (!WorkflowWebSocketManager.instance) {
      WorkflowWebSocketManager.instance = new WorkflowWebSocketManager();
    }
    return WorkflowWebSocketManager.instance;
  }
  
  /**
   * Get current connection status
   */
  getStatus(): ConnectionStatus {
    return this.status;
  }
  
  /**
   * Get current workflow ID
   */
  getWorkflowId(): string | null {
    return this.workflowId;
  }
  
  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.status === 'connected' && this.ws?.readyState === WebSocket.OPEN;
  }
  
  /**
   * Connect to a workflow's WebSocket
   */
  connect(workflowId: string): void {
    // If already connected to the same workflow, do nothing
    if (this.workflowId === workflowId && this.isConnected()) {
      return;
    }
    
    // If connecting to a different workflow, disconnect first
    if (this.workflowId && this.workflowId !== workflowId) {
      this.disconnect();
    }
    
    this.workflowId = workflowId;
    this.intentionalDisconnect = false;
    this.reconnectAttempts = 0;
    
    this.connectInternal();
  }
  
  /**
   * Disconnect from the WebSocket
   */
  disconnect(): void {
    this.intentionalDisconnect = true;
    
    // Clear reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    // Close WebSocket
    if (this.ws) {
      try {
        this.ws.close(1000, 'Manual disconnect');
      } catch (e) {
        // Ignore
      }
      this.ws = null;
    }
    
    this.workflowId = null;
    this.status = 'disconnected';
    this.reconnectAttempts = 0;
    
    this.emit('disconnected', {});
  }
  
  /**
   * Subscribe to an event
   */
  on<T = unknown>(event: WebSocketEvent, callback: EventCallback<T>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback as EventCallback);
  }
  
  /**
   * Unsubscribe from an event
   */
  off<T = unknown>(event: WebSocketEvent, callback: EventCallback<T>): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback as EventCallback);
    }
  }
  
  /**
   * Request current state from server
   */
  requestState(): void {
    if (this.isConnected() && this.ws) {
      this.ws.send(JSON.stringify({ type: 'request_state' }));
    }
  }
  
  /**
   * Internal: Emit an event to all listeners
   */
  private emit(event: string, data: unknown): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch {
          // Silently handle listener errors
        }
      });
    }
  }
  
  /**
   * Internal: Create WebSocket connection
   */
  private connectInternal(): void {
    if (!this.workflowId) return;
    
    // Close existing connection
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {
        // Ignore
      }
      this.ws = null;
    }
    
    this.status = 'connecting';
    
    const wsUrl = this.getWebSocketUrl(this.workflowId);
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        this.status = 'connected';
        this.reconnectAttempts = 0;
        this.emit('connected', { workflowId: this.workflowId });
      };
      
      this.ws.onmessage = (event) => {
        this.handleMessage(event);
      };
      
      this.ws.onerror = () => {
        this.emit('error', { error: 'WebSocket error' });
      };
      
      this.ws.onclose = (event) => {
        this.ws = null;
        
        // Don't reconnect if intentionally disconnected or normal close
        if (this.intentionalDisconnect || event.code === 1000) {
          this.status = 'disconnected';
          return;
        }
        
        // Attempt reconnection
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          
          this.reconnectTimeout = setTimeout(() => {
            if (!this.intentionalDisconnect && this.workflowId) {
              this.connectInternal();
            }
          }, this.reconnectDelay);
        } else {
          this.status = 'error';
          this.emit('error', { error: 'Max reconnect attempts reached' });
        }
      };
    } catch {
      this.status = 'error';
      this.emit('error', { error: 'Failed to create WebSocket' });
    }
  }
  
  /**
   * Internal: Handle incoming WebSocket message
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'state_sync':
          this.emit('state_sync', message.state as StateSyncData);
          break;
          
        case 'node_started':
          this.emit('node_started', {
            node_id: message.node_id,
            node_type: message.node_type,
            started_at: message.started_at,
          } as NodeStartedData);
          break;
          
        case 'node_completed':
          this.emit('node_completed', {
            node_id: message.node_id,
            node_type: message.node_type,
            duration: message.duration,
            route: message.route,
            output_data: message.output_data,
          } as NodeCompletedData);
          break;
          
        case 'node_failed':
          this.emit('node_failed', {
            node_id: message.node_id,
            node_type: message.node_type,
            error: message.error,
          } as NodeFailedData);
          break;
          
        case 'workflow_completed':
          this.emit('workflow_completed', {
            status: message.status,
            duration: message.duration,
          } as WorkflowCompletedData);
          break;
          
        case 'workflow_failed':
          this.emit('workflow_failed', {
            error: message.error,
          } as WorkflowFailedData);
          break;
          
        case 'pong':
          // Heartbeat response, no action needed
          break;
          
        default:
          // Unknown message type - ignore
          break;
      }
    } catch {
      // Failed to parse message - ignore
    }
  }
  
  /**
   * Internal: Get WebSocket URL
   */
  private getWebSocketUrl(workflowId: string): string {
    const origin = apiConfig.apiBaseOrigin;
    const wsUrl = origin.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');
    return `${wsUrl}/ws/workflow/${workflowId}/`;
  }
}

// Export singleton instance
export const workflowWsManager = WorkflowWebSocketManager.getInstance();

// Expose for debugging in development
if (typeof window !== 'undefined') {
  (window as unknown as { workflowWsManager: WorkflowWebSocketManager }).workflowWsManager = workflowWsManager;
}

