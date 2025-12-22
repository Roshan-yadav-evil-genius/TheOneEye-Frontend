/**
 * Structured logging utility for the frontend
 * Replaces console.* calls with structured logging that can be filtered in production
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  context?: string;
}

class Logger {
  private minLevel: LogLevel;
  private isDevelopment: boolean;
  private logHistory: LogEntry[] = [];
  private maxHistorySize = 100;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    // In production, only show WARN and ERROR by default
    this.minLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown, context?: string): string {
    const levelName = LogLevel[level];
    const contextStr = context ? `[${context}]` : '';
    return `${levelName} ${contextStr} ${message}`;
  }

  private log(level: LogLevel, message: string, data?: unknown, context?: string): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      context,
    };

    // Store in history
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }

    // Output to console with appropriate method
    const formattedMessage = this.formatMessage(level, message, data, context);
    
    switch (level) {
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          console.debug(formattedMessage, data || '');
        }
        break;
      case LogLevel.INFO:
        if (this.isDevelopment) {
          console.info(formattedMessage, data || '');
        }
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, data || '');
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, data || '');
        // In production, could send to error tracking service
        if (!this.isDevelopment && data instanceof Error) {
          // TODO: Send to error tracking service (Sentry, etc.)
        }
        break;
    }
  }

  debug(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.DEBUG, message, data, context);
  }

  info(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.INFO, message, data, context);
  }

  warn(message: string, data?: unknown, context?: string): void {
    this.log(LogLevel.WARN, message, data, context);
  }

  error(message: string, error?: Error | unknown, context?: string): void {
    const errorData = error instanceof Error 
      ? { message: error.message, stack: error.stack, name: error.name }
      : error;
    this.log(LogLevel.ERROR, message, errorData, context);
  }

  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  getHistory(): LogEntry[] {
    return [...this.logHistory];
  }

  clearHistory(): void {
    this.logHistory = [];
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const logDebug = (message: string, data?: unknown, context?: string) => 
  logger.debug(message, data, context);
export const logInfo = (message: string, data?: unknown, context?: string) => 
  logger.info(message, data, context);
export const logWarn = (message: string, data?: unknown, context?: string) => 
  logger.warn(message, data, context);
export const logError = (message: string, error?: Error | unknown, context?: string) => 
  logger.error(message, error, context);

