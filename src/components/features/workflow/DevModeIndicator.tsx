"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  IconContainer, 
  IconContainerOff, 
  IconRefresh, 
  IconInfoCircle,
  IconClock
} from '@tabler/icons-react';

interface DevModeIndicatorProps {
  isActive: boolean;
  status?: 'running' | 'stopped' | 'starting' | 'stopping';
  uptime?: number;
  onStop?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function DevModeIndicator({
  isActive,
  status = 'stopped',
  uptime,
  onStop,
  onRefresh,
  isLoading = false
}: DevModeIndicatorProps) {
  
  const formatUptime = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'stopped':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'starting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'stopping':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return <IconContainer className="w-3 h-3" />;
      case 'stopped':
        return <IconContainerOff className="w-3 h-3" />;
      case 'starting':
      case 'stopping':
        return <IconClock className="w-3 h-3 animate-spin" />;
      default:
        return <IconContainerOff className="w-3 h-3" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'running':
        return 'Dev Container Active';
      case 'stopped':
        return 'Dev Container Stopped';
      case 'starting':
        return 'Starting Dev Container...';
      case 'stopping':
        return 'Stopping Dev Container...';
      default:
        return 'Unknown Status';
    }
  };

  if (!isActive && status === 'stopped') {
    return null; // Don't show indicator when dev mode is not active
  }

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className={`${getStatusColor()} flex items-center gap-1`}>
              {getStatusIcon()}
              {getStatusText()}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <p className="font-medium">Development Mode</p>
              <p className="text-sm">Persistent container for single node execution</p>
              {status === 'running' && uptime && (
                <p className="text-sm">Uptime: {formatUptime(uptime)}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Click stop to clean up resources
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {onRefresh && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="h-6 w-6 p-0"
              >
                <IconRefresh className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh dev container status</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {onStop && status === 'running' && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onStop}
                disabled={isLoading}
                className="h-6 px-2 text-xs"
              >
                Stop Dev Mode
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Stop and remove the persistent dev container</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

