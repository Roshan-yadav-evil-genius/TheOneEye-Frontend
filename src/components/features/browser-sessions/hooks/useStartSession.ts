import { useEffect, useRef, useCallback } from "react";
import { useVideoWebSocket } from "@/hooks/useVideoWebSocket";

/**
 * Hook to manage the start session flow.
 * Handles WebSocket connection and sending start message.
 * Single responsibility: Start session logic only.
 */
export function useStartSession() {
	const { status: webSocketStatus, sendMessage, connect, isConnected } = useVideoWebSocket();
	const pendingStartMessageRef = useRef(false);

	// Watch for connection and send pending start message when connected
	useEffect(() => {
		if (isConnected && pendingStartMessageRef.current) {
			sendMessage({ type: "start" });
			pendingStartMessageRef.current = false;
		}
	}, [isConnected, sendMessage]);

	/**
	 * Handles the start session action.
	 * If not connected, connects first and queues the start message.
	 * If already connected, sends the start message immediately.
	 */
	const handleStartSession = useCallback(() => {
		// If not connected, connect first and mark that we need to send start message
		if (!isConnected && webSocketStatus !== 'connecting') {
			pendingStartMessageRef.current = true;
			connect();
		} else if (isConnected) {
			// Already connected, just send the start message
			sendMessage({ type: "start" });
		}
		// If connecting, do nothing (button should be disabled)
	}, [isConnected, webSocketStatus, connect, sendMessage]);

	return {
		handleStartSession,
		isWebSocketConnected: isConnected,
		webSocketStatus,
	};
}

