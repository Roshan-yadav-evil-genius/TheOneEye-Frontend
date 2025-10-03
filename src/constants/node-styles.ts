// Shared node styling constants for consistency across components

import { 
  IconDatabase, 
  IconMail, 
  IconApi, 
  IconFileText, 
  IconClock, 
  IconCheck, 
  IconSettings,
  IconCloud,
  IconServer,
  IconCode,
  IconShield,
  IconUsers,
  IconChartBar,
  IconWorld
} from "@tabler/icons-react";

export const nodeColors = {
  trigger: "border-blue-400 bg-blue-50 dark:bg-blue-950/20",
  action: "border-green-400 bg-green-50 dark:bg-green-950/20",
  logic: "border-purple-400 bg-purple-50 dark:bg-purple-950/20",
  system: "border-gray-400 bg-gray-50 dark:bg-gray-950/20",
  communication: "border-orange-400 bg-orange-50 dark:bg-orange-950/20",
  data: "border-cyan-400 bg-cyan-50 dark:bg-cyan-950/20",
  integration: "border-pink-400 bg-pink-50 dark:bg-pink-950/20",
  control: "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/20",
} as const;

export const iconColors = {
  trigger: "text-blue-600 dark:text-blue-400",
  action: "text-green-600 dark:text-green-400",
  logic: "text-purple-600 dark:text-purple-400",
  system: "text-gray-600 dark:text-gray-400",
  communication: "text-orange-600 dark:text-orange-400",
  data: "text-cyan-600 dark:text-cyan-400",
  integration: "text-pink-600 dark:text-pink-400",
  control: "text-indigo-600 dark:text-indigo-400",
} as const;

export type NodeType = keyof typeof nodeColors;

// Category icon mapping for consistency across components
export const categoryIcons = {
  system: IconDatabase,
  email: IconMail,
  database: IconDatabase,
  api: IconApi,
  logic: IconCheck,
  control: IconClock,
  file: IconFileText,
  communication: IconMail,
  data: IconDatabase,
  integration: IconApi,
  cloud: IconCloud,
  server: IconServer,
  code: IconCode,
  security: IconShield,
  user: IconUsers,
  analytics: IconChartBar,
  web: IconWorld,
} as const;

export type CategoryType = keyof typeof categoryIcons;

// Helper function to get node colors
export const getNodeColors = (nodeType: string) => {
  const type = nodeType as NodeType;
  return {
    colorClass: nodeColors[type] || nodeColors.system,
    iconColorClass: iconColors[type] || iconColors.system,
  };
};

// Helper function to get category icon
export const getCategoryIcon = (category: string) => {
  const cat = category as CategoryType;
  return categoryIcons[cat] || IconSettings;
};
