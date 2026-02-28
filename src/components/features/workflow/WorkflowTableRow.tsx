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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  IconDots,
  IconPlayerPlay,
  IconPlayerStop,
  IconEdit,
  IconSettings,
  IconTrash,
  IconInfoCircle,
  IconCopy,
} from "@tabler/icons-react";
import { TWorkflow } from "@/types";
import { formatRelativeDate } from "@/lib/dates";
import { WorkflowTypeBadge } from "@/components/ui/workflow-type-badge";
import { WorkflowType } from "@/types/common/constants";

interface WorkflowTableRowProps {
  workflow: TWorkflow;
  columns: Array<{ id: string; label: string; visible: boolean }>;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onRun?: (id: string) => void;
  onStop?: (id: string) => void;
  onEditInfo?: (workflow: TWorkflow) => void;
  onEditWorkflow?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function WorkflowTableRow({
  workflow,
  columns,
  isSelected,
  onSelect,
  onRun,
  onStop,
  onEditInfo,
  onEditWorkflow,
  onDuplicate,
  onDelete,
}: WorkflowTableRowProps) {
  const getStatusBadge = (status: "active" | "inactive" | "error") => {
    if (status === "active") {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
          Active
        </Badge>
      );
    }
    if (status === "error") {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
          Error
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-gray-600 border-gray-300 dark:text-gray-400 dark:border-gray-600">
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-1" />
        Inactive
      </Badge>
    );
  };

  const handleDoubleClick = () => {
    onEditWorkflow?.(workflow.id);
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
          <div className="flex items-center gap-2">
            {workflow.description && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconInfoCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  {workflow.description}
                </TooltipContent>
              </Tooltip>
            )}
            <span className="font-medium">{workflow.name}</span>
          </div>
        </TableCell>
      )}
      {columns.find(col => col.id === "status")?.visible && (
        <TableCell>{getStatusBadge(workflow.status)}</TableCell>
      )}
      {columns.find(col => col.id === "category")?.visible && (
        <TableCell>
          <Badge variant="secondary">{workflow.category || "Uncategorized"}</Badge>
        </TableCell>
      )}
      {columns.find(col => col.id === "workflowType")?.visible && (
        <TableCell>
          {workflow.workflow_type ? (
            <WorkflowTypeBadge 
              workflowType={workflow.workflow_type} 
              size="sm" 
              showTooltip={false}
            />
          ) : (
            <WorkflowTypeBadge 
              workflowType={WorkflowType.PRODUCTION} 
              size="sm" 
              showTooltip={false}
            />
          )}
        </TableCell>
      )}
      {columns.find(col => col.id === "tags")?.visible && (
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {(workflow.tags ?? []).length > 0 ? (
              (workflow.tags ?? []).map((tag, idx) => (
                <Badge key={`${tag}-${idx}`} variant="secondary" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">—</span>
            )}
          </div>
        </TableCell>
      )}
      {columns.find(col => col.id === "lastRun")?.visible && (
        <TableCell className="text-sm text-muted-foreground">
          {formatRelativeDate(workflow.lastRun)}
        </TableCell>
      )}
      {columns.find(col => col.id === "nextRun")?.visible && (
        <TableCell className="text-sm text-muted-foreground">
          {workflow.nextRun || "Not scheduled"}
        </TableCell>
      )}
      {columns.find(col => col.id === "runsCount")?.visible && (
        <TableCell className="text-sm">
          {workflow.runsCount.toLocaleString()}
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
            {workflow.status === "active" && (
              <DropdownMenuItem onClick={() => onStop?.(workflow.id)}>
                <IconPlayerStop className="mr-2 h-4 w-4" />
                Stop
              </DropdownMenuItem>
            )}
            {(workflow.status === "inactive" || workflow.status === "error") && (
              <DropdownMenuItem onClick={() => onRun?.(workflow.id)}>
                <IconPlayerPlay className="mr-2 h-4 w-4" />
                Run Now
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onEditInfo?.(workflow)}>
              <IconSettings className="mr-2 h-4 w-4" />
              Edit Info
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditWorkflow?.(workflow.id)}>
              <IconEdit className="mr-2 h-4 w-4" />
              Edit Workflow
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate?.(workflow.id)}>
              <IconCopy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete?.(workflow.id)}
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
