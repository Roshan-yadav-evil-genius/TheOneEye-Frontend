"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconDots,
  IconPlayerPlay,
  IconSettings,
  IconEye,
} from "@tabler/icons-react";
import { TNodeMetadata } from "@/types";

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

interface NodesTableRowProps {
  node: TNodeMetadata;
  columns: ColumnConfig[];
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onViewForm?: (node: TNodeMetadata) => void;
  onExecute?: (node: TNodeMetadata) => void;
  onViewDetails?: (node: TNodeMetadata) => void;
}

export function NodesTableRow({
  node,
  columns,
  isSelected,
  onSelect,
  onViewForm,
  onExecute,
  onViewDetails,
}: NodesTableRowProps) {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "ProducerNode":
        return <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">{type}</Badge>;
      case "NonBlockingNode":
        return <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">{type}</Badge>;
      case "BlockingNode":
        return <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/30">{type}</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getHasFormBadge = (hasForm: boolean) => {
    if (hasForm) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
          Yes
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-gray-600 border-gray-300 dark:text-gray-400 dark:border-gray-600">
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-1" />
        No
      </Badge>
    );
  };

  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
        />
      </TableCell>
      {columns.find(col => col.id === "name")?.visible && (
        <TableCell>
          <div>
            <div className="font-medium">{node.label || node.name}</div>
            <div className="text-sm text-muted-foreground font-mono">
              {node.identifier}
            </div>
          </div>
        </TableCell>
      )}
      {columns.find(col => col.id === "type")?.visible && (
        <TableCell>
          {getTypeBadge(node.type)}
        </TableCell>
      )}
      {columns.find(col => col.id === "category")?.visible && (
        <TableCell>
          <Badge variant="outline">{node.category || "Uncategorized"}</Badge>
        </TableCell>
      )}
      {columns.find(col => col.id === "hasForm")?.visible && (
        <TableCell>{getHasFormBadge(node.has_form)}</TableCell>
      )}
      {columns.find(col => col.id === "description")?.visible && (
        <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
          {node.description || "-"}
        </TableCell>
      )}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <IconDots className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {node.has_form && (
              <DropdownMenuItem onClick={() => onViewForm?.(node)}>
                <IconSettings className="mr-2 h-4 w-4" />
                View Form
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onExecute?.(node)}>
              <IconPlayerPlay className="mr-2 h-4 w-4" />
              Execute
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewDetails?.(node)}>
              <IconEye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

