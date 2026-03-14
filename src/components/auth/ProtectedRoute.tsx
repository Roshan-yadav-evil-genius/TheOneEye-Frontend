'use client';

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { buildLoginUrlWithRedirect } from '@/lib/auth/redirect-after-login';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, getCurrentUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      getCurrentUser().then(() => {
        if (!useAuthStore.getState().isAuthenticated) {
          const returnTo = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
          router.push(buildLoginUrlWithRedirect(returnTo));
        }
      });
    }
  }, [isAuthenticated, isLoading, getCurrentUser, router, pathname, searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
