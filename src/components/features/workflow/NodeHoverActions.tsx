import React from "react";
import { Button } from "@/components/ui/button";
import { 
  IconPlayerPlay,
  IconTrash,
  IconPower,
  IconDots,
  IconEdit
} from "@tabler/icons-react";

interface NodeHoverActionsProps {
  onEdit: (e: React.MouseEvent) => void;
  onPlay: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onShutdown: (e: React.MouseEvent) => void;
  onMore: (e: React.MouseEvent) => void;
}

export function NodeHoverActions({
  onEdit,
  onPlay,
  onDelete,
  onShutdown,
  onMore
}: NodeHoverActionsProps) {
  return (
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex gap-1 bg-background border border-border rounded-md shadow-lg p-1">
      <Button
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20"
        onClick={onEdit}
      >
        <IconEdit className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20"
        onClick={onPlay}
      >
        <IconPlayerPlay className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
        onClick={onDelete}
      >
        <IconTrash className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-900/20"
        onClick={onShutdown}
      >
        <IconPower className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-900/20"
        onClick={onMore}
      >
        <IconDots className="h-3 w-3" />
      </Button>
    </div>
  );
}
