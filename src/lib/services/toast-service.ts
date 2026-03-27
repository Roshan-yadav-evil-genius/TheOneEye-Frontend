/**
 * Toast Service
 * 
 * Service for displaying toast notifications.
 * Can be used from stores and services without React hooks.
 * 
 * Single responsibility: Toast notification display
 */

import { toast } from 'sonner';
import type { ToastOptions } from '@/hooks/use-toast';

/**
 * Toast service for displaying notifications.
 * This service can be used from stores and services without React hooks.
 */
class ToastService {
  /**
   * Show a success toast notification.
   */
  success(message: string, options?: ToastOptions): string | number {
    return toast.success(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: () => options.action?.onClick?.(),
          }
        : undefined,
      cancel: options?.cancel
        ? {
            label: options.cancel.label,
            onClick: () => options.cancel?.onClick?.(),
          }
        : undefined,
    });
  }

  /**
   * Show an error toast notification.
   */
  error(message: string, options?: ToastOptions): string | number {
    return toast.error(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: () => options.action?.onClick?.(),
          }
        : undefined,
      cancel: options?.cancel
        ? {
            label: options.cancel.label,
            onClick: () => options.cancel?.onClick?.(),
          }
        : undefined,
    });
  }

  /**
   * Show a warning toast notification.
   */
  warning(message: string, options?: ToastOptions): string | number {
    return toast.warning(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: () => options.action?.onClick?.(),
          }
        : undefined,
      cancel: options?.cancel
        ? {
            label: options.cancel.label,
            onClick: () => options.cancel?.onClick?.(),
          }
        : undefined,
    });
  }

  /**
   * Show an info toast notification.
   */
  info(message: string, options?: ToastOptions): string | number {
    return toast.info(message, {
      description: options?.description,
      duration: options?.duration,
      action: options?.action
        ? {
            label: options.action.label,
            onClick: () => options.action?.onClick?.(),
          }
        : undefined,
      cancel: options?.cancel
        ? {
            label: options.cancel.label,
            onClick: () => options.cancel?.onClick?.(),
          }
        : undefined,
    });
  }

  /**
   * Show a loading toast notification.
   */
  loading(message: string, options?: ToastOptions): string | number {
    return toast.loading(message, {
      description: options?.description,
      duration: options?.duration,
    });
  }

  /**
   * Show a promise toast notification.
   */
  promise<T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ): ReturnType<typeof toast.promise<T>> {
    return toast.promise(promise, {
      loading: options.loading,
      success: options.success,
      error: options.error,
    });
  }

  /**
   * Dismiss a toast notification.
   */
  dismiss(toastId?: string | number): void {
    toast.dismiss(toastId);
  }
}

// Export singleton instance
export const toastService = new ToastService();

