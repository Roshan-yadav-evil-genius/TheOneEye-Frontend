"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { IconInfoCircle, IconTag } from "@tabler/icons-react";
import { TNode } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getNodeColors } from "@/constants/node-styles";

interface NodeHeaderProps {
  nodeData: Partial<TNode>;
  logoPreview?: string | null;
}

export function NodeHeader({ nodeData, logoPreview }: NodeHeaderProps) {
  const { colorClass, iconColorClass } = getNodeColors(nodeData.type || "system");
  
  return (
    <div className="flex items-center gap-2">
      <div>
        <div className="flex gap-2 items-center mb-1">
          {/* Logo */}
          <div className="flex-shrink-0">
            {logoPreview ? (
              <Image
                src={logoPreview}
                alt="Node logo"
                width={40}
                height={40}
                className="h-10 w-10 object-cover rounded border-2 border-border shadow-sm"
              />
            ) : (
              <div className={`h-20 w-20 rounded-xl border-2 flex items-center justify-center shadow-sm ${colorClass}`}>
                <span className={`text-xl font-bold ${iconColorClass}`}>
                  {nodeData.name?.charAt(0).toUpperCase() || "N"}
                </span>
              </div>
            )}
          </div>
          <div>
            {/* Title */}
            <div className="flex items-center gap-1">
              <h1 className="text-xl font-bold text-foreground">
                {nodeData.name || "Unnamed Node"}
              </h1>
              {nodeData.description && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="flex-shrink-0 p-1 rounded-full hover:bg-muted/50 transition-colors">
                        <IconInfoCircle className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <p>{nodeData.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            {/* Version */}
            <div className="text-xs text-slate-500">
              Version: {nodeData.version || "1.0.0"}
            </div>
          </div>
        </div>

        {/* Tags */}
        {nodeData.tags && nodeData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {nodeData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-1">
                <IconTag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}


      </div>
    </div>
  );
}
