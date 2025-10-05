import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconDots,
  IconEdit,
  IconEye,
  IconTrash,
  IconTag,
  IconPhotoOff,
} from "@tabler/icons-react";
import { TNode } from "@/types";
import { formatNodeDate } from "@/lib/dates";
import { NodeTypeBadge } from "@/components/common/NodeTypeBadge";
import { renderNodeLogo, renderNodeGroupIcon } from "@/lib/node-render-utils";

interface NodesTableRowProps {
  node: TNode;
  columns: Array<{ id: string; label: string; visible: boolean }>;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function NodesTableRow({
  node,
  columns,
  isSelected,
  onSelect,
  onEdit,
  onView,
  onDelete,
}: NodesTableRowProps) {


  return (
    <TableRow>
      <TableCell className="w-12 min-w-[48px]">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
        />
      </TableCell>
      {columns.find(col => col.id === "name")?.visible && (
        <TableCell className="min-w-[200px]">
          <div className="flex items-center gap-3">
            {renderNodeLogo(node)}
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate">{node.name}</div>
              <div className="text-sm text-muted-foreground truncate">ID: {node.id}</div>
            </div>
          </div>
        </TableCell>
      )}
      {columns.find(col => col.id === "type")?.visible && (
        <TableCell className="min-w-[100px]">
          <NodeTypeBadge type={node.type} />
        </TableCell>
      )}
      {columns.find(col => col.id === "nodeGroup")?.visible && (
        <TableCell className="min-w-[120px]">
          <div className="flex items-center gap-2">
            {renderNodeGroupIcon(node)}
            <span className="truncate">{node.nodeGroupName}</span>
          </div>
        </TableCell>
      )}
      {columns.find(col => col.id === "description")?.visible && (
        <TableCell className="min-w-[200px]">
          <div className="truncate" title={node.description}>
            {node.description}
          </div>
        </TableCell>
      )}
      {columns.find(col => col.id === "version")?.visible && (
        <TableCell className="min-w-[80px]">
          <Badge variant="secondary" className="text-xs">
            {node.version}
          </Badge>
        </TableCell>
      )}
      {columns.find(col => col.id === "updatedAt")?.visible && (
        <TableCell className="text-sm text-muted-foreground min-w-[100px]">
          {formatNodeDate(node.updatedAt)}
        </TableCell>
      )}
      {columns.find(col => col.id === "tags")?.visible && (
        <TableCell className="min-w-[150px]">
          <div className="flex flex-wrap gap-1">
            {node.tags?.slice(0, 2).map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <IconTag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {node.tags && node.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{node.tags.length - 2}
              </Badge>
            )}
          </div>
        </TableCell>
      )}
      <TableCell className="w-12 min-w-[48px]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <IconDots className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(node.id)}>
              <IconEye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(node.id)}>
              <IconEdit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete?.(node.id)}
              className="text-destructive focus:text-destructive"
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
