"use client";

import { TBrowserSession } from "@/types/browser-session";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  IconDots, 
  IconEdit, 
  IconTrash,
  IconEye,
  IconPlus,
  IconPlayerPlay
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface BrowserSessionTableProps {
  sessions: TBrowserSession[];
  onEdit: (session: TBrowserSession) => void;
  onView: (session: TBrowserSession) => void;
  onDelete: (session: TBrowserSession) => void;
  onLaunch: (session: TBrowserSession) => void;
  onCreate: () => void;
}

export function BrowserSessionTable({
  sessions,
  onEdit,
  onView,
  onDelete,
  onLaunch,
  onCreate,
}: BrowserSessionTableProps) {
  const router = useRouter();

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
      chromium: "bg-blue-100 text-blue-800",
      firefox: "bg-orange-100 text-orange-800",
      webkit: "bg-green-100 text-green-800",
    };

    return (
      <Badge className={colors[browserType as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {browserType}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Browser Sessions</h2>
        <Button onClick={onCreate}>
          <IconPlus className="mr-2 h-4 w-4" />
          Create Session
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Browser Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session, index) => (
              <TableRow key={session.id || `session-${index}`}>
                <TableCell className="font-medium">{session.name}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {session.description}
                </TableCell>
                <TableCell>{getBrowserTypeBadge(session.browser_type)}</TableCell>
                <TableCell>{getStatusBadge(session.status)}</TableCell>
                <TableCell>{session.created_by || "Unknown"}</TableCell>
                <TableCell>
                  {new Date(session.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <IconDots className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(session)}>
                        <IconEye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(session)}>
                        <IconEdit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/browser-sessions/${session.id}`)}>
                        <IconPlayerPlay className="mr-2 h-4 w-4" />
                        Launch Browser
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(session)}
                        className="text-red-600"
                      >
                        <IconTrash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
