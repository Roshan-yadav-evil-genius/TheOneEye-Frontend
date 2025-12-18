"use client";

import React, { useState } from 'react';
import { TNodeTree, TNodeFolder } from '@/types';
import { DraggableNodeItem } from './draggable-node-item';
import { countNodesInFolder } from '@/hooks/useNodeTree';
import { IconChevronRight, IconFolder, IconFolderOpen } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface NodeCategoryTreeProps {
  nodeTree: TNodeTree;
  searchTerm?: string;
}

interface CategoryItemProps {
  name: string;
  folder: TNodeFolder;
  level?: number;
  defaultExpanded?: boolean;
}

/**
 * Get category icon based on name
 */
function getCategoryIcon(name: string, isOpen: boolean): React.ReactNode {
  // You can customize icons per category here
  const iconClass = "w-4 h-4 flex-shrink-0";
  
  if (isOpen) {
    return <IconFolderOpen className={cn(iconClass, "text-amber-400")} />;
  }
  return <IconFolder className={cn(iconClass, "text-muted-foreground")} />;
}

/**
 * A single expandable category item with its nodes and subfolders
 */
function CategoryItem({ name, folder, level = 0, defaultExpanded = false }: CategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const nodeCount = countNodesInFolder(folder);
  
  const hasContent = folder.nodes.length > 0 || Object.keys(folder.subfolders).length > 0;
  
  if (!hasContent) {
    return null;
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="select-none">
      {/* Category Header */}
      <button
        onClick={toggleExpand}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-2 rounded-md",
          "hover:bg-muted/50 transition-colors duration-150",
          "text-left group"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <IconChevronRight 
          size={14} 
          className={cn(
            "text-muted-foreground transition-transform duration-200 flex-shrink-0",
            isExpanded && "rotate-90"
          )} 
        />
        {getCategoryIcon(name, isExpanded)}
        <span className="text-sm font-medium text-foreground truncate flex-1">
          {name}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          ({nodeCount})
        </span>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-1 space-y-1">
          {/* Direct Nodes */}
          {folder.nodes.length > 0 && (
            <div 
              className="space-y-1"
              style={{ paddingLeft: `${(level + 1) * 12 + 16}px` }}
            >
              {folder.nodes.map((node) => (
                <DraggableNodeItem key={node.identifier} node={node} />
              ))}
            </div>
          )}

          {/* Subfolders */}
          {Object.entries(folder.subfolders).map(([subName, subFolder]) => (
            <CategoryItem
              key={subName}
              name={subName}
              folder={subFolder}
              level={level + 1}
              defaultExpanded={defaultExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Main component that renders the entire node category tree
 */
export function NodeCategoryTree({ nodeTree, searchTerm }: NodeCategoryTreeProps) {
  const categories = Object.entries(nodeTree);
  
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <IconFolder className="w-10 h-10 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">
          {searchTerm ? 'No nodes match your search' : 'No nodes available'}
        </p>
      </div>
    );
  }

  // When searching, expand categories by default
  const shouldExpandByDefault = Boolean(searchTerm && searchTerm.trim());

  return (
    <div className="space-y-1">
      {categories.map(([categoryName, folder]) => (
        <CategoryItem
          key={categoryName}
          name={categoryName}
          folder={folder}
          defaultExpanded={shouldExpandByDefault}
        />
      ))}
    </div>
  );
}

