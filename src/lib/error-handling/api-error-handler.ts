import { AxiosError, AxiosResponse } from 'axios';
import { AppError, NetworkError, TimeoutError, AuthenticationError, AuthorizationError, NotFoundError, ValidationError } from './error-types';
import { errorHandler } from './error-handler';
import { ErrorSeverity, ErrorCategory } from './error-types';
import { ERROR_MESSAGES } from '@/constants';

/**
 * API Error Handler for handling HTTP errors
 */
export class ApiErrorHandler {
  /**
   * Handle Axios errors and convert them to AppError
   */
  public static handleAxiosError(error: AxiosError): AppError {
    const { response, request, message, code } = error;

    // Network error (no response received)
    if (!response && request) {
      return new NetworkError(
        ERROR_MESSAGES.NETWORK_ERROR,
        {
          originalError: message,
          code,
          url: request.responseURL,
        }
      );
    }

    // Timeout error
    if (code === 'ECONNABORTED' || message.includes('timeout')) {
      return new TimeoutError(
        ERROR_MESSAGES.TIMEOUT_ERROR,
        {
          originalError: message,
          code,
        }
      );
    }

    // HTTP response errors
    if (response) {
      return this.handleHttpError(response);
    }

    // Unknown error
    return new AppError(
      message || ERROR_MESSAGES.SERVER_ERROR,
      'UNKNOWN_API_ERROR',
      500,
      false,
      { originalError: message, code }
    );
  }

  /**
   * Handle HTTP response errors
   */
  private static handleHttpError(response: AxiosResponse): AppError {
    const { status, data, config } = response;
    const message = this.extractErrorMessage(data);
    const context = {
      status,
      url: config?.url,
      method: config?.method,
      responseData: data,
    };

    switch (status) {
      case 400:
        return new ValidationError(
          message || 'Invalid request data',
          undefined,
          context
        );

      case 401:
        return new AuthenticationError(
          message || ERROR_MESSAGES.UNAUTHORIZED,
          context
        );

      case 403:
        return new AuthorizationError(
          message || ERROR_MESSAGES.FORBIDDEN,
          context
        );

      case 404:
        return new NotFoundError(
          message || ERROR_MESSAGES.NOT_FOUND,
          context
        );

      case 409:
        return new AppError(
          message || 'Resource conflict',
          'CONFLICT_ERROR',
          409,
          true,
          context
        );

      case 422:
        return new ValidationError(
          message || 'Validation failed',
          undefined,
          context
        );

      case 429:
        return new AppError(
          message || 'Rate limit exceeded',
          'RATE_LIMIT_ERROR',
          429,
          true,
          context
        );

      case 500:
        return new AppError(
          message || ERROR_MESSAGES.SERVER_ERROR,
          'INTERNAL_SERVER_ERROR',
          500,
          false,
          context
        );

      case 502:
      case 503:
      case 504:
        return new AppError(
          message || 'Service temporarily unavailable',
          'SERVICE_UNAVAILABLE',
          status,
          false,
          context
        );

      default:
        return new AppError(
          message || `HTTP ${status} error`,
          'HTTP_ERROR',
          status,
          true,
          context
        );
    }
  }

  /**
   * Extract error message from response data
   */
  private static extractErrorMessage(data: any): string | undefined {
    if (typeof data === 'string') {
      return data;
    }

    if (data && typeof data === 'object') {
      // Common error message fields
      const messageFields = ['message', 'error', 'detail', 'description'];
      
      for (const field of messageFields) {
        if (data[field]) {
          return data[field];
        }
      }

      // Handle validation errors
      if (data.errors && Array.isArray(data.errors)) {
        return data.errors.map((err: any) => err.message || err).join(', ');
      }

      // Handle field-specific validation errors
      if (data.validation_errors) {
        const errors = Object.values(data.validation_errors).flat();
        return errors.join(', ');
      }
    }

    return undefined;
  }

  /**
   * Handle and report API errors
   */
  public static handleApiError(
    error: AxiosError,
    context: Record<string, any> = {}
  ): AppError {
    const appError = this.handleAxiosError(error);
    
    // Report to error handler
    errorHandler.handleError(
      appError,
      {
        ...context,
        apiError: true,
        originalAxiosError: {
          message: error.message,
          code: error.code,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          },
        },
      },
      this.getErrorSeverity(appError),
      ErrorCategory.NETWORK
    );

    return appError;
  }

  /**
   * Get error severity based on error type
   */
  private static getErrorSeverity(error: AppError): ErrorSeverity {
    if (error instanceof NetworkError || error instanceof TimeoutError) {
      return ErrorSeverity.HIGH;
    }

    if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
      return ErrorSeverity.MEDIUM;
    }

    if (error instanceof ValidationError) {
      return ErrorSeverity.LOW;
    }

    if (error.statusCode >= 500) {
      return ErrorSeverity.HIGH;
    }

    if (error.statusCode >= 400) {
      return ErrorSeverity.MEDIUM;
    }

    return ErrorSeverity.LOW;
  }

  /**
   * Check if error is retryable
   */
  public static isRetryableError(error: AppError): boolean {
    // Network and timeout errors are retryable
    if (error instanceof NetworkError || error instanceof TimeoutError) {
      return true;
    }

    // 5xx server errors are retryable
    if (error.statusCode >= 500) {
      return true;
    }

    // 429 rate limit errors are retryable
    if (error.statusCode === 429) {
      return true;
    }

    return false;
  }

  /**
   * Get retry delay based on error type
   */
  public static getRetryDelay(error: AppError, attempt: number): number {
    // Exponential backoff with jitter
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const jitter = Math.random() * 1000; // 0-1 second jitter

    let delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
    delay += jitter;

    // Special handling for rate limit errors
    if (error.statusCode === 429) {
      delay = Math.max(delay, 5000); // At least 5 seconds for rate limits
    }

    return delay;
  }
}

// Export convenience function
export const handleApiError = ApiErrorHandler.handleApiError.bind(ApiErrorHandler);
