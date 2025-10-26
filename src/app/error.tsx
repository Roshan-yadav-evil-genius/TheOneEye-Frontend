"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { BaseErrorPage } from '@/components/common/error-pages';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  // Log the error for debugging
  React.useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <BaseErrorPage
      title="Oops!"
      subtitle="Something went wrong"
      description="We encountered an unexpected error. Don't worry, our team has been notified and we're working to fix it. You can try again or return to the home page."
      error={error}
      gradientColor="red"
      actions={{
        primary: {
          label: "Try Again",
          onClick: reset
        },
        secondary: {
          label: "Go Home",
          onClick: () => router.push('/')
        }
      }}
    />
  );
}
