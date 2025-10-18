"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { NodeEditDialog } from "./node-edit-dialog";
import { NodeHoverActions } from "./NodeHoverActions";
import { nodeColors } from "@/constants/node-styles";
import { NodeLogo } from "@/components/common/node-logo";
import { BackendWorkflowNode } from "@/types";
import { ApiService } from "@/lib/api/api-service";
import { useTaskStatus } from "@/hooks/useTaskStatus";
import { toast } from "sonner";
import { IconGripVertical } from "@tabler/icons-react";

interface CustomNodeProps {
  id: string;
  data: BackendWorkflowNode;
  selected?: boolean;
  onDelete?: (nodeId: string) => void;
  workflowId?: string;
}

export function CustomNode({ id, data, selected, onDelete, workflowId }: CustomNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastExecutionResult, setLastExecutionResult] = useState<any>(null);
  
  const colorClass = nodeColors[data.node_type?.type as keyof typeof nodeColors] || nodeColors.system;

  const { startPolling, stopPolling, isPolling, status } = useTaskStatus({
    onSuccess: (result) => {
      setLastExecutionResult(result);
      const nodeName = data.node_type?.name || 'Unknown Node';
      toast.success(`${nodeName} executed successfully!`, {
        description: `Result: ${JSON.stringify(result, null, 2).substring(0, 100)}...`,
        duration: 5000,
      });
    },
    onError: (error) => {
      const nodeName = data.node_type?.name || 'Unknown Node';
      toast.error(`${nodeName} execution failed`, {
        description: error,
        duration: 5000,
      });
    },
    onComplete: () => {
      setIsExecuting(false);
    }
  });

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!workflowId) {
      toast.error("Workflow ID not available");
      return;
    }
    
    if (isExecuting || isPolling) {
      return; // Prevent multiple executions
    }
    
    try {
      setIsExecuting(true);
      const nodeName = data.node_type?.name || 'Unknown Node';
      
      toast.info(`Starting execution of ${nodeName}...`);
      
      const result = await ApiService.executeSingleNode(workflowId, id);
      
      if (result.task_id) {
        toast.info(`Execution started for ${nodeName}. Polling for results...`);
        startPolling(result.task_id);
      } else {
        throw new Error('No task ID returned from server');
      }
      
    } catch (error) {
      setIsExecuting(false);
      toast.error(`Failed to execute ${data.node_type?.name || 'node'}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleShutdown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleMore = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  };


  return (
    <div className="flex flex-col items-center">
      {/* Node Container */}
      <div 
        className={`relative w-32 h-24 rounded-lg border-2 bg-card shadow-sm transition-all duration-200 ${
          selected ? "ring-2 ring-primary ring-offset-2" : ""
        } ${
          isExecuting || isPolling ? "ring-2 ring-blue-500 animate-pulse" : ""
        } ${
          lastExecutionResult ? "ring-2 ring-green-500" : ""
        } ${colorClass}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
      {/* Drag Handle */}
      <div 
        className="drag-handle absolute top-1 left-1 w-4 h-4 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-60 hover:opacity-100 transition-opacity z-10"
        title="Drag to move node"
      >
        <IconGripVertical className="w-3 h-3 text-muted-foreground" />
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-primary border-2 border-background hover:bg-primary/80 transition-colors"
        style={{ left: -6 }}
        id="target"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-primary border-2 border-background hover:bg-primary/80 transition-colors"
        style={{ right: -6 }}
        id="source"
      />

      {/* Hover Actions */}
      {isHovered && (
        <NodeHoverActions
          onEdit={handleEdit}
          onPlay={handlePlay}
          onDelete={handleDelete}
          onShutdown={handleShutdown}
          onMore={handleMore}
          isExecuting={isExecuting}
        />
      )}

        {/* Node Content - Just Icon */}
        <div className="flex items-center justify-center h-full">
          <NodeLogo
            node={{
              id: id,
              name: data.node_type?.name || 'Unknown',
              type: data.node_type?.type || 'unknown',
              logo: data.node_type?.logo,
              nodeGroupIcon: data.node_type?.node_group?.icon,
              nodeGroupName: data.node_type?.node_group?.name,
            } as any}
            size="lg"
          />
        </div>


      </div>

      {/* External Title and Description */}
      <div className="mt-2 text-center max-w-40">
        <h3 className="font-semibold text-sm text-foreground leading-tight">
          {data.node_type?.name || 'Unknown Node'}
        </h3>
        
        {/* Execution Status Indicator */}
        {(isExecuting || isPolling) && (
          <div className="mt-1 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="ml-1 text-xs text-blue-600">
              {isExecuting ? 'Starting...' : 'Executing...'}
            </span>
          </div>
        )}
        
        {lastExecutionResult && !isExecuting && !isPolling && (
          <div className="mt-1 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="ml-1 text-xs text-green-600">Completed</span>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <NodeEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        data={data}
        workflowId={workflowId || ''}
      />
    </div>
  );
}
