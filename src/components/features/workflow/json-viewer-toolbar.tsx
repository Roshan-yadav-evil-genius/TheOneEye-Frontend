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
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border bg-card/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className={`w-2.5 h-2.5 ${statusColor} rounded-full shadow-[0_0_8px_currentColor] transition-all duration-200`}></div>
          <h3 className="text-foreground font-medium text-sm tracking-wide">{title}</h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className={`text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 p-0 transition-all duration-200 ${copySuccess ? 'text-green-500' : ''}`}
            title={copySuccess ? "Copied!" : "Copy JSON"}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 p-0 transition-all duration-200"
            title="Download JSON"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShowSearchChange(!showSearch)}
            className={`text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 p-0 transition-all duration-200 ${showSearch ? 'bg-muted text-foreground' : ''}`}
            title="Search JSON"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onWordWrapChange(!wordWrap)}
            className={`text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 p-0 transition-all duration-200 ${wordWrap ? 'bg-muted text-foreground' : ''}`}
            title={wordWrap ? "Disable Word Wrap" : "Enable Word Wrap"}
          >
            <WrapText className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {showSearch && (
        <div className="px-3 py-2.5 border-b border-border bg-card flex-shrink-0 transition-all duration-200">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search in JSON..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="flex-1 bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary transition-all duration-200"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSearchTermChange("");
                onShowSearchChange(false);
              }}
              className="text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 p-0 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}



