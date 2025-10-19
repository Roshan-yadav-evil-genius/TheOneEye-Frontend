"use client";

import { JsonViewer } from "./json-viewer";

interface OutputSectionProps {
  activeOutputTab: "schema" | "json";
  onOutputTabChange: (value: "schema" | "json") => void;
  jsonData: Record<string, unknown> | unknown[] | string | null;
  isLoading?: boolean;
  error?: Error | null;
}

export function OutputSection({ 
  activeOutputTab, 
  onOutputTabChange, 
  jsonData,
  isLoading,
  error
}: OutputSectionProps) {
  return (
    <JsonViewer
      title="OUTPUT"
      statusColor="bg-orange-500"
      jsonData={jsonData}
      activeTab={activeOutputTab}
      onTabChange={onOutputTabChange}
      enableDragDrop={false}
      isLoading={isLoading}
      error={error}
    />
  );
}
