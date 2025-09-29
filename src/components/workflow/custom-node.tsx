"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { Button } from "@/components/ui/button";
import { 
  IconClock, 
  IconSettings, 
  IconCheck, 
  IconDatabase,
  IconMail,
  IconApi,
  IconFileText,
  IconPlayerPlay,
  IconTrash,
  IconPower,
  IconDots,
  IconSwitch
} from "@tabler/icons-react";

interface CustomNodeProps {
  data: {
    label: string;
    type: string;
    status: string;
    category: string;
    description?: string;
  };
  selected?: boolean;
}

const nodeIcons = {
  trigger: IconClock,
  action: IconSettings,
  logic: IconSwitch,
  system: IconDatabase,
  communication: IconMail,
  data: IconDatabase,
  integration: IconApi,
  control: IconCheck,
};

const nodeColors = {
  trigger: "border-blue-400 bg-blue-50 dark:bg-blue-950/20",
  action: "border-green-400 bg-green-50 dark:bg-green-950/20",
  logic: "border-purple-400 bg-purple-50 dark:bg-purple-950/20",
  system: "border-gray-400 bg-gray-50 dark:bg-gray-950/20",
  communication: "border-orange-400 bg-orange-50 dark:bg-orange-950/20",
  data: "border-cyan-400 bg-cyan-50 dark:bg-cyan-950/20",
  integration: "border-pink-400 bg-pink-50 dark:bg-pink-950/20",
  control: "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/20",
};

const iconColors = {
  trigger: "text-blue-600 dark:text-blue-400",
  action: "text-green-600 dark:text-green-400",
  logic: "text-purple-600 dark:text-purple-400",
  system: "text-gray-600 dark:text-gray-400",
  communication: "text-orange-600 dark:text-orange-400",
  data: "text-cyan-600 dark:text-cyan-400",
  integration: "text-pink-600 dark:text-pink-400",
  control: "text-indigo-600 dark:text-indigo-400",
};

export function CustomNode({ data, selected }: CustomNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = nodeIcons[data.type as keyof typeof nodeIcons] || IconSettings;
  const colorClass = nodeColors[data.type as keyof typeof nodeColors] || nodeColors.system;
  const iconColorClass = iconColors[data.type as keyof typeof iconColors] || iconColors.system;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Playing node: ${data.label}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Deleting node: ${data.label}`);
  };

  const handleShutdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Shutting down node: ${data.label}`);
  };

  const handleMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`More options for node: ${data.label}`);
  };

  return (
    <div 
      className={`relative w-32 h-24 rounded-lg border-2 bg-card shadow-sm transition-all duration-200 ${
        selected ? "ring-2 ring-primary ring-offset-2" : ""
      } ${colorClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-primary border-2 border-background"
        style={{ left: -6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-primary border-2 border-background"
        style={{ right: -6 }}
      />

      {/* Hover Actions */}
      {isHovered && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-1 bg-background border border-border rounded-md shadow-lg p-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20"
            onClick={handlePlay}
          >
            <IconPlayerPlay className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
            onClick={handleDelete}
          >
            <IconTrash className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-900/20"
            onClick={handleShutdown}
          >
            <IconPower className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-900/20"
            onClick={handleMore}
          >
            <IconDots className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Node Content */}
      <div className="flex flex-col items-center justify-center h-full p-2">
        {/* Center Icon */}
        <div className="flex-1 flex items-center justify-center">
          <IconComponent className={`h-8 w-8 ${iconColorClass}`} />
        </div>
        
        {/* Bottom Title and Description */}
        <div className="flex flex-col items-center text-center">
          <span className="font-medium text-xs text-foreground truncate w-full">
            {data.label}
          </span>
          {data.description && (
            <span className="text-xs text-muted-foreground truncate w-full mt-0.5">
              {data.description}
            </span>
          )}
        </div>
      </div>

      {/* Status Indicator */}
      {data.status === "active" && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
      )}
    </div>
  );
}
