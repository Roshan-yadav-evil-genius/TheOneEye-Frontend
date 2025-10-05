"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NodeEditDialog } from "./node-edit-dialog";
import { nodeColors } from "@/constants/node-styles";
import { NodeIcon } from "./node-icon";
import { 
  IconPlayerPlay,
  IconTrash,
  IconPower,
  IconDots,
  IconEdit
} from "@tabler/icons-react";

export interface CustomNodeData {
  label: string;
  type: string;
  status: string;
  category: string;
  description?: string;
  formConfiguration?: Record<string, unknown>;
  logo?: string;
  nodeGroupIcon?: string;
  nodeGroupName?: string;
}

interface CustomNodeProps {
  id: string;
  data: CustomNodeData;
  selected?: boolean;
  onDelete?: (nodeId: string) => void;
}

export function CustomNode({ id, data, selected, onDelete }: CustomNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [userDescription, setUserDescription] = useState(data.description || "");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
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
    setIsEditingDescription(true);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDescription(e.target.value);
  };

  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
    // Here you could save the description to your state management or API
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingDescription(false);
    }
    if (e.key === 'Escape') {
      setUserDescription(data.description || "");
      setIsEditingDescription(false);
    }
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
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-1 bg-background border border-border rounded-md shadow-lg p-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20"
            onClick={handleEdit}
          >
            <IconEdit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20"
            onClick={handlePlay}
          >
            <IconPlayerPlay className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
            onClick={handleDelete}
          >
            <IconTrash className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-900/20"
            onClick={handleShutdown}
          >
            <IconPower className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-900/20"
            onClick={handleMore}
          >
            <IconDots className="h-3 w-3" />
          </Button>
        </div>
      )}

        {/* Node Content - Just Icon */}
        <div className="flex items-center justify-center h-full">
          <NodeIcon
            logo={data.logo}
            nodeGroupIcon={data.nodeGroupIcon}
            nodeGroupName={data.nodeGroupName}
            size="md"
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
              onBlur={handleDescriptionBlur}
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
