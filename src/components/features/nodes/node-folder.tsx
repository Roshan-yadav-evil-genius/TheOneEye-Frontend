"use client";

import { useState, useMemo } from "react";
import { TNodeFolder, TNodeMetadata } from "@/types";
import { NodeCard } from "./node-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { IconChevronDown, IconFolder, IconFolderOpen } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NodeFolderProps {
  name: string;
  folder: TNodeFolder;
  level?: number;
  defaultExpanded?: boolean;
  onViewForm?: (node: TNodeMetadata) => void;
  onExecute?: (node: TNodeMetadata) => void;
}

/**
 * Recursively count all nodes in a folder and its subfolders
 */
function countNodes(folder: TNodeFolder): number {
  let count = folder.nodes.length;
  for (const subfolder of Object.values(folder.subfolders)) {
    count += countNodes(subfolder);
  }
  return count;
}

/**
 * Recursive folder component that renders nodes and nested subfolders
 */
export function NodeFolder({
  name,
  folder,
  level = 0,
  defaultExpanded = true,
  onViewForm,
  onExecute,
}: NodeFolderProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const totalNodeCount = useMemo(() => countNodes(folder), [folder]);
  const hasNodes = folder.nodes.length > 0;
  const hasSubfolders = Object.keys(folder.subfolders).length > 0;

  // Calculate padding based on nesting level
  const paddingLeft = level * 16;

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={setIsExpanded}
      className={cn(
        "rounded-lg border bg-card",
        level > 0 && "border-l-2 border-l-primary/20"
      )}
    >
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center justify-between p-3 hover:bg-muted/50 transition-colors",
          level === 0 ? "rounded-t-lg" : "rounded-t-md"
        )}
        style={{ paddingLeft: `${12 + paddingLeft}px` }}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <IconFolderOpen className="h-4 w-4 text-primary" />
          ) : (
            <IconFolder className="h-4 w-4 text-primary" />
          )}
          <span className={cn(
            "font-medium",
            level === 0 ? "text-base" : "text-sm"
          )}>
            {name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {totalNodeCount} {totalNodeCount === 1 ? "node" : "nodes"}
          </Badge>
          <IconChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isExpanded ? "rotate-0" : "-rotate-90"
            )}
          />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div
          className="pb-3"
          style={{ paddingLeft: `${12 + paddingLeft}px`, paddingRight: "12px" }}
        >
          {/* Render subfolders first */}
          {hasSubfolders && (
            <div className="space-y-2 mt-2">
              {Object.entries(folder.subfolders)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([subfolderName, subfolder]) => (
                  <NodeFolder
                    key={subfolderName}
                    name={subfolderName}
                    folder={subfolder}
                    level={level + 1}
                    defaultExpanded={level < 1} // Only expand first 2 levels by default
                    onViewForm={onViewForm}
                    onExecute={onExecute}
                  />
                ))}
            </div>
          )}

          {/* Render nodes in this folder */}
          {hasNodes && (
            <div className={cn("mt-3", hasSubfolders && "pt-3 border-t")}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {folder.nodes.map((node) => (
                  <NodeCard
                    key={node.identifier}
                    node={node}
                    onViewForm={onViewForm}
                    onExecute={onExecute}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

