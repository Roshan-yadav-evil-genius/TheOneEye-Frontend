"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  IconCopy, 
  IconRefresh, 
  IconCheck, 
  IconX, 
  IconClock,
  IconInfoCircle
} from '@tabler/icons-react';
import { toast } from 'sonner';

interface NodeOutputDisplayProps {
  nodeId: string;
  nodeName: string;
  output?: any;
  inputPayload?: any;
  executionTime?: string;
  status?: 'success' | 'error' | 'pending';
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function NodeOutputDisplay({
  nodeId,
  nodeName,
  output,
  inputPayload,
  executionTime,
  status = 'success',
  onRefresh,
  isLoading = false
}: NodeOutputDisplayProps) {
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const formatJson = (data: any) => {
    if (!data) return 'No data';
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <IconCheck className="w-4 h-4 text-green-500" />;
      case 'error':
        return <IconX className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <IconClock className="w-4 h-4 text-yellow-500" />;
      default:
        return <IconInfoCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {getStatusIcon()}
            Node Output: {nodeName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor()}>
              {status.toUpperCase()}
            </Badge>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                <IconRefresh className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>
        </div>
        {executionTime && (
          <p className="text-sm text-muted-foreground">
            Last executed: {executionTime}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Input Payload Section */}
        {inputPayload && Object.keys(inputPayload).length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">Input Payload</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(formatJson(inputPayload), 'Input payload')}
                className="h-6 w-6 p-0"
              >
                <IconCopy className="w-3 h-3" />
              </Button>
            </div>
            <ScrollArea className="h-32 w-full rounded-md border bg-muted/50 p-3">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {formatJson(inputPayload)}
              </pre>
            </ScrollArea>
          </div>
        )}

        {/* Output Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-muted-foreground">Output</h4>
            {output && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(formatJson(output), 'Output')}
                className="h-6 w-6 p-0"
              >
                <IconCopy className="w-3 h-3" />
              </Button>
            )}
          </div>
          <ScrollArea className="h-48 w-full rounded-md border bg-muted/50 p-3">
            <pre className="text-xs font-mono whitespace-pre-wrap">
              {formatJson(output)}
            </pre>
          </ScrollArea>
        </div>

        {/* Node Information */}
        <Separator />
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Node ID:</strong> {nodeId}</p>
          <p><strong>Status:</strong> {status}</p>
          {output && (
            <p><strong>Output Keys:</strong> {Object.keys(output).join(', ')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

