"use client";

import { JsonViewer } from "./json-viewer";

interface InputSectionProps {
  activeInputTab: "schema" | "json";
  onInputTabChange: (value: "schema" | "json") => void;
  jsonData: Record<string, unknown> | unknown[] | string | null;
  isLoading?: boolean;
  error?: Error | null;
}

export function InputSection({ 
  activeInputTab, 
  onInputTabChange, 
  jsonData,
  isLoading,
  error
}: InputSectionProps) {
  return (
    <JsonViewer
      title="INPUT"
      statusColor="bg-green-500"
      jsonData={jsonData}
      activeTab={activeInputTab}
      onTabChange={onInputTabChange}
      isLoading={isLoading}
      error={error}
    />
  );
}
