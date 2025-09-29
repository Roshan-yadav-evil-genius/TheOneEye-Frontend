"use client";

import { Handle, Position } from "reactflow";
import { Badge } from "@/components/ui/badge";
import { 
  IconClock, 
  IconSettings, 
  IconCheck, 
  IconDatabase,
  IconMail,
  IconApi,
  IconFileText,
  IconX
} from "@tabler/icons-react";

interface CustomNodeProps {
  data: {
    label: string;
    type: string;
    status: string;
    category: string;
  };
  selected?: boolean;
}

const nodeIcons = {
  trigger: IconClock,
  action: IconSettings,
  logic: IconCheck,
  system: IconDatabase,
  communication: IconMail,
  data: IconDatabase,
  integration: IconApi,
  control: IconCheck,
};

const nodeColors = {
  trigger: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  action: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800",
  logic: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  system: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-gray-200 dark:border-gray-800",
  communication: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  data: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
  integration: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 border-pink-200 dark:border-pink-800",
  control: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
};

export function CustomNode({ data, selected }: CustomNodeProps) {
  const IconComponent = nodeIcons[data.type as keyof typeof nodeIcons] || IconSettings;
  const colorClass = nodeColors[data.type as keyof typeof nodeColors] || nodeColors.system;

  return (
    <div 
      className={`px-4 py-3 rounded-lg border-2 bg-card shadow-sm min-w-[120px] ${
        selected ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary"
      />
      
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <IconComponent className="h-4 w-4" />
          <span className="font-medium text-sm">{data.label}</span>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <Badge 
            variant="outline" 
            className={`text-xs ${colorClass}`}
          >
            {data.type}
          </Badge>
          
          <Badge 
            variant="outline" 
            className={`text-xs ${
              data.status === "active" 
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
            }`}
          >
            {data.status}
          </Badge>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary"
      />
    </div>
  );
}
