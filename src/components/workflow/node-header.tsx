"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, Briefcase } from "lucide-react";

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
          className="bg-orange-600 hover:bg-orange-700 text-white text-sm px-3 py-1 h-auto"
          onClick={onTestStep}
        >
          <Briefcase className="w-3 h-3 mr-1" />
          Test step
        </Button>
        <a 
          href="#" 
          className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
          onClick={onViewDocs}
        >
          Docs
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
