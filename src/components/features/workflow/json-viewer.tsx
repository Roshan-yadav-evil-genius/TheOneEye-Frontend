"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeEditor } from "@/components/ui/code-editor";
import { useState, useMemo } from 'react';
import React from 'react';
import { JsonViewerToolbar } from './json-viewer-toolbar';
import { SchemaTree } from './schema';

interface JsonViewerProps {
  title: string;
  statusColor: string;
  jsonData: Record<string, unknown> | unknown[] | string | null;
  activeTab: "schema" | "json";
  onTabChange: (value: "schema" | "json") => void;
  showExecuteButton?: boolean;
  onExecute?: () => void;
  onCopy?: () => void;
  onDownload?: () => void;
  onRefresh?: () => void;
  enableDragDrop?: boolean;
  isLoading?: boolean;
  error?: Error | null;
  editable?: boolean;
  onJsonChange?: (data: Record<string, unknown>) => void;
}

export function JsonViewer({
  title,
  statusColor,
  jsonData,
  activeTab,
  onTabChange,
  onCopy,
  onDownload,
  enableDragDrop = true,
  isLoading = false,
  error = null,
  editable = false,
  onJsonChange,
}: JsonViewerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [wordWrap, setWordWrap] = useState(false);
  const [editableJsonText, setEditableJsonText] = useState(() => 
    JSON.stringify(jsonData, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Update editable text when jsonData changes externally
  React.useEffect(() => {
    if (!editable) return;
    const newText = JSON.stringify(jsonData, null, 2);
    if (newText !== editableJsonText) {
      setEditableJsonText(newText);
      setJsonError(null);
    }
  }, [jsonData, editable]);

  const handleEditableJsonChange = (value: string) => {
    setEditableJsonText(value);
    try {
      const parsed = JSON.parse(value);
      setJsonError(null);
      if (onJsonChange) {
        onJsonChange(parsed);
      }
    } catch {
      setJsonError("Invalid JSON syntax");
    }
  };

  const filteredJsonData = useMemo(() => {
    if (!searchTerm || activeTab !== "json") {
      return jsonData;
    }
    
    // Simple search implementation - you can enhance this for more complex filtering
    const jsonString = JSON.stringify(jsonData, null, 2);
    const lines = jsonString.split('\n');
    const filteredLines = lines.filter(line => 
      line.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredLines.length === 0) {
      return { message: "No matching content found" };
    }
    
    return filteredLines.join('\n');
  }, [jsonData, searchTerm, activeTab]);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-1 border-b border-gray-700 bg-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 ${statusColor} rounded-full`}></div>
            <h3 className="text-white font-medium">{title}</h3>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-1 border-b border-gray-700 bg-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 ${statusColor} rounded-full`}></div>
            <h3 className="text-white font-medium">{title}</h3>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-500">
            <p className="text-sm">Failed to load data</p>
            <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <JsonViewerToolbar
        title={title}
        statusColor={statusColor}
        jsonData={jsonData}
        wordWrap={wordWrap}
        onWordWrapChange={setWordWrap}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        showSearch={showSearch}
        onShowSearchChange={setShowSearch}
        onCopy={onCopy}
        onDownload={onDownload}
      />
      
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as "schema" | "json")} className="flex-1 flex flex-col overflow-hidden gap-0">
        <TabsList className="grid w-full grid-cols-2 rounded-none flex-shrink-0 !m-0">
          <TabsTrigger 
            value="schema" 
            className={`data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400`}
          >
            Schema
          </TabsTrigger>
          <TabsTrigger 
            value="json" 
            className={`data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400`}
          >
            JSON
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="json" className="flex-1 overflow-hidden m-0">
          <CodeEditor
            value={editable ? editableJsonText : (typeof filteredJsonData === 'string' ? filteredJsonData : JSON.stringify(filteredJsonData, null, 2))}
            onChange={editable ? handleEditableJsonChange : undefined}
            readOnly={!editable}
            language="json"
            showLineNumbers={true}
            error={editable ? jsonError : null}
            placeholder='{"key": "value"}'
            wordWrap={wordWrap}
          />
        </TabsContent>
        
        <TabsContent value="schema" className="flex-1 m-0 overflow-hidden">
          <SchemaTree 
            jsonData={jsonData} 
            title={title} 
            wordWrap={wordWrap} 
            enableDrag={enableDragDrop} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
