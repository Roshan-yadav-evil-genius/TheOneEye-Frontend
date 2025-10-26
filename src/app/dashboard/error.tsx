"use client";

import React from 'react';
import { DashboardErrorPage } from '@/components/common/error-pages';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorProps) {
  return (
    <DashboardErrorPage
      title="Dashboard Error"
      description="Something went wrong while loading the dashboard. This might be a temporary issue."
      error={error}
      returnRoute="/dashboard"
      returnLabel="Return to Dashboard"
      onReset={reset}
    />
  );
}
