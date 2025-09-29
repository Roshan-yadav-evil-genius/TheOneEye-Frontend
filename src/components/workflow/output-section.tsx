"use client";

import { JsonViewer } from "./json-viewer";

interface OutputSectionProps {
  activeOutputTab: "schema" | "json";
  onOutputTabChange: (value: "schema" | "json") => void;
  jsonData: any;
}

export function OutputSection({ activeOutputTab, onOutputTabChange, jsonData }: OutputSectionProps) {
  const handleExecute = () => {
    // This would trigger the node execution
    console.log("Executing node...");
  };

  const handleRefresh = () => {
    // This would refresh the output data
    console.log("Refreshing output...");
  };

  return (
    <JsonViewer
      title="OUTPUT"
      statusColor="bg-orange-500"
      jsonData={jsonData}
      activeTab={activeOutputTab}
      onTabChange={onOutputTabChange}
      showExecuteButton={true}
      onExecute={handleExecute}
      onRefresh={handleRefresh}
    />
  );
}
