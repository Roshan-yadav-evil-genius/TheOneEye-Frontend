"use client";

import { IconPlus } from "@tabler/icons-react";
import { BrowserTab } from "../types/browser-tab";
import { BrowserTabComponent } from "./browser-tab";

interface BrowserTabBarProps {
	tabs: BrowserTab[];
	activeTabId: string;
	onTabClick: (tabId: string) => void;
	onTabClose: (tabId: string) => void;
	onAddTab: () => void;
}

export function BrowserTabBar({
	tabs,
	activeTabId,
	onTabClick,
	onTabClose,
	onAddTab,
}: BrowserTabBarProps) {
	return (
		<div className="flex items-end gap-0.5 px-1 pt-1">
			{tabs.map((tab) => (
				<BrowserTabComponent
					key={tab.id}
					tab={tab}
					isActive={activeTabId === tab.id}
					onClick={() => onTabClick(tab.id)}
					onClose={(e) => {
						e.stopPropagation();
						onTabClose(tab.id);
					}}
				/>
			))}

			{/* Add New Tab Button */}
			<button
				onClick={onAddTab}
				className="px-3 py-2 rounded-t-lg border border-transparent hover:border-border/50 hover:bg-background/80 transition-all"
				title="New tab"
			>
				<IconPlus className="h-4 w-4" />
			</button>
		</div>
	);
}

