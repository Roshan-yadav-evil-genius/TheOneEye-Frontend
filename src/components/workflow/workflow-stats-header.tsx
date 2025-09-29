"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  IconPlayerPlay, 
  IconSquare, 
  IconClock, 
  IconCheck, 
  IconX,
  IconActivity,
  IconTrendingUp,
  IconUsers,
  IconMenu2
} from "@tabler/icons-react";

interface WorkflowStatsHeaderProps {
  isRunning: boolean;
  onRunStop: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
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

export function WorkflowStatsHeader({ isRunning, onRunStop, isSidebarCollapsed, onToggleSidebar }: WorkflowStatsHeaderProps) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        {/* Stats Section */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="h-8 w-8 p-0"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <IconMenu2 className="h-4 w-4" />
            </Button>
            <IconActivity className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Workflow Stats</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Total Runs */}
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-lg font-semibold">{mockStats.totalRuns.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Runs</div>
              </div>
            </div>

            {/* Success Rate */}
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {mockStats.successRate}%
                </div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </div>
            </div>

            {/* Avg Execution Time */}
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-lg font-semibold">{mockStats.avgExecutionTime}</div>
                <div className="text-xs text-muted-foreground">Avg Time</div>
              </div>
            </div>

            {/* Active Workflows */}
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-lg font-semibold">{mockStats.activeWorkflows}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Status and Controls */}
        <div className="flex items-center gap-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {isRunning ? (
              <>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Running
                </Badge>
              </>
            ) : (
              <>
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                  Stopped
                </Badge>
              </>
            )}
          </div>

          {/* Last Run Info */}
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <IconClock className="h-4 w-4" />
              <span>Last: {mockStats.lastRun}</span>
            </div>
            {!isRunning && (
              <div className="flex items-center gap-1">
                <IconTrendingUp className="h-4 w-4" />
                <span>Next: {mockStats.nextScheduled}</span>
              </div>
            )}
          </div>

          {/* Run/Stop Button */}
          <Button
            onClick={onRunStop}
            variant={isRunning ? "destructive" : "default"}
            size="sm"
            className="min-w-[100px]"
          >
            {isRunning ? (
              <>
                <IconSquare className="mr-2 h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <IconPlayerPlay className="mr-2 h-4 w-4" />
                Run
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Progress Bar (shown when running) */}
      {isRunning && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Workflow Execution Progress</span>
            <span>Step 3 of 7</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: "43%" }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
