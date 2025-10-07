"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { Input } from "@/components/ui/input";
import { NodeEditDialog } from "./node-edit-dialog";
import { NodeHoverActions } from "./NodeHoverActions";
import { nodeColors } from "@/constants/node-styles";
import { NodeLogo } from "@/components/common/node-logo";
import { BackendWorkflowNode } from "@/types";

interface CustomNodeProps {
  id: string;
  data: {backendWorkflowNode:BackendWorkflowNode};
  selected?: boolean;
  onDelete?: (nodeId: string) => void;
}

export function CustomNode({ id, data, selected, onDelete }: CustomNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  console.log(data.backendWorkflowNode)
  const colorClass = nodeColors[data.backendWorkflowNode.node_type?.type as keyof typeof nodeColors] || nodeColors.system;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
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
        } ${colorClass}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
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
        />
      )}

        {/* Node Content - Just Icon */}
        <div className="flex items-center justify-center h-full">
          <NodeLogo
            node={{
              id: id,
              name: data.backendWorkflowNode.node_type?.name || 'Unknown',
              type: data.backendWorkflowNode.node_type?.type || 'unknown',
              logo: data.backendWorkflowNode.node_type?.logo,
              nodeGroupIcon: data.backendWorkflowNode.node_type?.node_group?.icon,
              nodeGroupName: data.backendWorkflowNode.node_type?.node_group?.name,
            } as any}
            size="lg"
          />
        </div>


      </div>

      {/* External Title and Description */}
      <div className="mt-2 text-center max-w-40">
        <h3 className="font-semibold text-sm text-foreground leading-tight">
          {data.backendWorkflowNode.node_type?.name || 'Unknown Node'}
        </h3>

      </div>

      {/* Edit Dialog */}
      <NodeEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        nodeData={data.backendWorkflowNode}
      />
    </div>
  );
}
