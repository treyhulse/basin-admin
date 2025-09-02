import { ServerAuth } from '@/lib/server-auth';
import { AuthService } from '@/lib/services/auth-service';
import { redirect } from 'next/navigation';

interface AuthGuardServerProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
  requireAdmin?: boolean;
  fallbackUrl?: string;
}

/**
 * Server-side auth guard component that protects routes based on auth object permissions
 */
export async function AuthGuardServer({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  requireAdmin = false,
  fallbackUrl = '/login'
}: AuthGuardServerProps) {
  // Get auth data on the server
  const { user, tenant, session, auth, isAuthenticated } = await ServerAuth.getCurrentUser();

  // Check if user is authenticated
  if (!isAuthenticated || !user || !tenant || !auth) {
    redirect(fallbackUrl);
  }

  // Check admin requirement
  if (requireAdmin && !AuthService.isAdmin(auth)) {
    redirect('/dashboard'); // Redirect to dashboard if not admin
  }

  // Check role requirements
  if (requiredRoles.length > 0 && !AuthService.hasAnyRole(auth, requiredRoles)) {
    redirect('/dashboard'); // Redirect to dashboard if doesn't have required roles
  }

  // Check permission requirements
  if (requiredPermissions.length > 0 && !AuthService.hasAnyPermission(auth, requiredPermissions)) {
    redirect('/dashboard'); // Redirect to dashboard if doesn't have required permissions
  }

  return <>{children}</>;
}

/**
 * Higher-order function to create protected server components
 */
export function withAuthGuard<T extends object>(
  Component: React.ComponentType<T>,
  options: Omit<AuthGuardServerProps, 'children'> = {}
) {
  return async function ProtectedComponent(props: T) {
    return (
      <AuthGuardServer {...options}>
        <Component {...props} />
      </AuthGuardServer>
    );
  };
}

/**
 * Server-side permission check utility
 */
export async function checkServerPermission(
  permission: string,
  fallbackUrl: string = '/dashboard'
): Promise<boolean> {
  const { auth } = await ServerAuth.getCurrentUser();
  
  if (!auth) {
    redirect(fallbackUrl);
  }

  const [table, action] = permission.split(':');
  return AuthService.hasPermission(auth, table, action);
}

/**
 * Server-side role check utility
 */
export async function checkServerRole(
  role: string,
  fallbackUrl: string = '/dashboard'
): Promise<boolean> {
  const { auth } = await ServerAuth.getCurrentUser();
  
  if (!auth) {
    redirect(fallbackUrl);
  }

  return AuthService.hasRole(auth, role);
}

/**
 * Server-side admin check utility
 */
export async function checkServerAdmin(
  fallbackUrl: string = '/dashboard'
): Promise<boolean> {
  const { auth } = await ServerAuth.getCurrentUser();
  
  if (!auth) {
    redirect(fallbackUrl);
  }

  return AuthService.isAdmin(auth);
}
