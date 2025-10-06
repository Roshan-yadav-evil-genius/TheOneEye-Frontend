"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NodeEditDialog } from "./node-edit-dialog";
import { NodeHoverActions } from "./NodeHoverActions";
import { nodeColors } from "@/constants/node-styles";
import { NodeLogo } from "@/components/common/node-logo";
import { useDescriptionEditing } from "@/hooks/useDescriptionEditing";
import { TNodeTemplate } from "@/types";

export interface CustomNodeData {
  label: string;
  type: string;
  status: string;
  description?: string;
  formConfiguration?: Record<string, unknown>;
  logo?: string;
  nodeGroupIcon?: string;
  nodeGroupName?: string;
  node_type?: {
    id: string;
    name: string;
    type: string;
    description?: string;
    logo?: string;
    form_configuration: Record<string, unknown>;
    tags: string[];
    node_group: {
      id: string;
      name: string;
      description?: string;
      icon?: string;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
    version: string;
    is_active: boolean;
    created_by?: string;
    created_at: string;
    updated_at: string;
  };
  node_template?: TNodeTemplate | null;
}

interface CustomNodeProps {
  id: string;
  data: CustomNodeData;
  selected?: boolean;
  onDelete?: (nodeId: string) => void;
}

export function CustomNode({ id, data, selected, onDelete }: CustomNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Use description editing hook for better separation of concerns
  const {
    isEditing: isEditingDescription,
    userDescription,
    startEditing: startDescriptionEditing,
    stopEditing: stopDescriptionEditing,
    handleDescriptionChange,
    handleKeyDown: handleDescriptionKeyDown
  } = useDescriptionEditing({
    initialDescription: data.description || "",
    onSave: (description) => {
      // Here you could save the description to your state management or API
      console.log('Description saved:', description);
    }
  });
  
  const colorClass = nodeColors[data.type as keyof typeof nodeColors] || nodeColors.system;

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

  const handleSaveEdit = (updatedData: {
    id: string;
    label: string;
    type: string;
    status: string;
    category: string;
    description?: string;
    formConfiguration?: Record<string, unknown>;
  }) => {
    // Here you would typically update the node data in your state management or API
    // You might want to update the parent component's state here
    console.log('Node updated:', updatedData);
  };

  const handleDescriptionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    startDescriptionEditing();
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
              name: data.label,
              type: data.type,
              logo: data.node_type?.logo,
              nodeGroupIcon: data.nodeGroupIcon,
              nodeGroupName: data.nodeGroupName,
            } as any}
            size="lg"
          />
        </div>

        {/* Status Indicator */}
        {data.status === "active" && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        )}
      </div>

      {/* External Title and Description */}
      <div className="mt-2 text-center max-w-40">
        <h3 className="font-semibold text-sm text-foreground leading-tight">
          {data.label}
        </h3>
        <div className="mt-1">
          {isEditingDescription ? (
            <Input
              value={userDescription}
              onChange={handleDescriptionChange}
              onBlur={stopDescriptionEditing}
              onKeyDown={handleDescriptionKeyDown}
              placeholder="Add a comment..."
              className="text-xs h-6 px-2 py-1 text-center"
              autoFocus
            />
          ) : (
            <p 
              className="text-xs text-muted-foreground leading-tight cursor-pointer hover:text-foreground transition-colors min-h-[1rem]"
              onClick={handleDescriptionClick}
            >
              {userDescription || "Click to add comment..."}
            </p>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <NodeEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        nodeData={{ id, ...data }}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
