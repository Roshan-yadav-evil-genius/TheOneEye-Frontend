import { useMemo, useEffect, useState } from "react";
import { BrowserTab } from "../types/browser-tab";
import { UseBrowserWebSocketReturn } from "./useBrowserWebSocket";
import { getTabTitle } from "../utils/browser-utils";

export function useBrowserTabs(websocket: UseBrowserWebSocketReturn) {
	// Store tab metadata (title, url) separately to preserve it across page syncs
	const [tabMetadata, setTabMetadata] = useState<Map<string, { title: string; url: string }>>(new Map());

	// Convert activePageIds Set to tabs array
	const tabs = useMemo(() => {
		const pageIdsArray = Array.from(websocket.activePageIds);
		return pageIdsArray.map((pageId, index) => {
			// Get metadata for this pageId
			const metadata = tabMetadata.get(pageId);
			return {
				id: pageId, // Use pageId as the ID
				title: metadata?.title || getTabTitle(websocket.currentUrl) || `Tab ${index + 1}`,
				url: metadata?.url || websocket.currentUrl || "",
				pageId: pageId,
			} as BrowserTab;
		});
	}, [websocket.activePageIds, websocket.currentUrl, tabMetadata]);

	// Find active tab based on currentPageId
	const activeTabId = useMemo(() => {
		if (!websocket.currentPageId) return tabs[0]?.id || "";
		const activeTab = tabs.find(tab => tab.pageId === websocket.currentPageId);
		return activeTab?.id || tabs[0]?.id || "";
	}, [tabs, websocket.currentPageId]);

	const currentUrl = websocket.currentUrl;

	// Update tab metadata when URL changes
	useEffect(() => {
		if (websocket.currentPageId && websocket.currentUrl) {
			setTabMetadata(prev => {
				const newMap = new Map(prev);
				newMap.set(websocket.currentPageId!, {
					title: getTabTitle(websocket.currentUrl),
					url: websocket.currentUrl,
				});
				return newMap;
			});
		}
	}, [websocket.currentPageId, websocket.currentUrl]);

	const handleTabClick = (tabId: string) => {
		const tab = tabs.find(t => t.id === tabId);
		if (tab?.pageId && websocket.isStreaming) {
			websocket.sendPageSwitch(tab.pageId);
		}
	};

	const handleCloseTab = (tabId: string) => {
		const tab = tabs.find(t => t.id === tabId);
		if (!tab) return;

		// Don't close the last tab
		if (tabs.length <= 1) return;

		// Send close message to WebSocket
		if (tab.pageId && websocket.isStreaming) {
			websocket.sendCloseTab(tab.pageId);
		}
	};

	const handleAddTab = () => {
		if (websocket.isStreaming) {
			websocket.sendNewTab();
		}
	};

	return {
		tabs,
		activeTabId,
		currentUrl,
		setCurrentUrl: () => {
			// URL is managed by WebSocket, but we provide this for compatibility
		},
		handleTabClick,
		handleCloseTab,
		handleAddTab,
	};
}
