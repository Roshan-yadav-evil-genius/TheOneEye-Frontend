"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconMail,
  IconUser,
  IconId,
  IconAt,
  IconUserCircle,
} from "@tabler/icons-react";
import type { TUser } from "@/types";

interface AccountPageProps {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

function getDisplayName(user: TUser | null): string {
  if (!user) return "";
  const first = user.first_name ?? "";
  const last = user.last_name ?? "";
  const full = `${first} ${last}`.trim();
  return full || user.name || user.username ?? "";
}

function getInitials(user: TUser | null): string {
  const name = getDisplayName(user);
  if (!name) return user?.username?.slice(0, 2).toUpperCase() ?? "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function DetailField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="group flex items-start gap-3 rounded-lg p-4 transition-colors hover:bg-muted/50">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-muted/80">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="font-medium text-foreground break-all">{value || "—"}</p>
      </div>
    </div>
  );
}

/**
 * Account page: display current user's profile details.
 * Single responsibility: present user details in a readable layout.
 */
export function AccountPage({
  user,
  isAuthenticated,
  isLoading,
}: AccountPageProps) {
  if (isLoading) {
    return (
      <main className="p-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr] lg:gap-8">
          <Card className="h-fit">
            <CardContent className="flex flex-col items-center pt-8 pb-8">
              <Skeleton className="h-28 w-28 rounded-2xl" />
              <Skeleton className="mt-4 h-5 w-32" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile details</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (!user || !isAuthenticated) {
    return (
      <main className="p-4">
        <Card className="border-dashed">
          <CardContent className="flex flex-col gap-4 py-12">
            <div className="rounded-full bg-muted p-3 w-fit">
              <IconUserCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Sign in to view your account</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your profile and account details will appear here once you’re signed in.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  const displayName = getDisplayName(user);
  const initials = getInitials(user);

  return (
    <main className="p-4">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr] lg:gap-8">
        {/* Left: avatar + display name */}
        <Card className="h-fit border border-border/80 bg-card shadow-sm lg:sticky lg:top-6">
          <CardContent className="flex flex-col items-center pt-8 pb-8">
            <Avatar className="h-28 w-28 rounded-2xl border-2 border-border shadow-md">
              <AvatarFallback className="rounded-2xl bg-primary/15 text-3xl font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <p className="mt-4 text-center font-semibold tracking-tight">
              {displayName || "—"}
            </p>
            {user.username && (
              <p className="mt-1 text-center text-sm text-muted-foreground">
                ({user.username})
              </p>
            )}
          </CardContent>
        </Card>

        {/* Right: profile details grid */}
        <Card className="border border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <IconUserCircle className="h-5 w-5 text-muted-foreground" />
              Profile details
            </CardTitle>
            <CardDescription>
              Your account information from this workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              <DetailField
                icon={IconMail}
                label="Email"
                value={user.email ?? ""}
              />
              <DetailField
                icon={IconAt}
                label="Username"
                value={user.username ?? ""}
              />
              <DetailField
                icon={IconUser}
                label="First name"
                value={user.first_name ?? ""}
              />
              <DetailField
                icon={IconUser}
                label="Last name"
                value={user.last_name ?? ""}
              />
              <DetailField
                icon={IconId}
                label="User ID"
                value={String(user.id ?? "")}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
