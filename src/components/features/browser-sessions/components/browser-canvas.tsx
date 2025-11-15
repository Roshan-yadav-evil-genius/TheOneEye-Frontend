"use client";

import { useEffect, useRef } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT, MOUSEMOVE_THROTTLE_MS } from '../constants/streaming';
import { UseBrowserWebSocketReturn } from '../hooks/useBrowserWebSocket';

interface BrowserCanvasProps {
	tabId: string;
	websocket: UseBrowserWebSocketReturn;
}

export function BrowserCanvas({ tabId, websocket }: BrowserCanvasProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const mousemoveThrottleRef = useRef<NodeJS.Timeout | null>(null);

	// Set canvas dimensions
	useEffect(() => {
		if (websocket.canvasRef.current) {
			websocket.canvasRef.current.width = CANVAS_WIDTH;
			websocket.canvasRef.current.height = CANVAS_HEIGHT;
		}
	}, [websocket.canvasRef]);

	// Scale canvas to fit viewport while maintaining aspect ratio
	const scaleCanvas = () => {
		if (!containerRef.current || !websocket.canvasRef.current) return;

		const container = containerRef.current;
		const canvas = websocket.canvasRef.current;
		
		// Get available space (accounting for toolbar/tabs if needed)
		const maxWidth = container.clientWidth;
		const maxHeight = container.clientHeight;

		const aspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
		let displayWidth = maxWidth;
		let displayHeight = displayWidth / aspectRatio;

		if (displayHeight > maxHeight) {
			displayHeight = maxHeight;
			displayWidth = displayHeight * aspectRatio;
		}

		canvas.style.width = displayWidth + 'px';
		canvas.style.height = displayHeight + 'px';
	};

	// Scale on mount and resize
	useEffect(() => {
		scaleCanvas();
		window.addEventListener('resize', scaleCanvas);
		return () => window.removeEventListener('resize', scaleCanvas);
	}, []);

	// Auto-focus canvas when streaming starts
	useEffect(() => {
		if (websocket.isStreaming && websocket.canvasRef.current) {
			websocket.canvasRef.current.focus();
		}
	}, [websocket.isStreaming]);

	// Mouse event handlers
	const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
		if (!websocket.isStreaming) return;

		// Throttle mousemove events
		if (mousemoveThrottleRef.current) {
			clearTimeout(mousemoveThrottleRef.current);
		}

		mousemoveThrottleRef.current = setTimeout(() => {
			websocket.sendMouseEvent('mousemove', event.nativeEvent);
		}, MOUSEMOVE_THROTTLE_MS);
	};

	const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
		websocket.sendMouseEvent('mousedown', event.nativeEvent);
	};

	const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
		websocket.sendMouseEvent('mouseup', event.nativeEvent);
	};

	const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
		event.preventDefault(); // Prevent page scroll
		websocket.sendMouseEvent('wheel', event.nativeEvent);
	};

	const handleContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
		event.preventDefault(); // Prevent context menu
	};

	const handleMouseLeave = () => {
		// Clear any pending mousemove events
		if (mousemoveThrottleRef.current) {
			clearTimeout(mousemoveThrottleRef.current);
			mousemoveThrottleRef.current = null;
		}
	};

	// Keyboard event handlers
	const handleKeyDown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
		// Prevent common browser shortcuts
		if (event.ctrlKey || event.metaKey) {
			const key = event.key.toLowerCase();
			// Prevent Ctrl+R (refresh), Ctrl+W (close), Ctrl+N (new window), Ctrl+T (new tab)
			if (key === 'r' || key === 'w' || key === 'n' || key === 't') {
				event.preventDefault();
				event.stopPropagation();
			}
		}

		// Prevent default browser behavior for all keys when canvas is focused
		event.preventDefault();
		event.stopPropagation();

		websocket.sendKeyboardEvent('keydown', event.nativeEvent);
	};

	const handleKeyUp = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
		// Prevent default browser behavior for all keys when canvas is focused
		event.preventDefault();
		event.stopPropagation();

		websocket.sendKeyboardEvent('keyup', event.nativeEvent);
	};

	return (
		<div ref={containerRef} className="w-full h-full flex-1 min-h-0 relative">
			<canvas
				ref={websocket.canvasRef}
				id={`browser-canvas-${tabId}`}
				className="w-full h-full border border-border rounded"
				tabIndex={0}
				onMouseMove={handleMouseMove}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onWheel={handleWheel}
				onContextMenu={handleContextMenu}
				onMouseLeave={handleMouseLeave}
				onKeyDown={handleKeyDown}
				onKeyUp={handleKeyUp}
			>
			</canvas>
		</div>
	);
}

