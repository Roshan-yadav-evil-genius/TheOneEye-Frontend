"use client";

import { useEffect, useRef } from "react";
import { useBrowserCanvas } from "../hooks/useBrowserCanvas";
import { useBrowserMouseEvents } from "../hooks/useBrowserMouseEvents";
import { useBrowserKeyboardEvents } from "../hooks/useBrowserKeyboardEvents";

interface BrowserCanvasProps {
	tabId: string;
	sendMessage: (message: { type: string; [key: string]: unknown }) => void;
	isStreaming: boolean;
	setOnBinaryFrame: (callback: (data: Blob | ArrayBuffer) => void) => void;
}

export function BrowserCanvas({ 
	tabId, 
	sendMessage, 
	isStreaming,
	setOnBinaryFrame,
}: BrowserCanvasProps) {
	const { canvasRef, renderFrame, viewportWidth, viewportHeight } = useBrowserCanvas();
	const renderFrameRef = useRef(renderFrame);

	// Update ref when renderFrame changes
	useEffect(() => {
		renderFrameRef.current = renderFrame;
	}, [renderFrame]);

	// Setup binary frame handler
	useEffect(() => {
		setOnBinaryFrame((data: Blob | ArrayBuffer) => {
			renderFrameRef.current(data);
		});
	}, [setOnBinaryFrame]);

	// Setup mouse events with dynamic viewport dimensions
	useBrowserMouseEvents({
		canvasRef,
		sendMessage,
		isStreaming,
		viewportWidth,
		viewportHeight,
	});

	// Setup keyboard events
	useBrowserKeyboardEvents({
		canvasRef,
		sendMessage,
		isStreaming,
	});

	return (
		<div className="w-full h-full flex-1 min-h-0 relative overflow-hidden flex items-center justify-center">
			<canvas
				ref={canvasRef}
				id={`browser-canvas-${tabId}`}
				className="border border-border rounded"
				tabIndex={0}
				style={{ outline: 'none', display: 'block' }}
			>
			</canvas>
		</div>
	);
}
