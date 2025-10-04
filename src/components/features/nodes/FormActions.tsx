import { Button } from "@/components/ui/button";
import { TNode } from "@/types";

interface FormActionsProps {
  isCreating: boolean;
  onPreview: () => void;
  onSave: () => void;
  formData: Partial<TNode>;
}

export function FormActions({ isCreating, onPreview, onSave, formData }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onPreview}
        disabled={isCreating}
      >
        Preview
      </Button>
      <Button
        type="submit"
        disabled={isCreating}
        className="flex items-center gap-2"
      >
        {isCreating ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
            Creating...
          </>
        ) : (
          "Create Node"
        )}
      </Button>
    </div>
  );
}