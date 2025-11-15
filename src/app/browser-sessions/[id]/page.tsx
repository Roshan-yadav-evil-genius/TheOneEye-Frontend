"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BrowserSessionDetail } from "@/components/features/browser-sessions/browser-session-detail";			
import { useBrowserSessionStore } from "@/stores/browser-session-store";
import { TBrowserSession } from "@/types/browser-session";

interface BrowserSessionDetailPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function Page({ params }: BrowserSessionDetailPageProps) {
	const resolvedParams = React.use(params);
	const sessionId = resolvedParams.id;
	const [session, setSession] = useState<TBrowserSession | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const { getSessionById, deleteSession, launchBrowser } = useBrowserSessionStore();

	useEffect(() => {
		const loadSession = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const sessionData = await getSessionById(sessionId);
				setSession(sessionData);
			} catch (err) {
				if (err instanceof Error) {
					// Check if it's a 404 error
					if (err.message.includes('404') || err.message.includes('Not found')) {
						setError(`Browser session with ID "${sessionId}" not found`);
					} else {
						setError(err.message || 'Failed to load browser session');
					}
				} else {
					setError('Failed to load browser session');
				}
			} finally {
				setIsLoading(false);
			}
		};

		if (sessionId) {
			loadSession();
		}
	}, [sessionId, getSessionById]);

	const handleSave = (sessionToSave: TBrowserSession) => {
		// Redirect to browser sessions list page after save
		router.push("/browser-sessions");
	};
	// Loading state
	if (isLoading) {
		return (
			<DashboardLayout>
				<div className="space-y-6">
					<div className="flex items-center gap-4">
						<Link href="/browser-sessions">
							<Button variant="outline" size="sm">
								<IconArrowLeft className="mr-2 h-4 w-4" />
								Back to Sessions
							</Button>
						</Link>
					</div>
					<div className="flex items-center justify-center py-12">
						<div className="text-center">
							<IconLoader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
							<h2 className="text-lg font-semibold mb-2">Loading Browser Session</h2>
							<p className="text-muted-foreground">
								Please wait while we load the session data...
							</p>
						</div>
					</div>
				</div>
			</DashboardLayout>
		);
	}

	// Error state
	if (error || !session) {
		return (
			<DashboardLayout>
				<div className="text-center py-12">
					<div className="text-destructive mb-4">
						<svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
						</svg>
					</div>
					<h1 className="text-2xl font-bold mb-2">Browser Session Not Found</h1>
					<p className="text-muted-foreground mb-4">
						{error || `The browser session with ID "${sessionId}" could not be found.`}
					</p>
					<div className="flex gap-2 justify-center">
						<Button
							variant="outline"
							onClick={() => window.location.reload()}
						>
							Retry
						</Button>
						<Link href="/browser-sessions">
							<Button>
								Back to Sessions
							</Button>
						</Link>
					</div>
				</div>
			</DashboardLayout>
		);
	}


	// Success state - render the session detail
	return (
			<DashboardLayout>
				<BrowserSessionDetail
					session={session}
					onSave={handleSave}
				/>
			</DashboardLayout>
	);
}

