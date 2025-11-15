"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TBrowserSession } from "@/types/browser-session";
import { useStartSession } from "./hooks/useStartSession";
import { useVideoWebSocket } from "@/hooks/useVideoWebSocket";
import { useBrowserPages } from "./hooks/useBrowserPages";
import { useBrowserNavigation } from "./hooks/useBrowserNavigation";
import { BrowserTabBar } from "./components/browser-tab-bar";
import { BrowserAddressBar } from "./components/browser-address-bar";
import { BrowserCanvas } from "./components/browser-canvas";
import { BrowserSessionInfo } from "./components/browser-session-info";

interface BrowserSessionDetailProps {
	session: TBrowserSession;
	onSave?: (session: TBrowserSession) => void;
}

export function BrowserSessionDetail({
	session,
	onSave,
}: BrowserSessionDetailProps) {
	// WebSocket connection
	const {
		status: webSocketStatus,
		sendMessage,
		connect,
		isConnected,
		setOnBinaryFrame,
		setOnControlMessage,
	} = useVideoWebSocket();

	// Start session logic (handles WebSocket connection and start message)
	const {
		handleStartSession,
		isWebSocketConnected,
		webSocketStatus: startSessionStatus,
	} = useStartSession({
		sendMessage,
		connect,
		isConnected,
		webSocketStatus,
	});

	// Create refs to store handlers from hooks
	const pagesHandlerRef = useRef<((data: Record<string, unknown>) => void) | null>(null);
	const navigationHandlerRef = useRef<((data: Record<string, unknown>) => void) | null>(null);

	// Wrapper to set pages handler
	const setPagesHandler = (handler: (data: Record<string, unknown>) => void) => {
		pagesHandlerRef.current = handler;
	};

	// Wrapper to set navigation handler
	const setNavigationHandler = (handler: (data: Record<string, unknown>) => void) => {
		navigationHandlerRef.current = handler;
	};

	// Register combined handler with WebSocket
	useEffect(() => {
		const combinedHandler = (data: Record<string, unknown>) => {
			if (pagesHandlerRef.current) {
				pagesHandlerRef.current(data);
			}
			if (navigationHandlerRef.current) {
				navigationHandlerRef.current(data);
			}
		};
		setOnControlMessage(combinedHandler);
	}, [setOnControlMessage]);

	// Browser pages/tabs management from backend
	const {
		activePageIds,
		currentPageId,
		handlePageSwitch,
		handleCloseTab,
		handleNewTab,
	} = useBrowserPages({
		setOnControlMessage: setPagesHandler,
		sendMessage,
		isStreaming: isConnected,
	});

	// Browser navigation
	const {
		currentUrl,
		handleGoBack,
		handleGoForward,
		handleRefresh,
		handleGoToUrl,
	} = useBrowserNavigation({
		setOnControlMessage: setNavigationHandler,
		sendMessage,
		isStreaming: isConnected,
	});

	// Auto-focus canvas when streaming starts
	useEffect(() => {
		if (isConnected) {
			// Focus will be handled by canvas component
		}
	}, [isConnected]);

	const handleGoHome = () => {
		// Navigate to home page
		handleGoToUrl("https://duckduckgo.com/");
	};

	return (
		<>
			{/* Browser Session Details */}
			<BrowserSessionInfo
				session={session}
				onSave={onSave}
				onStartSession={handleStartSession}
				isWebSocketConnected={isWebSocketConnected || isConnected}
				webSocketStatus={startSessionStatus || webSocketStatus}
			/>

			{/* Browser-Style Tabs Section */}
			<div id="browser-session-detail" className="bg-gray-900 rounded-lg w-full gap-0 border-2 flex flex-col flex-1">
				{/* Browser Tab Bar */}
				<BrowserTabBar
					activePageIds={activePageIds}
					currentPageId={currentPageId}
					onPageSwitch={handlePageSwitch}
					onPageClose={handleCloseTab}
					onNewTab={handleNewTab}
				/>

				{/* Browser Address Bar */}
				<BrowserAddressBar
					currentUrl={currentUrl}
					onGoBack={handleGoBack}
					onGoForward={handleGoForward}
					onGoHome={handleGoHome}
					onRefresh={handleRefresh}
					onGoToUrl={handleGoToUrl}
				/>

				{/* Browser Content Area */}
				<div className="p-1 bg-background flex-1 min-h-0 flex flex-col">
					{currentPageId && (
						<BrowserCanvas
							tabId={currentPageId}
							sendMessage={sendMessage}
							isStreaming={isConnected}
							setOnBinaryFrame={setOnBinaryFrame}
						/>
					)}
					{!currentPageId && activePageIds.length === 0 && (
						<div className="flex items-center justify-center h-full text-muted-foreground">
							No active page. Click "Start Session" to begin.
						</div>
					)}
				</div>
			</div>

		</>
	);
}
