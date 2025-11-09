"use client";

import { TBrowserSession } from "@/types/browser-session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconEdit, IconInfoCircle } from "@tabler/icons-react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface BrowserSessionInfoProps {
	session: TBrowserSession;
	onEdit?: (session: TBrowserSession) => void;
}

export function BrowserSessionInfo({
	session,
	onEdit,
}: BrowserSessionInfoProps) {
	const getStatusBadge = (status: string) => {
		const variants = {
			active: "default",
			inactive: "secondary",
			error: "destructive",
		} as const;

		return (
			<Badge variant={variants[status as keyof typeof variants] || "secondary"} className="text-xs">
				{status}
			</Badge>
		);
	};

	const getBrowserTypeBadge = (browserType: string) => {
		const colors = {
			chromium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
			firefox: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
			webkit: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
		};

		return (
			<Badge className={`text-xs ${colors[browserType as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"}`}>
				{browserType}
			</Badge>
		);
	};

	return (
		<div className="flex items-center justify-between p-1">
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 text-sm">
					{session.description && (
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									type="button"
									className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
									aria-label="Show description"
								>
									<IconInfoCircle className="h-4 w-4" />
								</button>
							</TooltipTrigger>
							<TooltipContent>
								<p className="max-w-xs">{session.description}</p>
							</TooltipContent>
						</Tooltip>
					)}
					<span className="font-semibold text-sm">{session.name}</span>
					{getStatusBadge(session.status)}
					{getBrowserTypeBadge(session.browser_type)}
				</div>
			</div>
			{onEdit && (
				<Button onClick={() => onEdit(session)} variant="outline" size="sm" className="h-7 text-xs ml-3 shrink-0">
					<IconEdit className="mr-1.5 h-3.5 w-3.5" />
					Edit
				</Button>
			)}
		</div>
	);
}

