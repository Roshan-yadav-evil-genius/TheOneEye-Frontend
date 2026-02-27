"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteBrowserPoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  poolName: string;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteBrowserPoolDialog({
  open,
  onOpenChange,
  poolName,
  onConfirm,
  isDeleting,
}: DeleteBrowserPoolDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Browser Pool</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the pool &quot;{poolName}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
