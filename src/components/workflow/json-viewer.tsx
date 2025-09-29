"use client";

import { Copy, Download, Search, Play, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DraggableSchema } from './draggable-schema';

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
  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    } else {
      navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    }
  };

  const handleExecute = () => {
    if (onExecute) {
      onExecute();
    }
  };


  return (
    <div className="w-1/3 border-r flex flex-col overflow-hidden ">
      <div className="flex items-center justify-between p-1 border-b border-gray-700 bg-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 ${statusColor} rounded-full`}></div>
          <h3 className="text-white font-medium">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {showExecuteButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExecute}
              className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 px-3"
            >
              <Play className="w-4 h-4 mr-1" />
              Execute
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownload}
            className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0"
          >
            <Download className="w-4 h-4" />
          </Button>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
          <Search className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      
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
          <div className="h-full overflow-auto">
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
              {JSON.stringify(jsonData, null, 2)}
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
