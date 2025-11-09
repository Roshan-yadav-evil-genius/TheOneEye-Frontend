"use client";

import { TBrowserSession } from "@/types/browser-session";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  IconEdit, 
  IconTrash,
  IconPlayerPlay,
  IconBrowser,
  IconCalendar,
  IconUser,
  IconTag
} from "@tabler/icons-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{session.name}</h1>
            {getStatusBadge(session.status)}
            {getBrowserTypeBadge(session.browser_type)}
          </div>
          {session.description && (
            <p className="text-muted-foreground text-lg">{session.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => onEdit(session)} variant="outline">
            <IconEdit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button onClick={() => onLaunch(session)}>
            <IconPlayerPlay className="mr-2 h-4 w-4" />
            Launch Browser
          </Button>
          <Button onClick={() => onDelete(session)} variant="destructive">
            <IconTrash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Session Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBrowser className="h-5 w-5" />
              Session Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Browser Type</label>
              <div className="mt-1">
                {getBrowserTypeBadge(session.browser_type)}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                {getStatusBadge(session.status)}
              </div>
            </div>
            {session.created_by && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <IconUser className="h-4 w-4" />
                  Created By
                </label>
                <p className="mt-1">{session.created_by}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timestamps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCalendar className="h-5 w-5" />
              Timestamps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p className="mt-1">
                {new Date(session.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Updated At</label>
              <p className="mt-1">
                {new Date(session.updated_at).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tags */}
      {session.tags && session.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconTag className="h-5 w-5" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {session.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Playwright Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Playwright Configuration</CardTitle>
          <CardDescription>
            Browser automation settings and configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                fontSize: '0.875rem',
                padding: '1rem',
              }}
              showLineNumbers={true}
            >
              {JSON.stringify(session.playwright_config || {}, null, 2)}
            </SyntaxHighlighter>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

