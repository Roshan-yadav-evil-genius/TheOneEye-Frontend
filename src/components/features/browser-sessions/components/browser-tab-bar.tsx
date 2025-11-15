"use client";

import { IconPlus, IconPlayerPlay, IconCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { BrowserTabComponent } from "./browser-tab";

interface BrowserTabBarProps {
	activePageIds: string[];
	currentPageId: string | null;
	onPageSwitch: (pageId: string) => void;
	onPageClose: (pageId: string) => void;
	onNewTab: () => void;
	onStartSession?: () => void;
	onSave?: () => void;
	isConnected?: boolean;
	webSocketStatus?: 'connecting' | 'connected' | 'disconnected' | 'error';
}

export function BrowserTabBar({
	activePageIds,
	currentPageId,
	onPageSwitch,
	onPageClose,
	onNewTab,
	onStartSession,
	onSave,
	isConnected = false,
	webSocketStatus = 'disconnected',
}: BrowserTabBarProps) {
	const showCloseButton = activePageIds.length > 1; // Only show close button if more than one tab

	return (
		<div className="flex items-end justify-between gap-0.5 px-1 pt-1">
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
			<div className="flex items-center gap-2 ml-auto">
				{onStartSession && !isConnected && (
					<Button
						onClick={onStartSession}
						disabled={webSocketStatus === 'connecting'}
						size="sm"
						className="h-7 text-xs"
						variant="secondary"
					>
						<IconPlayerPlay className="mr-1.5 h-3.5 w-3.5" />
						Start Session
					</Button>
				)}
				{onSave && isConnected && (
					<Button
						onClick={onSave}
						size="sm"
						className="h-7 text-xs"
					>
						<IconCheck className="mr-1.5 h-3.5 w-3.5" />
						Save
					</Button>
				)}
			</div>
		</div>
	);
}

