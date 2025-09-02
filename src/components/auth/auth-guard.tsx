'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { AuthService } from '@/lib/services/auth-service';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  requireAdmin?: boolean;
}

export default function AuthGuard({ 
  children, 
  requiredPermissions = [],
  requiredRoles = [],
  requireAdmin = false 
}: AuthGuardProps) {
  const { user, tenant, session, auth, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isLoading && isAuthenticated && auth) {
      // Check admin requirement
      if (requireAdmin && !AuthService.isAdmin(auth)) {
        router.push('/dashboard');
        return;
      }

      // Check role requirements
      if (requiredRoles.length > 0 && !AuthService.hasAnyRole(auth, requiredRoles)) {
        router.push('/dashboard');
        return;
      }

      // Check permission requirements
      if (requiredPermissions.length > 0 && !AuthService.hasAnyPermission(auth, requiredPermissions)) {
        router.push('/dashboard');
        return;
      }
    }
  }, [isAuthenticated, isLoading, auth, requiredPermissions, requiredRoles, requireAdmin, router]);

  // Don't render anything while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Show loading only for the page content, not the entire dashboard
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
