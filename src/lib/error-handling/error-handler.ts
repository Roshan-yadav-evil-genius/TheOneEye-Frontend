import { AppError, ErrorSeverity, ErrorCategory, ErrorContext, ErrorReport } from './error-types';
import { ERROR_MESSAGES } from '@/constants';

/**
 * Global error handler for the application
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorReports: Map<string, ErrorReport> = new Map();

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle and process errors
   */
  public handleError(
    error: Error | AppError,
    context: ErrorContext = {},
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    category: ErrorCategory = ErrorCategory.SYSTEM
  ): ErrorReport {
    const appError = this.normalizeError(error);
    const errorReport = this.createErrorReport(appError, context, severity, category);
    
    this.logError(errorReport);
    this.storeErrorReport(errorReport);
    
    // In production, you might want to send to external error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.reportToExternalService(errorReport);
    }

    return errorReport;
  }

  /**
   * Normalize different error types to AppError
   */
  private normalizeError(error: Error | AppError): AppError {
    if (error instanceof AppError) {
      return error;
    }

    // Handle different error types
    if (error.name === 'ValidationError') {
      return new AppError(error.message, 'VALIDATION_ERROR', 400, true);
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new AppError(ERROR_MESSAGES.NETWORK_ERROR, 'NETWORK_ERROR', 0, false);
    }

    if (error.name === 'ChunkLoadError') {
      return new AppError('Failed to load application chunk. Please refresh the page.', 'CHUNK_LOAD_ERROR', 0, false);
    }

    // Default to generic app error
    return new AppError(
      error.message || 'An unexpected error occurred',
      'UNKNOWN_ERROR',
      500,
      false,
      { originalError: error.name }
    );
  }

  /**
   * Create error report
   */
  private createErrorReport(
    error: AppError,
    context: ErrorContext,
    severity: ErrorSeverity,
    category: ErrorCategory
  ): ErrorReport {
    return {
      id: this.generateErrorId(),
      error,
      context: {
        ...context,
        timestamp: new Date(),
        stack: error.stack,
      },
      severity,
      category,
      timestamp: new Date(),
      resolved: false,
    };
  }

  /**
   * Log error to console
   */
  private logError(errorReport: ErrorReport): void {
    const { error, context, severity, category } = errorReport;
    
    const logMessage = {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      severity,
      category,
      context,
      stack: error.stack,
    };

    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        console.error('🚨 Critical Error:', logMessage);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn('⚠️ Warning:', logMessage);
        break;
      case ErrorSeverity.LOW:
        console.info('ℹ️ Info:', logMessage);
        break;
    }
  }

  /**
   * Store error report
   */
  private storeErrorReport(errorReport: ErrorReport): void {
    this.errorReports.set(errorReport.id, errorReport);
    
    // Keep only last 100 error reports to prevent memory leaks
    if (this.errorReports.size > 100) {
      const firstKey = this.errorReports.keys().next().value;
      this.errorReports.delete(firstKey);
    }
  }

  /**
   * Report to external service (e.g., Sentry, LogRocket)
   */
  private reportToExternalService(errorReport: ErrorReport): void {
    // TODO: Implement external error reporting
    // Example: Sentry.captureException(errorReport.error, { extra: errorReport.context });
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get user-friendly error message
   */
  public getUserFriendlyMessage(error: Error | AppError): string {
    const appError = this.normalizeError(error);
    
    // Return user-friendly messages for operational errors
    if (appError.isOperational) {
      switch (appError.code) {
        case 'VALIDATION_ERROR':
          return appError.message;
        case 'AUTHENTICATION_ERROR':
          return ERROR_MESSAGES.UNAUTHORIZED;
        case 'AUTHORIZATION_ERROR':
          return ERROR_MESSAGES.FORBIDDEN;
        case 'NOT_FOUND_ERROR':
          return ERROR_MESSAGES.NOT_FOUND;
        case 'NETWORK_ERROR':
          return ERROR_MESSAGES.NETWORK_ERROR;
        case 'TIMEOUT_ERROR':
          return ERROR_MESSAGES.TIMEOUT_ERROR;
        default:
          return appError.message;
      }
    }

    // For non-operational errors, return generic message
    return ERROR_MESSAGES.SERVER_ERROR;
  }

  /**
   * Get all error reports
   */
  public getErrorReports(): ErrorReport[] {
    return Array.from(this.errorReports.values());
  }

  /**
   * Clear all error reports
   */
  public clearErrorReports(): void {
    this.errorReports.clear();
  }

  /**
   * Mark error as resolved
   */
  public resolveError(errorId: string, resolvedBy?: string): boolean {
    const errorReport = this.errorReports.get(errorId);
    if (errorReport) {
      errorReport.resolved = true;
      errorReport.resolvedAt = new Date();
      errorReport.resolvedBy = resolvedBy;
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();
