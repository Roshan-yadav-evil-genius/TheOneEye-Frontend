"use client";

import { TBrowserPool } from "@/types/browser-pool";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDots, IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";

interface BrowserPoolTableProps {
  pools: TBrowserPool[];
  onEdit: (pool: TBrowserPool) => void;
  onDelete: (pool: TBrowserPool) => void;
  onCreate: () => void;
}

export function BrowserPoolTable({
  pools,
  onEdit,
  onDelete,
  onCreate,
}: BrowserPoolTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Browser Pools</h2>
        <Button onClick={onCreate}>
          <IconPlus className="mr-2 h-4 w-4" />
          Create Pool
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Sessions</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools.map((pool, index) => (
              <TableRow key={pool.id || `pool-${index}`}>
                <TableCell className="font-medium">{pool.name}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {pool.description ?? "—"}
                </TableCell>
                <TableCell>{pool.session_ids?.length ?? 0}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <IconDots className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(pool)}>
                        <IconEdit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(pool)}
                        className="text-red-600"
                      >
                        <IconTrash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
