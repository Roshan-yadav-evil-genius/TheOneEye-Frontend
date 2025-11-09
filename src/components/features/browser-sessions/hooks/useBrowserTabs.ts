import { useState, useEffect } from "react";
import { BrowserTab } from "../types/browser-tab";

// Dummy data for browser tabs
const DUMMY_TABS: BrowserTab[] = [
	{ id: "1", title: "Google", url: "https://www.google.com" },
	{ id: "2", title: "GitHub", url: "https://www.github.com" },
	{ id: "3", title: "Stack Overflow", url: "https://stackoverflow.com" },
];

export function useBrowserTabs() {
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

	const handleCloseTab = (tabId: string) => {
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

	return {
		tabs,
		activeTabId,
		currentUrl,
		setCurrentUrl,
		handleTabClick,
		handleCloseTab,
		handleAddTab,
	};
}

