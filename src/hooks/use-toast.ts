import React from "react";
import { toast, type Action, type ExternalToast } from "sonner";

export interface ToastOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
  cancel?: {
    label: string;
    onClick?: () => void;
  };
}

const toSonnerAction = (
  button?: { label: string; onClick?: () => void }
): Action | undefined => {
  if (!button) return undefined;
  return {
    label: button.label,
    onClick: () => {
      button.onClick?.();
    },
  };
};

const toExternalToast = (options?: ToastOptions): ExternalToast | undefined => {
  if (!options) return undefined;
  return {
    description: options.description,
    duration: options.duration,
    action: toSonnerAction(options.action),
    cancel: toSonnerAction(options.cancel),
  };
};

export const useToast = () => {
  const showToast = {
    success: (message: string, options?: ToastOptions) => {
      return toast.success(message, toExternalToast(options));
    },

    error: (message: string, options?: ToastOptions) => {
      return toast.error(message, toExternalToast(options));
    },

    warning: (message: string, options?: ToastOptions) => {
      return toast.warning(message, toExternalToast(options));
    },

    info: (message: string, options?: ToastOptions) => {
      return toast.info(message, toExternalToast(options));
    },

    loading: (message: string, options?: ToastOptions) => {
      return toast.loading(message, toExternalToast(options));
    },

    promise: <T>(
      promise: Promise<T>,
      {
        loading,
        success,
        error,
      }: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: unknown) => string);
      }
    ) => {
      return toast.promise(promise, {
        loading,
        success,
        error,
      });
    },

    dismiss: (toastId?: string | number) => {
      return toast.dismiss(toastId);
    },

    custom: (
      jsx: React.ReactNode | ((id: string | number) => React.ReactElement),
      options?: ToastOptions
    ) => {
      const renderer =
        typeof jsx === "function"
          ? jsx
          : () => React.createElement(React.Fragment, null, jsx);
      return toast.custom(renderer, toExternalToast(options));
    },
  };

  return showToast;
};

// Export individual toast functions for direct usage
export const toastSuccess = (message: string, options?: ToastOptions) => {
  return toast.success(message, toExternalToast(options));
};

export const toastError = (message: string, options?: ToastOptions) => {
  return toast.error(message, toExternalToast(options));
};

export const toastWarning = (message: string, options?: ToastOptions) => {
  return toast.warning(message, toExternalToast(options));
};

export const toastInfo = (message: string, options?: ToastOptions) => {
  return toast.info(message, toExternalToast(options));
};

export const toastLoading = (message: string, options?: ToastOptions) => {
  return toast.loading(message, toExternalToast(options));
};

export const toastPromise = <T>(
  promise: Promise<T>,
  {
    loading,
    success,
    error,
  }: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: unknown) => string);
  }
) => {
  return toast.promise(promise, {
    loading,
    success,
    error,
  });
};

export const dismissToast = (toastId?: string | number) => {
  return toast.dismiss(toastId);
};
