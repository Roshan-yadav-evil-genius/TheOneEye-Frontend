"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, Play, FileText } from "lucide-react";
import { getNodeColors } from "@/constants/node-styles";

interface NodeHeaderProps {
  nodeType: string;
  nodeLabel: string;
  nodeId: string;
  onTestStep?: () => void;
  onViewDocs?: () => void;
}

export function NodeHeader({ 
  nodeType, 
  nodeLabel, 
  nodeId,
  onTestStep, 
  onViewDocs 
}: NodeHeaderProps) {
  const { colorClass, iconColorClass } = getNodeColors(nodeType);

  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-700 bg-gray-800">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className={`px-2 py-0.5 rounded-lg border ${colorClass} flex items-center justify-center`}>
            <span className={`text-xs font-medium ${iconColorClass}`}>{nodeType}</span>
          </div>
          <h3 className="text-white font-semibold">{nodeLabel}</h3>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          ID: {nodeId || 'N/A'}
        </div>
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
