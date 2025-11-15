"use client";

import { Button } from "@/components/ui/button";
import {
	IconBrowser,
	IconRefresh,
	IconArrowLeft,
	IconArrowRight,
	IconHome,
} from "@tabler/icons-react";

interface BrowserAddressBarProps {
	currentUrl: string;
	onGoBack: () => void;
	onGoForward: () => void;
	onGoHome: () => void;
	onRefresh: () => void;
}

export function BrowserAddressBar({
	currentUrl,
	onGoBack,
	onGoForward,
	onGoHome,
	onRefresh,
}: BrowserAddressBarProps) {
	return (
		<div className="flex items-center gap-2 px-3 py-2 bg-muted/30">
			{/* Navigation Controls */}
			<div className="flex items-center gap-0.5">
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 hover:bg-muted"
					title="Go back"
					onClick={onGoBack}
				>
					<IconArrowLeft className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 hover:bg-muted"
					title="Go forward"
					onClick={onGoForward}
				>
					<IconArrowRight className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 hover:bg-muted"
					title="Home"
					onClick={onGoHome}
				>
					<IconHome className="h-4 w-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 hover:bg-muted"
					title="Refresh"
					onClick={onRefresh}
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
	);
}

