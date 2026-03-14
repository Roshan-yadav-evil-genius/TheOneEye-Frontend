'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { buildLoginUrlWithRedirect } from '@/lib/auth/redirect-after-login';

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup', // Updated from '/register' to match actual route
  '/demo',
  '/about',
  '/contact',
  '/pricing',
  '/features',
  '/auth/google/callback',
];

export function AuthMiddleware({ children }: AuthMiddlewareProps) {
  const { isAuthenticated, isLoading, getCurrentUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if current route is public
      const isPublicRoute = PUBLIC_ROUTES.some(route => 
        pathname === route || pathname.startsWith(route + '/')
      );

      // If it's a public route, allow access
      if (isPublicRoute) {
        hasCheckedAuth.current = true;
        return;
      }

      // If we've already checked auth for this route, don't check again
      if (hasCheckedAuth.current) {
        return;
      }

      // If already loading, don't do anything
      if (isLoading) return;

      // If not authenticated, try to get current user
      if (!isAuthenticated) {
        hasCheckedAuth.current = true;
        try {
          await getCurrentUser();
          // After getCurrentUser, check if we're still not authenticated
          // If so, redirect to login
          const currentState = useAuthStore.getState();
          if (!currentState.isAuthenticated) {
            const returnTo = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
            router.push(buildLoginUrlWithRedirect(returnTo));
          }
        } catch (error) {
          // If getting user fails, redirect to login with return URL
          const returnTo = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
          router.push(buildLoginUrlWithRedirect(returnTo));
        }
      } else {
        hasCheckedAuth.current = true;
      }
    };

    checkAuth();
  }, [pathname, searchParams, router, getCurrentUser, isAuthenticated, isLoading]);

  // Reset the check flag when pathname changes
  useEffect(() => {
    hasCheckedAuth.current = false;
  }, [pathname]);

  // Check if current route is public (needed before loading check so form stays mounted on login/signup)
  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  // If it's a public route, always show content (so login/signup forms stay mounted and keep their state on submit/error)
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Show loading spinner only when checking auth on protected routes (not on login/signup)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not authenticated and not a public route, don't render content
  // (redirect will happen in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, show content
  return <>{children}</>;
}
