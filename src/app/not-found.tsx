"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { BaseErrorPage } from '@/components/common/error-pages';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <BaseErrorPage
      title="404"
      subtitle="Page Not Found"
      description="The page you're looking for doesn't exist or has been moved. Let's get you back on track."
      gradientColor="blue"
      actions={{
        primary: {
          label: "Go Home",
          onClick: () => router.push('/')
        },
        secondary: {
          label: "Go Back",
          onClick: handleGoBack
        }
      }}
    />
  );
}
