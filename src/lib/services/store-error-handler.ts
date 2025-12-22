/**
 * Store Error Handler
 * 
 * Utilities for consistent error handling in Zustand stores.
 * Single responsibility: Error handling utilities for stores
 */

/**
 * Extract a user-friendly error message from an error object.
 * 
 * @param error - The error object (Error, TApiError, or unknown)
 * @param defaultMessage - Default message if error cannot be extracted
 * @returns User-friendly error message
 */
export function extractErrorMessage(error: unknown, defaultMessage: string = 'An error occurred'): string {
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle TApiError or similar objects
  if (error && typeof error === 'object') {
    const errorObj = error as Record<string, unknown>;
    if ('message' in errorObj && typeof errorObj.message === 'string') {
      return errorObj.message;
    }
    if ('error' in errorObj && typeof errorObj.error === 'string') {
      return errorObj.error;
    }
  }
  
  return defaultMessage;
}

/**
 * Standard error handling pattern for store actions.
 * Sets error state and optionally shows toast notification.
 * 
 * @param setState - Zustand set function
 * @param error - The error object
 * @param errorMessage - Optional custom error message
 * @returns The extracted error message
 */
export function handleStoreError(
  setState: (fn: (state: { error: string | null }) => void) => void,
  error: unknown,
  errorMessage?: string
): string {
  const message = errorMessage || extractErrorMessage(error);
  
  setState((state) => {
    state.error = message;
  });
  
  return message;
}

/**
 * Clear error state in a store.
 * 
 * @param setState - Zustand set function
 */
export function clearStoreError(
  setState: (fn: (state: { error: string | null }) => void) => void
): void {
  setState((state) => {
    state.error = null;
  });
}

