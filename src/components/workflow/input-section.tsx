"use client";

import { JsonViewer } from "./json-viewer";

interface InputSectionProps {
  activeInputTab: "schema" | "json";
  onInputTabChange: (value: "schema" | "json") => void;
  jsonData: any;
  expressions?: string[];
  onExpressionsChange?: (expressions: string[]) => void;
}

export function InputSection({ 
  activeInputTab, 
  onInputTabChange, 
  jsonData, 
  expressions, 
  onExpressionsChange 
}: InputSectionProps) {
  return (
    <JsonViewer
      title="INPUT"
      statusColor="bg-green-500"
      jsonData={jsonData}
      activeTab={activeInputTab}
      onTabChange={onInputTabChange}
      expressions={expressions}
      onExpressionsChange={onExpressionsChange}
    />
  );
}
