/**
 * Error Notification Service
 * 
 * Single Responsibility: Centralized error notification handling for all backend errors.
 * 
 * This service provides unified error notification across the application:
 * - Shows toast notifications for immediate user feedback
 * - Shows persistent notifications for critical errors
 * - Handles different error types (API errors, form validation, field options, etc.)
 */

import { toastService } from './toast-service';
import { uiHelpers } from '@/stores/ui';
import { TNodeFormData, TNodeExecuteResponse } from '@/types';
import { AppError } from '@/lib/error-handling/error-types';

/**
 * Centralized error notification service
 */
class ErrorNotificationService {
  /**
   * Show a generic error notification
   * 
   * @param title - Error title
   * @param message - Error message
   * @param showPersistent - Whether to also show persistent notification (default: false)
   */
  notifyError(title: string, message: string, showPersistent: boolean = false): void {
    // Always show toast for immediate feedback
    toastService.error(title, {
      description: message,
    });

    // Show persistent notification for critical errors
    if (showPersistent) {
      uiHelpers.showError(title, message);
    }
  }

  /**
   * Notify about API errors
   * 
   * @param error - The error object (AppError or unknown)
   * @param context - Optional context about where the error occurred
   */
  notifyApiError(error: AppError | unknown, context?: string): void {
    let title = 'API Error';
    let message = 'An error occurred while communicating with the server';

    if (error instanceof AppError) {
      message = error.message || message;
      
      // Check if this is a FormValidationError with form data
      const responseData = (error.context as any)?.responseData;
      if (responseData && (responseData.error_code === 'FormValidationError' || responseData.form)) {
        // Extract form data from response
        const formData = responseData.form;
        if (formData) {
          // This is a form validation error - use the specialized handler
          this.notifyFormValidationError(formData, responseData.error || responseData.detail || message);
          return;
        }
      }
      
      // Determine if this is a critical error that needs persistent notification
      const isCritical = 
        error.statusCode >= 500 || // Server errors
        error instanceof (error.constructor as any) && 
        (error.constructor.name === 'AuthenticationError' || 
         error.constructor.name === 'AuthorizationError');

      // Show toast
      toastService.error(title, {
        description: context ? `${context}: ${message}` : message,
      });

      // Show persistent notification for critical errors
      if (isCritical) {
        uiHelpers.showError(title, context ? `${context}: ${message}` : message);
      }
    } else if (error instanceof Error) {
      message = error.message;
      toastService.error(title, {
        description: context ? `${context}: ${message}` : message,
      });
    } else {
      const errorMessage = String(error);
      toastService.error(title, {
        description: context ? `${context}: ${errorMessage}` : errorMessage,
      });
    }
  }

  /**
   * Notify about field options errors (e.g., expired tokens in dropdowns)
   * 
   * @param options - Field options array
   * @param fieldName - Name of the field with the error
   */
  notifyFieldOptionsError(
    options: Array<{ value: string; text: string }>,
    fieldName: string
  ): void {
    // Find error option
    const errorOption = options.find(opt => 
      opt.text.includes('⚠️') || 
      opt.text.toLowerCase().includes('error') ||
      opt.text.toLowerCase().includes('expired') ||
      opt.text.toLowerCase().includes('revoked') ||
      opt.text.toLowerCase().includes('failed')
    );

    if (errorOption) {
      // Clean up the error message (remove -- and ⚠️ markers)
      const cleanMessage = errorOption.text
        .replace(/^--\s*⚠️\s*/, '')
        .replace(/\s*--$/, '')
        .trim();

      const title = 'Field Options Error';
      const message = `${fieldName}: ${cleanMessage}`;

      // Show toast notification
      toastService.error(title, {
        description: message,
      });

      // Show persistent notification for critical errors (token expiration)
      if (errorOption.text.toLowerCase().includes('expired') || 
          errorOption.text.toLowerCase().includes('revoked')) {
        uiHelpers.showError(title, message);
      }
    }
  }

  /**
   * Notify about form validation errors
   * 
   * @param formData - Form data with field-level errors
   * @param errorMessage - Optional general error message
   */
  notifyFormValidationError(
    formData: TNodeFormData,
    errorMessage?: string
  ): void {
    // Extract field-level errors
    const fieldErrors: string[] = [];
    
    if (formData?.fields) {
      formData.fields.forEach(field => {
        // Check for field_level_errors array (new format)
        if (field.field_level_errors && Array.isArray(field.field_level_errors) && field.field_level_errors.length > 0) {
          field.field_level_errors.forEach(err => {
            fieldErrors.push(`${field.label || field.name}: ${err}`);
          });
        }
      });
    }
    
    // Also check for form-level errors
    if (formData?.form_level_errors && Array.isArray(formData.form_level_errors) && formData.form_level_errors.length > 0) {
      fieldErrors.push(...formData.form_level_errors);
    }

    // Build error message
    let title = 'Form Validation Error';
    let message = errorMessage || 'Please check the form for errors';

    if (fieldErrors.length > 0) {
      // Show first error or summary
      if (fieldErrors.length === 1) {
        message = fieldErrors[0];
      } else {
        message = `Validation failed in ${fieldErrors.length} field(s): ${fieldErrors.slice(0, 3).join(', ')}${fieldErrors.length > 3 ? '...' : ''}`;
      }
    }

    // Show toast notification
    toastService.error(title, {
      description: message,
    });

    // Show persistent notification for validation errors
    uiHelpers.showError(title, message);
  }

  /**
   * Notify about node execution errors
   * 
   * @param response - Node execution response with error
   */
  notifyNodeExecutionError(response: TNodeExecuteResponse): void {
    // Handle form validation errors separately
    if (response.error_type === 'FormValidationError' && response.form) {
      this.notifyFormValidationError(response.form, response.error || response.message);
      return;
    }

    // Handle other execution errors
    const title = 'Execution Failed';
    const message = response.error || 
                    response.message || 
                    'An error occurred during node execution';

    // Show toast notification
    toastService.error(title, {
      description: message,
    });

    // Show persistent notification for execution errors
    uiHelpers.showError(title, message);
  }
}

// Export singleton instance
export const errorNotificationService = new ErrorNotificationService();

