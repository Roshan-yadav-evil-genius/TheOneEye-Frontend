"use client";

import { IconBrowser, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { BrowserTab } from "../types/browser-tab";
import { getTabTitle } from "../utils/browser-utils";

interface BrowserTabProps {
	tab: BrowserTab;
	isActive: boolean;
	onClick: () => void;
	onClose: (e: React.MouseEvent) => void;
}

export function BrowserTabComponent({ tab, isActive, onClick, onClose }: BrowserTabProps) {
	return (
		<button
			onClick={onClick}
			className={cn(
				"group relative flex items-center gap-2 px-4 py-2 rounded-t-lg border border-b-0 transition-all",
				isActive
					? "bg-muted/30 border-border z-10"
					: "bg-background border-transparent hover:border-border/50"
			)}
		>
			<IconBrowser className="h-4 w-4 shrink-0" />
			<span className="text-sm font-medium whitespace-nowrap max-w-[150px] truncate">
				{getTabTitle(tab.url)}
			</span>
			{isActive && (
				<span
					role="button"
					tabIndex={0}
					onClick={onClose}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.stopPropagation();
							onClose(e as any);
						}
					}}
					className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 rounded p-0.5 transition-opacity cursor-pointer"
					title="Close tab"
				>
					<IconX className="h-3 w-3" />
				</span>
			)}
		</button>
	);
}

