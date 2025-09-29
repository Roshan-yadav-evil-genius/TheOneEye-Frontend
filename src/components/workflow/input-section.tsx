"use client";

import { JsonViewer } from "./json-viewer";

interface InputSectionProps {
  activeInputTab: "schema" | "json";
  onInputTabChange: (value: "schema" | "json") => void;
  jsonData: any;
}

export function InputSection({ activeInputTab, onInputTabChange, jsonData }: InputSectionProps) {
  return (
    <JsonViewer
      title="INPUT"
      statusColor="bg-green-500"
      jsonData={jsonData}
      activeTab={activeInputTab}
      onTabChange={onInputTabChange}
    />
  );
}
