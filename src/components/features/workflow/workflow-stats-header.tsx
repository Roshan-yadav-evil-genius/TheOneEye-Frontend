"use client";

import React from "react";
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
  IconRoute,
  IconRoute2,
  IconMinus,
  IconCircle,
  IconMap,
  IconMapOff
} from "@tabler/icons-react";
import { formatRelativeDate } from "@/lib/dates";
import { WorkflowTypeBadge } from "@/components/ui/workflow-type-badge";
import { WorkflowType } from "@/types/common/constants";

interface WorkflowStatsHeaderProps {
  isRunning: boolean;
  onStart: () => Promise<void>;
  onStop: () => Promise<void>;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  lineType: string;
  onLineTypeChange: (type: string) => void;
  showMinimap: boolean;
  onMinimapToggle: () => void;
  workflowId?: string;
  workflow?: {
    runs_count: number;
    last_run?: string | null;
    status: string;
    workflow_type?: WorkflowType;
  } | null;
}

const lineTypeOptions = [
  { value: 'straight', label: 'Straight', icon: IconMinus, description: 'Direct lines' },
  { value: 'step', label: 'Step', icon: IconRoute, description: 'Ladder style' },
  { value: 'smoothstep', label: 'Smooth Step', icon: IconRoute2, description: 'Curved steps' },
  { value: 'smooth', label: 'Smooth', icon: IconCircle, description: 'Curved lines' },
];

export function WorkflowStatsHeader({ isRunning, onStart, onStop, isSidebarCollapsed, onToggleSidebar, lineType, onLineTypeChange, showMinimap, onMinimapToggle, workflow }: WorkflowStatsHeaderProps) {
  // Get status badge based on workflow status
  const getStatusBadge = () => {
    if (isRunning) {
      return (
        <>
          <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-0.5">
            Running
          </Badge>
        </>
      );
    }
    
    if (!workflow) {
      return (
        <>
          <div className="h-1.5 w-1.5 bg-gray-400 rounded-full"></div>
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 text-xs px-2 py-0.5">
            Stopped
          </Badge>
        </>
      );
    }
    
    const status = workflow.status;
    if (status === 'active') {
      return (
        <>
          <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-0.5">
            Active
          </Badge>
        </>
      );
    }
    if (status === 'error') {
      return (
        <>
          <div className="h-1.5 w-1.5 bg-red-500 rounded-full"></div>
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs px-2 py-0.5">
            Error
          </Badge>
        </>
      );
    }
    return (
      <>
        <div className="h-1.5 w-1.5 bg-gray-400 rounded-full"></div>
        <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 text-xs px-2 py-0.5">
          Inactive
        </Badge>
      </>
    );
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
            {workflow && (
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold">{workflow.runs_count.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Runs</div>
              </div>
            )}
          </div>
        </div>

        {/* Status and Controls */}
        <div className="flex items-center gap-2">
          {/* Workflow Type Badge */}
          {workflow?.workflow_type && (
            <WorkflowTypeBadge 
              workflowType={workflow.workflow_type} 
              size="sm"
              showTooltip={true}
            />
          )}

          {/* Status Badge */}
          <div className="flex items-center gap-1">
            {getStatusBadge()}
          </div>

          {/* Last Run Info - Hide when workflow is active or running */}
          {workflow && !isRunning && workflow.status !== 'active' && (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <IconClock className="h-3 w-3" />
              <span>Last: {workflow.last_run ? formatRelativeDate(workflow.last_run) : "Never"}</span>
            </div>
          )}

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
              onClick={isRunning ? onStop : onStart}
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
    </div>
  );
}
