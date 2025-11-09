"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
	IconBrowser,
	IconX,
	IconRefresh,
	IconArrowLeft,
	IconArrowRight,
	IconHome,
	IconPlus
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface BrowserTab {
	id: string;
	title: string;
	url: string;
}

// Dummy data for browser tabs
const DUMMY_TABS: BrowserTab[] = [
	{ id: "1", title: "Google", url: "https://www.google.com" },
	{ id: "2", title: "GitHub", url: "https://www.github.com" },
	{ id: "3", title: "Stack Overflow", url: "https://stackoverflow.com" },
];

export function BrowserSessionDetail() {
	const [tabs, setTabs] = useState<BrowserTab[]>(DUMMY_TABS);
	const [activeTabId, setActiveTabId] = useState<string>(DUMMY_TABS[0]?.id || "");
	const [currentUrl, setCurrentUrl] = useState<string>(DUMMY_TABS[0]?.url || "");

	// Update current URL when active tab changes
	useEffect(() => {
		const activeTab = tabs.find(tab => tab.id === activeTabId);
		if (activeTab) {
			setCurrentUrl(activeTab.url);
		}
	}, [activeTabId, tabs]);

	const handleTabClick = (tabId: string) => {
		setActiveTabId(tabId);
	};

	const handleCloseTab = (tabId: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (tabs.length <= 1) return; // Don't close the last tab

		const newTabs = tabs.filter(tab => tab.id !== tabId);
		setTabs(newTabs);

		// If closed tab was active, switch to another tab
		if (activeTabId === tabId) {
			const newActiveTab = newTabs[0];
			if (newActiveTab) {
				setActiveTabId(newActiveTab.id);
			}
		}
	};

	const handleAddTab = () => {
		const newTab: BrowserTab = {
			id: Date.now().toString(),
			title: "New Tab",
			url: "https://www.example.com"
		};
		setTabs([...tabs, newTab]);
		setActiveTabId(newTab.id);
	};

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
		const homeTab = tabs.find(tab => tab.id === activeTabId);
		if (homeTab) {
			setCurrentUrl("https://www.google.com");
		}
	};

	const getTabTitle = (url: string) => {
		try {
			const urlObj = new URL(url);
			return urlObj.hostname.replace('www.', '');
		} catch {
			return url.length > 20 ? url.substring(0, 20) + "..." : url;
		}
	};

	return (
		<div className="space-y-6 pt-5">
			{/* Browser-Style Tabs Section */}
			<Card className="p-0 overflow-hidden rounded-lg flex flex-col h-[calc(100vh-12rem)]">
				<Tabs value={activeTabId} onValueChange={setActiveTabId} className="w-full gap-0 flex flex-col flex-1 min-h-0">
					{/* Browser Tab Bar */}
					<div className="flex items-end gap-0.5 px-1 pt-1 border-b border-border bg-muted/30">
						{/* Dynamic Browser Tabs */}
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => handleTabClick(tab.id)}
								className={cn(
									"group relative flex items-center gap-2 px-4 py-2 rounded-t-lg border border-b-0 transition-all",
									activeTabId === tab.id
										? "bg-muted/30 border-border shadow-[0_-2px_8px_rgba(0,0,0,0.1)] z-10"
										: "bg-background border-transparent hover:border-border/50"
								)}
							>
								<IconBrowser className="h-4 w-4 shrink-0" />
								<span className="text-sm font-medium whitespace-nowrap max-w-[150px] truncate">
									{getTabTitle(tab.url)}
								</span>
								{activeTabId === tab.id && (
									<span
										role="button"
										tabIndex={0}
										onClick={(e) => handleCloseTab(tab.id, e)}
										onKeyDown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.stopPropagation();
												handleCloseTab(tab.id, e as any);
											}
										}}
										className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 rounded p-0.5 transition-opacity cursor-pointer"
										title="Close tab"
									>
										<IconX className="h-3 w-3" />
									</span>
								)}
							</button>
						))}

						{/* Add New Tab Button */}
						<button
							onClick={handleAddTab}
							className="px-3 py-2 rounded-t-lg border border-transparent hover:border-border/50 hover:bg-background/80 transition-all"
							title="New tab"
						>
							<IconPlus className="h-4 w-4" />
						</button>
					</div>

					{/* Browser Address Bar */}
					<div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
						{/* Navigation Controls */}
						<div className="flex items-center gap-0.5">
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 hover:bg-muted"
								title="Go back"
								onClick={handleGoBack}
							>
								<IconArrowLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 hover:bg-muted"
								title="Go forward"
								onClick={handleGoForward}
							>
								<IconArrowRight className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 hover:bg-muted"
								title="Home"
								onClick={handleGoHome}
							>
								<IconHome className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 hover:bg-muted"
								title="Refresh"
								onClick={handleRefresh}
							>
								<IconRefresh className="h-4 w-4" />
							</Button>
						</div>

						{/* Address Bar */}
						<div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-md bg-background border border-border/50 hover:border-border transition-colors">
							<IconBrowser className="h-4 w-4 text-muted-foreground shrink-0" />
							<span className="flex-1 text-sm text-foreground font-mono truncate">
								{currentUrl}
							</span>
						</div>
					</div>

					{/* Browser Content Area */}
					{tabs.map((tab) => (
						<TabsContent
							key={tab.id}
							value={tab.id}
							className="p-1 bg-background flex-1 min-h-0 flex flex-col"
						>
							<div className="w-full h-full flex-1 min-h-0 relative">
								<canvas
									id={`browser-canvas-${tab.id}`}
									className="w-full h-full border border-border rounded"
								>
									
								</canvas>
							</div>
						</TabsContent>
					))}
				</Tabs>
			</Card>
		</div>
	);
}
