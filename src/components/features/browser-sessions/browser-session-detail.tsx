"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TBrowserSession } from "@/types/browser-session";
import { useBrowserTabs } from "./hooks/useBrowserTabs";
import { useStartSession } from "./hooks/useStartSession";
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
	const {
		tabs,
		activeTabId,
		currentUrl,
		setCurrentUrl,
		handleTabClick,
		handleCloseTab,
		handleAddTab,
	} = useBrowserTabs();

	// Start session logic (handles WebSocket connection and start message)
	const {
		handleStartSession,
		isWebSocketConnected,
		webSocketStatus,
	} = useStartSession();

	const handleGoBack = () => {
		// Browser navigation logic here
		console.log("Go back");
	};

	const handleGoForward = () => {
		// Browser navigation logic here
		console.log("Go forward");
	};

	const handleRefresh = () => {
		// Browser refresh logic here
		console.log("Refresh");
	};

	const handleGoHome = () => {
		// Navigate to home page
		setCurrentUrl("https://www.google.com");
	};

	return (
		<div className="">
			{/* Browser Session Details */}
				<BrowserSessionInfo
					session={session}
					onSave={onSave}
					onStartSession={handleStartSession}
					isWebSocketConnected={isWebSocketConnected}
					webSocketStatus={webSocketStatus}
				/>

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
					/>

					{/* Browser Content Area */}
					{tabs.map((tab) => (
						<TabsContent
							key={tab.id}
							value={tab.id}
							className="p-1 bg-background flex-1 min-h-0 flex flex-col"
						>
							<BrowserCanvas tabId={tab.id} />
						</TabsContent>
					))}
				</Tabs>
			</Card>
		</div>
	);
}
