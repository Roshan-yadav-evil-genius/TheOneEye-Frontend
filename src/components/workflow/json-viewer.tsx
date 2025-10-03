"use client";

import { Copy, Download, Search, Play, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DraggableSchema } from './draggable-schema';
import { useState, useMemo } from 'react';

interface JsonViewerProps {
  title: string;
  statusColor: string;
  jsonData: any;
  activeTab: "schema" | "json";
  onTabChange: (value: "schema" | "json") => void;
  showExecuteButton?: boolean;
  onExecute?: () => void;
  onCopy?: () => void;
  onDownload?: () => void;
  onRefresh?: () => void;
}

export function JsonViewer({
  title,
  statusColor,
  jsonData,
  activeTab,
  onTabChange,
  showExecuteButton = false,
  onExecute,
  onCopy,
  onDownload,
  onRefresh
}: JsonViewerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      const jsonString = JSON.stringify(jsonData, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      
      if (onCopy) {
        onCopy();
      }
    } catch (err) {
      // Failed to copy text
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      const jsonString = JSON.stringify(jsonData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.toLowerCase()}-data.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleExecute = () => {
    if (onExecute) {
      onExecute();
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


  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-1 border-b border-gray-700 bg-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 ${statusColor} rounded-full`}></div>
          <h3 className="text-white font-medium">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className={`text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0 ${copySuccess ? 'text-green-400' : ''}`}
            title={copySuccess ? "Copied!" : "Copy JSON"}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0"
            title="Download JSON"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className={`text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0 ${showSearch ? 'bg-gray-700 text-white' : ''}`}
            title="Search JSON"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
        <div></div>
      </div>
      
      {showSearch && (
        <div className="p-2 border-b border-gray-700 bg-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search in JSON..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setShowSearch(false);
              }}
              className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      
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
        
        <TabsContent value="json" className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto sidebar-scrollbar">
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                fontSize: '0.875rem',
                height: '100%',
                overflow: 'auto'
              }}
              showLineNumbers={true}
              wrapLines={true}
            >
              {typeof filteredJsonData === 'string' ? filteredJsonData : JSON.stringify(filteredJsonData, null, 2)}
            </SyntaxHighlighter>
          </div>
        </TabsContent>
        
        <TabsContent value="schema" className="flex-1 m-0 overflow-hidden">
          <DraggableSchema jsonData={jsonData} title={title} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
