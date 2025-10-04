import { toast } from "sonner";

export interface ToastOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick?: () => void;
  };
}

export const useToast = () => {
  const showToast = {
    success: (message: string, options?: ToastOptions) => {
      return toast.success(message, {
        description: options?.description,
        duration: options?.duration,
        action: options?.action,
        cancel: options?.cancel,
      });
    },

    error: (message: string, options?: ToastOptions) => {
      return toast.error(message, {
        description: options?.description,
        duration: options?.duration,
        action: options?.action,
        cancel: options?.cancel,
      });
    },

    warning: (message: string, options?: ToastOptions) => {
      return toast.warning(message, {
        description: options?.description,
        duration: options?.duration,
        action: options?.action,
        cancel: options?.cancel,
      });
    },

    info: (message: string, options?: ToastOptions) => {
      return toast.info(message, {
        description: options?.description,
        duration: options?.duration,
        action: options?.action,
        cancel: options?.cancel,
      });
    },

    loading: (message: string, options?: ToastOptions) => {
      return toast.loading(message, {
        description: options?.description,
        duration: options?.duration,
      });
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

    custom: (jsx: React.ReactNode, options?: ToastOptions) => {
      return toast.custom(jsx, {
        duration: options?.duration,
      });
    },
  };

  return showToast;
};

// Export individual toast functions for direct usage
export const toastSuccess = (message: string, options?: ToastOptions) => {
  return toast.success(message, options);
};

export const toastError = (message: string, options?: ToastOptions) => {
  return toast.error(message, options);
};

export const toastWarning = (message: string, options?: ToastOptions) => {
  return toast.warning(message, options);
};

export const toastInfo = (message: string, options?: ToastOptions) => {
  return toast.info(message, options);
};

export const toastLoading = (message: string, options?: ToastOptions) => {
  return toast.loading(message, options);
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
