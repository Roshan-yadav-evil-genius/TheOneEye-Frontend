import { BrowserSessionList } from "./browser-session-list";

interface BrowserSessionPageProps {
  sessions: any[];
  isLoading?: boolean;
}

export function BrowserSessionPage({ sessions, isLoading }: BrowserSessionPageProps) {
  return (
    <div className="px-4 lg:px-6">
      <main>
        <BrowserSessionList sessions={sessions} />
      </main>
    </div>
  );
}
