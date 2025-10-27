"use client";

import { useEffect } from "react";
import { useBrowserSessionStore } from "@/stores/browser-session-store";
import { BrowserSessionPage } from "./BrowserSessionPage";

export function BrowserSessionPageContainer() {
  const { sessions, loadSessions, isLoading } = useBrowserSessionStore();

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return <BrowserSessionPage sessions={sessions} isLoading={isLoading} />;
}


