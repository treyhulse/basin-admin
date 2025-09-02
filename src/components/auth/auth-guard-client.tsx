'use client';

import { useAuthService } from '@/hooks/use-auth-service';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardClientProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  requireAdmin?: boolean;
  fallbackUrl?: string;
  loadingComponent?: React.ReactNode;
}

/**
 * Client-side auth guard component that protects routes based on auth object permissions
 */
export function AuthGuardClient({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  requireAdmin = false,
  fallbackUrl = '/login',
  loadingComponent = <div>Loading...</div>
}: AuthGuardClientProps) {
  const authService = useAuthService();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated) {
      router.push(fallbackUrl);
      return;
    }

    // Check admin requirement
    if (requireAdmin && !authService.isAdmin()) {
      router.push('/dashboard');
      return;
    }

    // Check role requirements
    if (requiredRoles.length > 0 && !authService.hasAnyRole(requiredRoles)) {
      router.push('/dashboard');
      return;
    }

    // Check permission requirements
    if (requiredPermissions.length > 0 && !authService.hasAnyPermission(requiredPermissions)) {
      router.push('/dashboard');
      return;
    }
  }, [
    authService.isAuthenticated,
    authService.isAdmin,
    authService.hasAnyRole,
    authService.hasAnyPermission,
    requiredPermissions,
    requiredRoles,
    requireAdmin,
    fallbackUrl,
    router
  ]);

  // Show loading while checking auth
  if (!authService.isAuthenticated) {
    return <>{loadingComponent}</>;
  }

  // Check admin requirement
  if (requireAdmin && !authService.isAdmin()) {
    return <>{loadingComponent}</>;
  }

  // Check role requirements
  if (requiredRoles.length > 0 && !authService.hasAnyRole(requiredRoles)) {
    return <>{loadingComponent}</>;
  }

  // Check permission requirements
  if (requiredPermissions.length > 0 && !authService.hasAnyPermission(requiredPermissions)) {
    return <>{loadingComponent}</>;
  }

  return <>{children}</>;
}

/**
 * Higher-order function to create protected client components
 */
export function withClientAuthGuard<T extends object>(
  Component: React.ComponentType<T>,
  options: Omit<AuthGuardClientProps, 'children'> = {}
) {
  return function ProtectedComponent(props: T) {
    return (
      <AuthGuardClient {...options}>
        <Component {...props} />
      </AuthGuardClient>
    );
  };
}
