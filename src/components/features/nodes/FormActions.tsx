import { Button } from "@/components/ui/button";
import { BackendNodeType } from "@/types/api/backend";

interface FormActionsProps {
  isCreating: boolean;
  onPreview: () => void;
  onSave: () => void;
  formData: Partial<BackendNodeType>;
  buttonText?: string;
  isUpdating?: boolean;
  onCancel?: () => void;
  isFormValid?: boolean;
}

export function FormActions({ isCreating, onPreview, onSave, formData, buttonText = "Create Node", isUpdating, onCancel, isFormValid = true }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isCreating || isUpdating}
        >
          Cancel
        </Button>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={onPreview}
        disabled={isCreating || isUpdating}
      >
        Preview
      </Button>
      <Button
        type="submit"
        disabled={isCreating || isUpdating || !isFormValid}
        className="flex items-center gap-2"
      >
        {(isCreating || isUpdating) ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
            {isUpdating ? "Updating..." : "Creating..."}
          </>
        ) : (
          buttonText
        )}
      </Button>
    </div>
  );
}