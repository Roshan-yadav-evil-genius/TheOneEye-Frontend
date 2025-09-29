"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, Play, FileText } from "lucide-react";

interface NodeHeaderProps {
  nodeType: string;
  nodeLabel: string;
  onTestStep?: () => void;
  onViewDocs?: () => void;
}

export function NodeHeader({ 
  nodeType, 
  nodeLabel, 
  onTestStep, 
  onViewDocs 
}: NodeHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">{nodeType}</span>
        </div>
        <h3 className="text-white font-medium">{nodeLabel}</h3>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-3 text-xs"
          onClick={onTestStep}
        >
          <Play className="h-3.5 w-3.5 text-green-500 hover:text-green-600" />
        </Button>
        <Button 
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-3 text-xs"
          onClick={onViewDocs}
        >
          <FileText className="h-3.5 w-3.5 text-blue-500 hover:text-blue-600" />
        </Button>
      </div>
    </div>
  );
}
