"use client";

interface BrowserCanvasProps {
	tabId: string;
}

export function BrowserCanvas({ tabId }: BrowserCanvasProps) {
	return (
		<div className="w-full h-full flex-1 min-h-0 relative">
			<canvas
				id={`browser-canvas-${tabId}`}
				className="w-full h-full border border-border rounded"
			>
			</canvas>
		</div>
	);
}

