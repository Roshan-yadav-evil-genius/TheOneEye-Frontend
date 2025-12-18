"use client";

import { useState, useCallback, useMemo } from "react";
import { Handle, Position } from "reactflow";
import { NodeExecuteDialog } from "@/components/features/nodes/node-execute-dialog";
import { NodeHoverActions } from "./NodeHoverActions";
import { getNodeColor } from "@/constants/node-styles";
import { NodeLogo } from "@/components/common/node-logo";
import { BackendWorkflowNode, TNodeMetadata } from "@/types";
import { IconGripVertical } from "@tabler/icons-react";

interface CustomNodeProps {
  id: string;
  data: BackendWorkflowNode;
  selected?: boolean;
  onDelete?: (nodeId: string) => void;
}

export function CustomNode({ id, data, selected, onDelete }: CustomNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const colorClass = getNodeColor(data.node_type?.type || '');

  // Convert BackendNodeType to TNodeMetadata for the execute dialog
  const nodeMetadata: TNodeMetadata = useMemo(() => ({
    name: data.node_type?.name || 'Unknown',
    identifier: data.node_type?.identifier || '',
    type: data.node_type?.type || 'unknown',
    label: data.node_type?.label,
    description: data.node_type?.description,
    has_form: data.node_type?.has_form ?? false,
    category: data.node_type?.category,
  }), [data.node_type]);

  // Get port configurations with defaults
  const inputPorts = data.node_type?.input_ports || [{ id: 'default', label: 'In' }];
  const outputPorts = data.node_type?.output_ports || [{ id: 'default', label: 'Out' }];

  // Event handlers
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(id);
  }, [id, onDelete]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditDialogOpen(true);
  }, []);

  // Placeholder handlers for future functionality
  const handlePlay = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement node execution
  }, []);

  const handlePause = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement pause functionality
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Node Container */}
      <div 
        className={`relative w-32 h-24 rounded-lg border-2 bg-card shadow-sm transition-all duration-200 ${
          selected ? "ring-2 ring-primary ring-offset-2" : ""
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

        {/* Input Handles */}
        {inputPorts.map((port, idx) => (
          <Handle
            key={port.id}
            type="target"
            position={Position.Left}
            className="w-3 h-3 bg-primary border-2 border-background hover:bg-primary/80 transition-colors"
            style={{ 
              left: -6,
              top: `${((idx + 1) / (inputPorts.length + 1)) * 100}%`
            }}
            id={port.id}
            title={port.label}
          />
        ))}

        {/* Output Handles */}
        {outputPorts.map((port, idx) => (
          <Handle
            key={port.id}
            type="source"
            position={Position.Right}
            className="w-3 h-3 bg-primary border-2 border-background hover:bg-primary/80 transition-colors"
            style={{ 
              right: -6,
              top: `${((idx + 1) / (outputPorts.length + 1)) * 100}%`
            }}
            id={port.id}
            title={port.label}
          />
        ))}

        {/* Hover Actions */}
        {isHovered && (
          <NodeHoverActions
            onEdit={handleEdit}
            onPlay={handlePlay}
            onPause={handlePause}
            onDelete={handleDelete}
            isExecuting={false}
            isPolling={false}
          />
        )}

        {/* Node Content - Just Icon */}
        <div className="flex items-center justify-center h-full">
          <NodeLogo
            node={{
              name: data.node_type?.name || 'Unknown',
              type: data.node_type?.type || 'unknown',
            }}
            size="lg"
          />
        </div>
      </div>

      {/* External Title */}
      <div className="mt-2 text-center max-w-40">
        <h3 className="font-semibold text-sm text-foreground leading-tight">
          {data.node_type?.name || 'Unknown Node'}
        </h3>
      </div>

      {/* Edit Dialog */}
      <NodeExecuteDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        node={nodeMetadata}
      />
    </div>
  );
}
