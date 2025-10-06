"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NodePreview } from "./NodePreview";
import { BackendNodeType } from "@/types/api/backend";

interface NodePreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  nodeData: Partial<BackendNodeType>;
  logoPreview?: string | null;
}

export function NodePreviewDialog({ 
  isOpen, 
  onOpenChange, 
  nodeData, 
  logoPreview 
}: NodePreviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Node Preview</DialogTitle>
        </DialogHeader>
        <NodePreview 
          nodeData={nodeData} 
          logoPreview={logoPreview}
        />
      </DialogContent>
    </Dialog>
  );
}
