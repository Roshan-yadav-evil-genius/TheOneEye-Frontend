import { useAlert as useAlertContext } from "@/contexts/alert-context";
import { useToast } from "./use-toast";

export interface AlertOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

export const useAlert = () => {
  const { showAlert } = useAlertContext();
  const toast = useToast();

  const confirm = async (options: AlertOptions): Promise<boolean> => {
    return await showAlert({
      ...options,
      confirmText: options.confirmText || "Confirm",
      cancelText: options.cancelText || "Cancel",
    });
  };

  const confirmDelete = async (
    itemName: string,
    onConfirm?: () => void | Promise<void>
  ): Promise<boolean> => {
    return await showAlert({
      title: "Delete Confirmation",
      description: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm,
    });
  };

  const confirmAction = async (
    action: string,
    description?: string,
    onConfirm?: () => void | Promise<void>
  ): Promise<boolean> => {
    return await showAlert({
      title: `Confirm ${action}`,
      description: description || `Are you sure you want to ${action.toLowerCase()}?`,
      confirmText: action,
      cancelText: "Cancel",
      onConfirm,
    });
  };

  const confirmWithToast = async (
    options: AlertOptions,
    successMessage?: string,
    errorMessage?: string
  ): Promise<boolean> => {
    const result = await showAlert({
      ...options,
      onConfirm: async () => {
        try {
          if (options.onConfirm) {
            await options.onConfirm();
          }
          if (successMessage) {
            toast.success(successMessage);
          }
        } catch (error) {
          if (errorMessage) {
            toast.error(errorMessage);
          } else {
            toast.error("An error occurred. Please try again.");
          }
          throw error; // Re-throw to prevent the alert from resolving as true
        }
      },
    });

    return result;
  };

  const confirmDeleteWithToast = async (
    itemName: string,
    onConfirm?: () => void | Promise<void>,
    successMessage?: string
  ): Promise<boolean> => {
    return await confirmWithToast(
      {
        title: "Delete Confirmation",
        description: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
        confirmText: "Delete",
        cancelText: "Cancel",
        variant: "destructive",
        onConfirm,
      },
      successMessage || `"${itemName}" has been deleted successfully.`,
      `Failed to delete "${itemName}". Please try again.`
    );
  };

  const confirmActionWithToast = async (
    action: string,
    description?: string,
    onConfirm?: () => void | Promise<void>,
    successMessage?: string
  ): Promise<boolean> => {
    return await confirmWithToast(
      {
        title: `Confirm ${action}`,
        description: description || `Are you sure you want to ${action.toLowerCase()}?`,
        confirmText: action,
        cancelText: "Cancel",
        onConfirm,
      },
      successMessage || `${action} completed successfully.`,
      `Failed to ${action.toLowerCase()}. Please try again.`
    );
  };

  return {
    confirm,
    confirmDelete,
    confirmAction,
    confirmWithToast,
    confirmDeleteWithToast,
    confirmActionWithToast,
  };
};

// Export individual functions for direct usage
export const useAlertConfirm = () => {
  const { confirm } = useAlert();
  return confirm;
};

export const useAlertDelete = () => {
  const { confirmDelete } = useAlert();
  return confirmDelete;
};

export const useAlertAction = () => {
  const { confirmAction } = useAlert();
  return confirmAction;
};
