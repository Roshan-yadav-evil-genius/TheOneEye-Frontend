"use client";

import React from 'react';
import { Workflow } from 'lucide-react';
import { DashboardErrorPage } from '@/components/common/error-pages';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function WorkflowError({ error, reset }: ErrorProps) {
  return (
    <DashboardErrorPage
      title="Workflow Error"
      description="Something went wrong while loading the workflow. This might be a canvas rendering issue or a problem with the workflow data."
      error={error}
      returnRoute="/workflow"
      returnLabel="Return to Workflows"
      returnIcon={<Workflow />}
      onReset={reset}
    />
  );
}
