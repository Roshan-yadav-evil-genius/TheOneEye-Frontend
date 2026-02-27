"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { IconArrowLeft, IconStack2 } from "@tabler/icons-react";

interface SettingsPageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: SettingsPageProps) {
  const resolvedParams = React.use(params);
  const sessionId = resolvedParams.id;

  return (
    <DashboardLayout>
      <main className="p-4">
        <div className="space-y-6 max-w-xl">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/browser-sessions/${sessionId}`}>
              <IconArrowLeft className="mr-2 h-4 w-4" />
              Back to session
            </Link>
          </Button>
          <div className="rounded-lg border bg-muted/30 p-6 space-y-4">
            <h1 className="text-xl font-semibold">Browser session settings</h1>
            <p className="text-muted-foreground">
              Throttling and resource blocking are configured at the <strong>pool</strong> level.
              Add this session to a browser pool and configure settings there.
            </p>
            <Button asChild>
              <Link href="/browser-pools">
                <IconStack2 className="mr-2 h-4 w-4" />
                Open Browser Pools
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
