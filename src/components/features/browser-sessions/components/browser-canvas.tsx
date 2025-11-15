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
	const { canvasRef, renderFrame } = useBrowserCanvas();
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

	// Setup mouse events
	useBrowserMouseEvents({
		canvasRef,
		sendMessage,
		isStreaming,
	});

	// Setup keyboard events
	useBrowserKeyboardEvents({
		canvasRef,
		sendMessage,
		isStreaming,
	});

	return (
		<div className="w-full h-full flex-1 min-h-0 relative">
			<canvas
				ref={canvasRef}
				id={`browser-canvas-${tabId}`}
				className="w-full h-full border border-border rounded"
				tabIndex={0}
				style={{ outline: 'none' }}
			>
			</canvas>
		</div>
	);
}

