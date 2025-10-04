"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PanelLeftIcon } from "lucide-react";
import { 
  IconPlayerPlay, 
  IconSquare, 
  IconClock, 
  IconActivity,
  IconRoute,
  IconRoute2,
  IconMinus,
  IconCircle,
  IconMap,
  IconMapOff
} from "@tabler/icons-react";

interface WorkflowStatsHeaderProps {
  isRunning: boolean;
  onRunStop: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  lineType: string;
  onLineTypeChange: (type: string) => void;
  showMinimap: boolean;
  onMinimapToggle: () => void;
  workflowId?: string;
}

// Mock stats data - in a real app this would come from props or API
const mockStats = {
  totalRuns: 1247,
  successRate: 94.2,
  avgExecutionTime: "2.3s",
  activeWorkflows: 8,
  lastRun: "2 minutes ago",
  nextScheduled: "in 1 hour",
};

const lineTypeOptions = [
  { value: 'straight', label: 'Straight', icon: IconMinus, description: 'Direct lines' },
  { value: 'step', label: 'Step', icon: IconRoute, description: 'Ladder style' },
  { value: 'smoothstep', label: 'Smooth Step', icon: IconRoute2, description: 'Curved steps' },
  { value: 'smooth', label: 'Smooth', icon: IconCircle, description: 'Curved lines' },
];

export function WorkflowStatsHeader({ isRunning, onRunStop, isSidebarCollapsed, onToggleSidebar, lineType, onLineTypeChange, showMinimap, onMinimapToggle, workflowId }: WorkflowStatsHeaderProps) {
  const router = useRouter();

  const handleDetailsClick = () => {
    if (workflowId) {
      router.push(`/workflow/${workflowId}/details`);
    }
  };
  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between">
        {/* Stats Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="h-6 w-6"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <PanelLeftIcon className="h-3.5 w-3.5" />
            </Button>
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Total Runs */}
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold">{mockStats.totalRuns.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Runs</div>
            </div>

            {/* Success Rate */}
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                {mockStats.successRate}%
              </div>
              <div className="text-xs text-muted-foreground">Success</div>
            </div>

            {/* Avg Execution Time */}
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold">{mockStats.avgExecutionTime}</div>
              <div className="text-xs text-muted-foreground">Avg Time</div>
            </div>

            {/* Active Workflows */}
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold">{mockStats.activeWorkflows}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
          </div>
        </div>

        {/* Status and Controls */}
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <div className="flex items-center gap-1">
            {isRunning ? (
              <>
                <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-0.5">
                  Running
                </Badge>
              </>
            ) : (
              <>
                <div className="h-1.5 w-1.5 bg-gray-400 rounded-full"></div>
                <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 text-xs px-2 py-0.5">
                  Stopped
                </Badge>
              </>
            )}
          </div>

          {/* Last Run Info */}
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <IconClock className="h-3 w-3" />
            <span>Last: {mockStats.lastRun}</span>
          </div>

          {/* Line Type Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                title="Change line type"
              >
                {lineTypeOptions.find(option => option.value === lineType)?.icon && 
                  React.createElement(lineTypeOptions.find(option => option.value === lineType)!.icon, {
                    className: "h-3.5 w-3.5 text-blue-500 hover:text-blue-600"
                  })
                }
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {lineTypeOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => onLineTypeChange(option.value)}
                    className={lineType === option.value ? "bg-accent" : ""}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Minimap Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={onMinimapToggle}
            title={showMinimap ? "Hide minimap" : "Show minimap"}
          >
            {showMinimap ? (
              <IconMap className="h-3.5 w-3.5 text-green-500 hover:text-green-600" />
            ) : (
              <IconMapOff className="h-3.5 w-3.5 text-gray-500 hover:text-gray-600" />
            )}
          </Button>

          {/* Run/Stop Button */}
          <div className="flex items-center gap-1">
            <Button
              onClick={handleDetailsClick}
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              title="Details"
              disabled={!workflowId}
            >
              <IconActivity className="h-3.5 w-3.5 text-blue-500 hover:text-blue-600" />
            </Button>
            <Button
              onClick={onRunStop}
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              title={isRunning ? "Stop" : "Run"}
            >
              {isRunning ? (
                <IconSquare className="h-3.5 w-3.5 text-red-500 hover:text-red-600" />
              ) : (
                <IconPlayerPlay className="h-3.5 w-3.5 text-green-500 hover:text-green-600" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar (shown when running) */}
      {isRunning && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Execution Progress</span>
            <span>Step 3 of 7</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div 
              className="bg-primary h-1 rounded-full transition-all duration-300"
              style={{ width: "43%" }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
