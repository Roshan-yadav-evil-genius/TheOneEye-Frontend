"use client";

import { IconPlus, IconDeviceFloppy } from "@tabler/icons-react";
import { BrowserTabComponent } from "./browser-tab";

interface BrowserTabBarProps {
	activePageIds: string[];
	currentPageId: string | null;
	onPageSwitch: (pageId: string) => void;
	onPageClose: (pageId: string) => void;
	onNewTab: () => void;
	onSave?: () => void;
	isConnected?: boolean;
}

export function BrowserTabBar({
	activePageIds,
	currentPageId,
	onPageSwitch,
	onPageClose,
	onNewTab,
	onSave,
	isConnected = false,
}: BrowserTabBarProps) {
	const showCloseButton = activePageIds.length > 1; // Only show close button if more than one tab

	return (
		<div className="flex items-center justify-between gap-0.5 px-1 pt-1">
			<div className="flex items-end gap-0.5">
				{activePageIds.length === 0 ? (
					<div className="px-3 py-2 text-sm text-muted-foreground">No tabs open</div>
				) : (
					activePageIds.map((pageId, index) => {
						const isActive = pageId === currentPageId;
						const tabTitle = `Tab ${index + 1}`;

						return (
							<div
								key={pageId}
								className={`flex items-center gap-1 px-3 py-2 rounded-t-lg border border-transparent cursor-pointer transition-all ${
									isActive
										? 'bg-background border-b-transparent border-border'
										: 'hover:border-border/50 hover:bg-background/80'
								}`}
								onClick={() => onPageSwitch(pageId)}
								title={`Page ID: ${pageId}`}
							>
								<span className="text-sm">{tabTitle}</span>
								{showCloseButton && (
									<button
										className="ml-1 hover:bg-muted rounded px-1"
										onClick={(e) => {
											e.stopPropagation();
											onPageClose(pageId);
										}}
										title="Close tab"
									>
										×
									</button>
								)}
							</div>
						);
					})
				)}

				{/* Add New Tab Button */}
				<button
					onClick={onNewTab}
					className="px-3 py-2 rounded-t-lg border border-transparent hover:border-border/50 hover:bg-background/80 transition-all"
					title="New tab"
				>
					<IconPlus className="h-4 w-4" />
				</button>
			</div>

			{/* Action Buttons on the Right */}
			<div className="flex items-center gap-2 ml-auto mr-2 ">
				{onSave && isConnected && (
					<button
						onClick={onSave}
						className="cursor-pointer transition-colors text-green-600 hover:text-green-700"
						title="Save (Connected)"
					>
						<IconDeviceFloppy className="h-5 w-5" />
					</button>
				)}
			</div>
		</div>
	);
}

