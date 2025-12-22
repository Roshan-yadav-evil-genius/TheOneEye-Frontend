/**
 * Application Configuration
 * 
 * Centralized configuration management.
 * Single source of truth for all configuration values.
 */

/**
 * API Configuration
 */
export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:7878/api',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

/**
 * Authentication Configuration
 */
export const authConfig = {
  tokenStorageKey: 'auth-store',
  tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
} as const;

/**
 * Application Configuration
 */
export const appConfig = {
  name: 'TheOneEye',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

/**
 * Feature Flags
 */
export const featureFlags = {
  enableErrorTracking: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  enableAnalytics: false,
} as const;

