"use client";

import { Play, Copy, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface OutputSectionProps {
  activeOutputTab: "schema" | "json";
  onOutputTabChange: (value: "schema" | "json") => void;
}

export function OutputSection({ activeOutputTab, onOutputTabChange }: OutputSectionProps) {
  // Sample output data - this would come from the node execution
  const outputJson = `[
  {
    "row_number": 2,
    "Name": "Kenneth Smith",
    "Age": 51,
    "master": {
      "c1": 1,
      "c2": 2,
      "nested": {
        "deepkey": "deepValue"
      }
    },
    "filtered": true,
    "result": "Age is greater than 50"
  },
  {
    "row_number": 3,
    "Name": "Jane Doe",
    "Age": 28,
    "master": {
      "c1": 3,
      "c2": 4,
      "nested": {
        "deepkey": "anotherValue"
      }
    },
    "filtered": false,
    "result": "Age is not greater than 50"
  }
]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(outputJson);
  };

  const handleExecute = () => {
    // This would trigger the node execution
    console.log("Executing node...");
  };

  return (
    <div className="w-1/3 flex flex-col bg-gray-900 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <h3 className="text-white font-medium">OUTPUT</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExecute}
            className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 px-3"
          >
            <Play className="w-4 h-4 mr-1" />
            Execute
          </Button>
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
            className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <Tabs value={activeOutputTab} onValueChange={(value) => onOutputTabChange(value as "schema" | "json")} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-b border-gray-700 rounded-none flex-shrink-0">
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
        
        <TabsContent value="json" className="flex-1 m-0 overflow-hidden">
          <div className="h-full overflow-auto">
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: '1rem',
                background: '#1f2937',
                fontSize: '0.875rem',
                height: '100%',
                overflow: 'auto'
              }}
              showLineNumbers={true}
              wrapLines={true}
            >
              {outputJson}
            </SyntaxHighlighter>
          </div>
        </TabsContent>
        
        <TabsContent value="schema" className="flex-1 m-0 overflow-hidden">
          <div className="h-full overflow-auto p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-blue-400 font-mono text-sm">array</span>
              </div>
              <div className="ml-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-green-400 font-mono text-sm">object</span>
                </div>
                <div className="ml-4 space-y-1">
                  <div className="text-yellow-400 font-mono text-sm">row_number: number</div>
                  <div className="text-green-400 font-mono text-sm">Name: string</div>
                  <div className="text-yellow-400 font-mono text-sm">Age: number</div>
                  <div className="text-purple-400 font-mono text-sm">master: object</div>
                  <div className="text-purple-400 font-mono text-sm">filtered: boolean</div>
                  <div className="text-green-400 font-mono text-sm">result: string</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
