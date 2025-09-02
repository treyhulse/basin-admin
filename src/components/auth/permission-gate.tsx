'use client';

import { useAuthService } from '@/hooks/use-auth-service';

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  role?: string;
  roles?: string[];
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders children based on auth permissions/roles
 */
export function PermissionGate({
  children,
  permission,
  permissions = [],
  requireAll = false,
  role,
  roles = [],
  requireAdmin = false,
  fallback = null
}: PermissionGateProps) {
  const authService = useAuthService();

  // Check admin requirement
  if (requireAdmin && !authService.isAdmin()) {
    return <>{fallback}</>;
  }

  // Check single role
  if (role && !authService.hasRole(role)) {
    return <>{fallback}</>;
  }

  // Check multiple roles
  if (roles.length > 0) {
    const hasRequiredRole = requireAll 
      ? roles.every(r => authService.hasRole(r))
      : authService.hasAnyRole(roles);
    
    if (!hasRequiredRole) {
      return <>{fallback}</>;
    }
  }

  // Check single permission
  if (permission) {
    const [table, action] = permission.split(':');
    if (!authService.hasPermission(table, action)) {
      return <>{fallback}</>;
    }
  }

  // Check multiple permissions
  if (permissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? authService.hasAllPermissions(permissions)
      : authService.hasAnyPermission(permissions);
    
    if (!hasRequiredPermissions) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

/**
 * Component that renders content only for admins
 */
export function AdminOnly({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGate requireAdmin={true} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

/**
 * Component that renders content only for users with specific role
 */
export function RoleOnly({ 
  children, 
  role, 
  fallback = null 
}: { 
  children: React.ReactNode; 
  role: string; 
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGate role={role} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

/**
 * Component that renders content only for users with specific permission
 */
export function PermissionOnly({ 
  children, 
  permission, 
  fallback = null 
}: { 
  children: React.ReactNode; 
  permission: string; 
  fallback?: React.ReactNode;
}) {
  return (
    <PermissionGate permission={permission} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}
