"use client";

import React from 'react';
import { Network } from 'lucide-react';
import { DashboardErrorPage } from '@/components/common/error-pages';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function NodesError({ error, reset }: ErrorProps) {
  return (
    <DashboardErrorPage
      title="Nodes Error"
      description="Something went wrong while loading the nodes. This might be a connection issue or a problem with the nodes data."
      error={error}
      returnRoute="/nodes"
      returnLabel="Return to Nodes"
      returnIcon={<Network />}
      onReset={reset}
    />
  );
}
