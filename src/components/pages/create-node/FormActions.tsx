"use client";

import { Button } from "@/components/ui/button";
import { IconEye, IconDeviceFloppy } from "@tabler/icons-react";

interface FormActionsProps {
  isCreating: boolean;
  onPreview: () => void;
  onSave: () => void;
  formData: any;
}

export function FormActions({ isCreating, onPreview, onSave, formData }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onPreview}
        className="flex items-center gap-2"
      >
        <IconEye className="h-4 w-4" />
        Preview
      </Button>
      <Button
        type="submit"
        disabled={isCreating}
        onClick={() => {
          console.log("Current form data:", formData);
          onSave();
        }}
        className="flex items-center gap-2"
      >
        <IconDeviceFloppy className="h-4 w-4" />
        {isCreating ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
