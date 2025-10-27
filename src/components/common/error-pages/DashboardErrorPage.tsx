"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

interface DashboardErrorPageProps {
  title: string;
  description: string;
  error?: Error & { digest?: string };
  returnRoute: string;
  returnLabel: string;
  returnIcon?: React.ReactNode;
  onReset?: () => void;
}

export function DashboardErrorPage({
  title,
  description,
  error,
  returnRoute,
  returnLabel,
  returnIcon,
  onReset
}: DashboardErrorPageProps) {
  const router = useRouter();

  // Log the error for debugging
  React.useEffect(() => {
    if (error) {
      console.error(`${title} error:`, error);
    }
  }, [error, title]);

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 p-8">
        {/* Error Icon */}
        <div className="flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full">
          <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>

        {/* Error Content */}
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            {title}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            {description}
          </p>
          
          {/* Error details for development */}
          {error && process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-left">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Error details (development only):</p>
              <p className="text-xs text-red-600 dark:text-red-400 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {onReset && (
            <Button
              onClick={onReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
          )}
          <Button
            onClick={() => router.push(returnRoute)}
            variant="outline"
            className="flex items-center gap-2"
          >
            {returnIcon && <span className="w-4 h-4">{returnIcon}</span>}
            {returnLabel}
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

