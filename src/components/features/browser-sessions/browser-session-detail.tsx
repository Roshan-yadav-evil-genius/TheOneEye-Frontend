"use client";

import { useState } from "react";
import { TBrowserSession } from "@/types/browser-session";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
	IconEdit,
	IconTrash,
	IconPlayerPlay,
	IconBrowser,
	IconCalendar,
	IconUser,
	IconTag,
	IconSettings,
	IconInfoCircle,
	IconX,
	IconRefresh,
	IconArrowLeft,
	IconArrowRight,
	IconGlobe,
	IconHome
} from "@tabler/icons-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from "@/lib/utils";

interface BrowserSessionDetailProps {
	session: TBrowserSession;
	onEdit: (session: TBrowserSession) => void;
	onDelete: (session: TBrowserSession) => void;
	onLaunch: (session: TBrowserSession) => void;
}

export function BrowserSessionDetail({
	session,
	onEdit,
	onDelete,
	onLaunch,
}: BrowserSessionDetailProps) {
	const [activeTab, setActiveTab] = useState("overview");

	const getStatusBadge = (status: string) => {
		const variants = {
			active: "default",
			inactive: "secondary",
			error: "destructive",
		} as const;

		return (
			<Badge variant={variants[status as keyof typeof variants] || "secondary"}>
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
			<Badge className={colors[browserType as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"}>
				{browserType}
			</Badge>
		);
	};

	return (
		<div className="space-y-6 pt-5">
		{/* Browser-Style Tabs Section */}
		<Card className="p-0 overflow-hidden rounded-lg flex flex-col h-[calc(100vh-12rem)]">
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full gap-0 flex flex-col flex-1 min-h-0">
					{/* Browser Tab Bar */}
					<div className="flex items-end gap-0.5 px-1 pt-1">
						{/* Overview Tab */}
						<button
							onClick={() => setActiveTab("overview")}
							className={cn(
								"group relative flex items-center gap-2 px-4 py-2 rounded-t-lg border border-b-0 transition-all",
								activeTab === "overview"
									? "bg-muted/30 border-border shadow-[0_-2px_8px_rgba(0,0,0,0.1)] z-10"
									: "bg-background border-transparent hover:border-border/50"
							)}
						>
							<IconInfoCircle className="h-4 w-4 shrink-0" />
							<span className="text-sm font-medium whitespace-nowrap">Overview</span>
							{activeTab === "overview" && (
								<span
									role="button"
									tabIndex={0}
									onClick={(e) => {
										e.stopPropagation();
										// Don't close the last tab, just prevent default
									}}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.stopPropagation();
										}
									}}
									className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 rounded p-0.5 transition-opacity cursor-pointer"
									title="Close tab"
								>
									<IconX className="h-3 w-3" />
								</span>
							)}
						</button>

						{/* Configuration Tab */}
						<button
							onClick={() => setActiveTab("configuration")}
							className={cn(
								"group relative flex items-center gap-2 px-4 py-2 rounded-t-lg border border-b-0 transition-all",
								activeTab === "configuration"
									? "bg-muted/30 border-border shadow-[0_-2px_8px_rgba(0,0,0,0.1)] z-10"
									: "bg-background border-transparent hover:border-border/50"
							)}
						>
							<IconSettings className="h-4 w-4 shrink-0" />
							<span className="text-sm font-medium whitespace-nowrap">Configuration</span>
							{activeTab === "configuration" && (
								<span
									role="button"
									tabIndex={0}
									onClick={(e) => {
										e.stopPropagation();
										// Don't close the last tab, just prevent default
									}}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.stopPropagation();
										}
									}}
									className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 rounded p-0.5 transition-opacity cursor-pointer"
									title="Close tab"
								>
									<IconX className="h-3 w-3" />
								</span>
							)}
						</button>

						{/* Details Tab */}
						<button
							onClick={() => setActiveTab("details")}
							className={cn(
								"group relative flex items-center gap-2 px-4 py-2 rounded-t-lg border border-b-0 transition-all",
								activeTab === "details"
									? "bg-muted/30 border-border shadow-[0_-2px_8px_rgba(0,0,0,0.1)] z-10"
									: "bg-background border-transparent hover:border-border/50"
							)}
						>
							<IconBrowser className="h-4 w-4 shrink-0" />
							<span className="text-sm font-medium whitespace-nowrap">Details</span>
							{activeTab === "details" && (
								<span
									role="button"
									tabIndex={0}
									onClick={(e) => {
										e.stopPropagation();
										// Don't close the last tab, just prevent default
									}}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.stopPropagation();
										}
									}}
									className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 rounded p-0.5 transition-opacity cursor-pointer"
									title="Close tab"
								>
									<IconX className="h-3 w-3" />
								</span>
							)}
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
							>
								<IconArrowLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 hover:bg-muted"
								title="Home"
							>
								<IconHome className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 hover:bg-muted"
								title="Refresh"
							>
								<IconRefresh className="h-4 w-4" />
							</Button>
						</div>

						{/* Address Bar */}
						<div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-md bg-background border border-border/50 hover:border-border transition-colors">
							<IconInfoCircle className="h-4 w-4 text-muted-foreground shrink-0" />
							<span className="flex-1 text-sm text-foreground font-mono truncate">
								localhost:3000/browser-sessions/{session.id}
							</span>
						</div>
					</div>

				{/* Overview Tab */}
				<TabsContent value="overview" className="p-1 bg-background flex-1 min-h-0 flex flex-col">
					{/* remove browser feed i want to show canvas */}
					<div className="w-full h-full flex-1 min-h-0 relative">
						<canvas id="browser-canvas" className="w-full h-full"></canvas>
					</div>
				</TabsContent>


				</Tabs>
			</Card>

		</div>
	);
}

