// Custom error types for the application

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    code: string = 'APP_ERROR',
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string, context?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, true, { field, ...context });
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', context?: Record<string, any>) {
    super(message, 'AUTHENTICATION_ERROR', 401, true, context);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', context?: Record<string, any>) {
    super(message, 'AUTHORIZATION_ERROR', 403, true, context);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', context?: Record<string, any>) {
    super(`${resource} not found`, 'NOT_FOUND_ERROR', 404, true, context);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'CONFLICT_ERROR', 409, true, context);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', context?: Record<string, any>) {
    super(message, 'RATE_LIMIT_ERROR', 429, true, context);
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error', context?: Record<string, any>) {
    super(message, 'NETWORK_ERROR', 0, false, context);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends AppError {
  constructor(message: string = 'Request timeout', context?: Record<string, any>) {
    super(message, 'TIMEOUT_ERROR', 408, false, context);
    this.name = 'TimeoutError';
  }
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error categories
export enum ErrorCategory {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NETWORK = 'network',
  BUSINESS_LOGIC = 'business_logic',
  SYSTEM = 'system',
  USER_INPUT = 'user_input',
}

// Error context interface
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  timestamp?: Date;
  userAgent?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  stack?: string;
  [key: string]: any;
}

// Error report interface
export interface ErrorReport {
  id: string;
  error: AppError;
  context: ErrorContext;
  severity: ErrorSeverity;
  category: ErrorCategory;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}
