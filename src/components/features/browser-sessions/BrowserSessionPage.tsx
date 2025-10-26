import { BrowserSessionList } from "./browser-session-list";

interface BrowserSessionPageProps {
  sessions: any[];
  isLoading?: boolean;
}

export function BrowserSessionPage({ sessions, isLoading }: BrowserSessionPageProps) {
  return (
    <main className="p-4">
      <BrowserSessionList sessions={sessions} />
    </main>
  );
}
