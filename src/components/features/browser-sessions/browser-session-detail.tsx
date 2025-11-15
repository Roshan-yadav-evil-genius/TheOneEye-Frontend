"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TBrowserSession } from "@/types/browser-session";
import { useBrowserWebSocket } from "./hooks/useBrowserWebSocket";
import { useBrowserTabs } from "./hooks/useBrowserTabs";
import { BrowserTabBar } from "./components/browser-tab-bar";
import { BrowserAddressBar } from "./components/browser-address-bar";
import { BrowserCanvas } from "./components/browser-canvas";
import { BrowserSessionInfo } from "./components/browser-session-info";
import { IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react";

interface BrowserSessionDetailProps {
	session: TBrowserSession;
	onSave?: (session: TBrowserSession) => void;
}

export function BrowserSessionDetail({
	session,
	onSave,
}: BrowserSessionDetailProps) {
	const websocket = useBrowserWebSocket();
	const {
		tabs,
		activeTabId,
		currentUrl,
		setCurrentUrl,
		handleTabClick,
		handleCloseTab,
		handleAddTab,
	} = useBrowserTabs(websocket);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			websocket.disconnect();
		};
	}, [websocket]);

	const handleGoBack = () => {
		if (websocket.isStreaming) {
			websocket.sendNavigate('back');
		}
	};

	const handleGoForward = () => {
		if (websocket.isStreaming) {
			websocket.sendNavigate('forward');
		}
	};

	const handleRefresh = () => {
		if (websocket.isStreaming) {
			websocket.sendNavigate('refresh');
		}
	};

	const handleGoHome = () => {
		if (websocket.isStreaming) {
			websocket.sendNavigate('goto', 'https://duckduckgo.com/');
		}
	};

	const handleNavigate = (url: string) => {
		if (websocket.isStreaming) {
			websocket.sendNavigate('goto', url);
		}
	};

	const handleStartStreaming = () => {
		if (!websocket.isConnected) {
			websocket.connect();
		}
	};

	const handleStopStreaming = () => {
		websocket.disconnect();
	};

	return (
		<div className="">
			{/* Browser Session Details */}
			<div className="flex items-center justify-between mb-2">
				<BrowserSessionInfo
					session={session}
					onSave={onSave}
				/>
				<div className="flex items-center gap-2">
					{/* Connection Status */}
					<div className="text-sm text-muted-foreground">
						Status: {websocket.status}
					</div>
					{/* Start/Stop Streaming Button */}
					{!websocket.isStreaming ? (
						<Button
							onClick={handleStartStreaming}
							size="sm"
							className="gap-2"
						>
							<IconPlayerPlay className="h-4 w-4" />
							Start Streaming
						</Button>
					) : (
						<Button
							onClick={handleStopStreaming}
							size="sm"
							variant="destructive"
							className="gap-2"
						>
							<IconPlayerStop className="h-4 w-4" />
							Stop Streaming
						</Button>
					)}
				</div>
			</div>

			{/* Browser-Style Tabs Section */}
			<Card className="p-0 overflow-hidden rounded-lg flex flex-col h-[calc(100vh-12rem)]">
				<Tabs value={activeTabId} onValueChange={handleTabClick} className="w-full gap-0 flex flex-col flex-1 min-h-0">
					{/* Browser Tab Bar */}
					<BrowserTabBar
						tabs={tabs}
						activeTabId={activeTabId}
						onTabClick={handleTabClick}
						onTabClose={handleCloseTab}
						onAddTab={handleAddTab}
					/>

					{/* Browser Address Bar */}
					<BrowserAddressBar
						currentUrl={currentUrl}
						onGoBack={handleGoBack}
						onGoForward={handleGoForward}
						onGoHome={handleGoHome}
						onRefresh={handleRefresh}
						onNavigate={handleNavigate}
						isStreaming={websocket.isStreaming}
					/>

					{/* Browser Content Area */}
					{tabs.length > 0 ? (
						tabs.map((tab) => (
							<TabsContent
								key={tab.id}
								value={tab.id}
								className="p-1 bg-background flex-1 min-h-0 flex flex-col"
							>
								<BrowserCanvas tabId={tab.id} websocket={websocket} />
							</TabsContent>
						))
					) : (
						<div className="flex-1 flex items-center justify-center text-muted-foreground">
							{websocket.isStreaming ? "Waiting for pages..." : "Start streaming to begin"}
						</div>
					)}
				</Tabs>
			</Card>
		</div>
	);
}
