'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { AuthService } from '@/lib/services/auth-service';

/**
 * Custom hook that provides AuthService methods with current auth context
 */
export function useAuthService() {
  const { user, tenant, session, auth, isAuthenticated } = useAuth();

  return {
    // Auth state
    user,
    tenant,
    session,
    auth,
    isAuthenticated,

    // AuthService methods with current context
    hasPermission: (table: string, action: string) => 
      AuthService.hasPermission(auth, table, action),
    
    hasAnyPermission: (permissions: string[]) => 
      AuthService.hasAnyPermission(auth, permissions),
    
    hasAllPermissions: (permissions: string[]) => 
      AuthService.hasAllPermissions(auth, permissions),
    
    hasRole: (role: string) => 
      AuthService.hasRole(auth, role),
    
    hasAnyRole: (roles: string[]) => 
      AuthService.hasAnyRole(auth, roles),
    
    isAdmin: () => 
      AuthService.isAdmin(auth),
    
    getTablePermissions: (table: string) => 
      AuthService.getTablePermissions(auth, table),
    
    getTableAccess: (table: string) => 
      AuthService.getTableAccess(auth, table),
    
    canAccessRoute: (route: string) => 
      AuthService.canAccessRoute(auth, route),
    
    getAccessibleTables: () => 
      AuthService.getAccessibleTables(auth),
    
    canManageTable: (table: string) => 
      AuthService.canManageTable(auth, table),

    // Utility methods
    getUserDisplayName: () => 
      AuthService.getUserDisplayName(user),
    
    getUserInitials: () => 
      AuthService.getUserInitials(user),
    
    getTenantDisplayName: () => 
      AuthService.getTenantDisplayName(tenant),
    
    getAuthSummary: () => 
      AuthService.getAuthSummary({ user, tenant, session, auth, isAuthenticated }),
  };
}
