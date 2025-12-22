/**
 * Sentry configuration for error tracking
 * 
 * To enable Sentry:
 * 1. Install: npm install @sentry/nextjs
 * 2. Initialize in your app (e.g., app/layout.tsx):
 *    import * as Sentry from "@sentry/nextjs";
 *    Sentry.init({
 *      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
 *      environment: process.env.NODE_ENV,
 *    });
 * 3. Set NEXT_PUBLIC_SENTRY_DSN in your .env file
 */

export const isSentryEnabled = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof (window as any).Sentry !== 'undefined' &&
         !!process.env.NEXT_PUBLIC_SENTRY_DSN;
};

export const configureSentry = (dsn: string, environment: string = 'production'): void => {
  if (typeof window === 'undefined') {
    return;
  }

  // This will be called when @sentry/nextjs is installed and initialized
  // The actual initialization should happen in app/layout.tsx or similar
  console.info('Sentry configuration loaded. Initialize Sentry in your app entry point.');
};

