"use client";

import { useState } from 'react';
import { Copy, Download, Search, X, WrapText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface JsonViewerToolbarProps {
  title: string;
  statusColor: string;
  jsonData: Record<string, unknown> | unknown[] | string | null;
  wordWrap: boolean;
  onWordWrapChange: (value: boolean) => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  showSearch: boolean;
  onShowSearchChange: (value: boolean) => void;
  onCopy?: () => void;
  onDownload?: () => void;
}

export function JsonViewerToolbar({
  title,
  statusColor,
  jsonData,
  wordWrap,
  onWordWrapChange,
  searchTerm,
  onSearchTermChange,
  showSearch,
  onShowSearchChange,
  onCopy,
  onDownload,
}: JsonViewerToolbarProps) {
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
    } catch {
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

  return (
    <>
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
            onClick={() => onShowSearchChange(!showSearch)}
            className={`text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0 ${showSearch ? 'bg-gray-700 text-white' : ''}`}
            title="Search JSON"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWordWrapChange(!wordWrap)}
            className={`text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0 ${wordWrap ? 'bg-gray-700 text-white' : ''}`}
            title={wordWrap ? "Disable Word Wrap" : "Enable Word Wrap"}
          >
            <WrapText className="w-4 h-4" />
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
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSearchTermChange("");
                onShowSearchChange(false);
              }}
              className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}



