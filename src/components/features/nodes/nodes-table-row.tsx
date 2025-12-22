"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { TNodeMetadata } from "@/types";
import { getBadgeStyles } from "@/constants/node-styles";
import { NodeLogo } from "@/components/common/node-logo";

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
}

export function NodesTableRow({
  node,
  columns,
  isSelected,
  onSelect,
  onViewForm,
  onExecute,
}: NodesTableRowProps) {
  const getTypeBadge = (type: string) => {
    const styles = getBadgeStyles(type);
    return <Badge className={`${styles.bg} ${styles.text} border`}>{type}</Badge>;
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

  const handleDoubleClick = () => {
    if (node.has_form) {
      onViewForm?.(node);
    } else {
      onExecute?.(node);
    }
  };

  return (
    <TableRow onDoubleClick={handleDoubleClick} className="cursor-pointer">
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
        />
      </TableCell>
      {columns.find(col => col.id === "name")?.visible && (
        <TableCell>
          <div className="flex items-center gap-3">
            <NodeLogo node={node} size="md" />
            <div>
              <div className="font-medium">{node.label || node.name}</div>
              <div className="text-sm text-muted-foreground font-mono">
                {node.identifier}
              </div>
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
    </TableRow>
  );
}

