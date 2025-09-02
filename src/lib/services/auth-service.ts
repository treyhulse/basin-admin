import type { User, Tenant, Session, AuthContext } from '@/lib/auth';

/**
 * Centralized AuthService that uses the auth object as the primary source of truth
 * for all authentication and authorization throughout the application.
 */
export class AuthService {
  /**
   * Check if user has a specific permission
   * @param auth - The auth context object
   * @param table - The table/resource name (e.g., 'users', 'collections')
   * @param action - The action (e.g., 'create', 'read', 'update', 'delete')
   * @returns boolean indicating if user has the permission
   */
  static hasPermission(auth: AuthContext | null, table: string, action: string): boolean {
    if (!auth?.permissions) return false;
    const permission = `${table}:${action}`;
    return auth.permissions.includes(permission);
  }

  /**
   * Check if user has any of the specified permissions
   * @param auth - The auth context object
   * @param permissions - Array of permission strings in format 'table:action'
   * @returns boolean indicating if user has any of the permissions
   */
  static hasAnyPermission(auth: AuthContext | null, permissions: string[]): boolean {
    if (!auth?.permissions) return false;
    return permissions.some(permission => auth.permissions.includes(permission));
  }

  /**
   * Check if user has all of the specified permissions
   * @param auth - The auth context object
   * @param permissions - Array of permission strings in format 'table:action'
   * @returns boolean indicating if user has all of the permissions
   */
  static hasAllPermissions(auth: AuthContext | null, permissions: string[]): boolean {
    if (!auth?.permissions) return false;
    return permissions.every(permission => auth.permissions.includes(permission));
  }

  /**
   * Check if user has a specific role
   * @param auth - The auth context object
   * @param role - The role name (e.g., 'admin', 'user', 'editor')
   * @returns boolean indicating if user has the role
   */
  static hasRole(auth: AuthContext | null, role: string): boolean {
    if (!auth?.roles) return false;
    return auth.roles.includes(role);
  }

  /**
   * Check if user has any of the specified roles
   * @param auth - The auth context object
   * @param roles - Array of role names
   * @returns boolean indicating if user has any of the roles
   */
  static hasAnyRole(auth: AuthContext | null, roles: string[]): boolean {
    if (!auth?.roles) return false;
    return roles.some(role => auth.roles.includes(role));
  }

  /**
   * Check if user is an admin
   * @param auth - The auth context object
   * @returns boolean indicating if user is an admin
   */
  static isAdmin(auth: AuthContext | null): boolean {
    return auth?.is_admin === true;
  }

  /**
   * Get all permissions for a specific table/resource
   * @param auth - The auth context object
   * @param table - The table/resource name
   * @returns Array of actions the user can perform on the table
   */
  static getTablePermissions(auth: AuthContext | null, table: string): string[] {
    if (!auth?.permissions) return [];
    return auth.permissions
      .filter(permission => permission.startsWith(`${table}:`))
      .map(permission => permission.split(':')[1]);
  }

  /**
   * Check if user can perform CRUD operations on a table
   * @param auth - The auth context object
   * @param table - The table/resource name
   * @returns Object with boolean flags for each CRUD operation
   */
  static getTableAccess(auth: AuthContext | null, table: string): {
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  } {
    return {
      canCreate: this.hasPermission(auth, table, 'create'),
      canRead: this.hasPermission(auth, table, 'read'),
      canUpdate: this.hasPermission(auth, table, 'update'),
      canDelete: this.hasPermission(auth, table, 'delete'),
    };
  }

  /**
   * Get user's display name
   * @param user - The user object
   * @returns Formatted display name
   */
  static getUserDisplayName(user: User | null): string {
    if (!user) return 'Unknown User';
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.first_name) return user.first_name;
    if (user.last_name) return user.last_name;
    return user.email;
  }

  /**
   * Get user's initials for avatar display
   * @param user - The user object
   * @returns User initials (max 2 characters)
   */
  static getUserInitials(user: User | null): string {
    if (!user) return 'U';
    const first = user.first_name?.[0]?.toUpperCase() || '';
    const last = user.last_name?.[0]?.toUpperCase() || '';
    return (first + last).slice(0, 2) || user.email[0]?.toUpperCase() || 'U';
  }

  /**
   * Get tenant display name
   * @param tenant - The tenant object
   * @returns Formatted tenant name
   */
  static getTenantDisplayName(tenant: Tenant | null): string {
    if (!tenant) return 'Unknown Organization';
    return tenant.name || tenant.slug || 'Unknown Organization';
  }

  /**
   * Check if user is authenticated
   * @param user - The user object
   * @param tenant - The tenant object
   * @returns boolean indicating if user is authenticated
   */
  static isAuthenticated(user: User | null, tenant: Tenant | null): boolean {
    return user !== null && tenant !== null;
  }

  /**
   * Get auth summary for debugging/logging
   * @param authData - Complete auth data object
   * @returns Summary object for logging
   */
  static getAuthSummary(authData: {
    user: User | null;
    tenant: Tenant | null;
    session: Session | null;
    auth: AuthContext | null;
    isAuthenticated: boolean;
  }): {
    isAuthenticated: boolean;
    isAdmin: boolean;
    userId: string | null;
    userEmail: string | null;
    tenantId: string | null;
    tenantName: string | null;
    roleCount: number;
    permissionCount: number;
    roles: string[];
    topPermissions: string[];
  } {
    return {
      isAuthenticated: authData.isAuthenticated,
      isAdmin: this.isAdmin(authData.auth),
      userId: authData.user?.id || null,
      userEmail: authData.user?.email || null,
      tenantId: authData.tenant?.id || null,
      tenantName: authData.tenant?.name || null,
      roleCount: authData.auth?.roles?.length || 0,
      permissionCount: authData.auth?.permissions?.length || 0,
      roles: authData.auth?.roles || [],
      topPermissions: authData.auth?.permissions?.slice(0, 5) || [],
    };
  }

  /**
   * Check if user can access a specific route/page
   * @param auth - The auth context object
   * @param route - The route name (e.g., 'dashboard', 'admin', 'users')
   * @returns boolean indicating if user can access the route
   */
  static canAccessRoute(auth: AuthContext | null, route: string): boolean {
    if (!auth) return false;
    
    // Admin can access everything
    if (this.isAdmin(auth)) return true;
    
    // Define route permissions
    const routePermissions: Record<string, string[]> = {
      'dashboard': ['users:read'], // Basic dashboard access
      'users': ['users:read'],
      'roles': ['roles:read'],
      'permissions': ['permissions:read'],
      'collections': ['collections:read'],
      'fields': ['fields:read'],
      'tenants': ['tenants:read'],
      'api-keys': ['api_keys:read'],
      'admin': ['users:create', 'users:update', 'users:delete'], // Admin panel requires elevated permissions
    };
    
    const requiredPermissions = routePermissions[route];
    if (!requiredPermissions) return true; // Allow access to unknown routes
    
    return this.hasAnyPermission(auth, requiredPermissions);
  }

  /**
   * Get all available tables/resources the user has access to
   * @param auth - The auth context object
   * @returns Array of table names the user has at least read access to
   */
  static getAccessibleTables(auth: AuthContext | null): string[] {
    if (!auth?.permissions) return [];
    
    const tables = new Set<string>();
    auth.permissions.forEach(permission => {
      if (permission.endsWith(':read')) {
        const table = permission.split(':')[0];
        tables.add(table);
      }
    });
    
    return Array.from(tables).sort();
  }

  /**
   * Check if user can manage (create/update/delete) a specific table
   * @param auth - The auth context object
   * @param table - The table name
   * @returns boolean indicating if user can manage the table
   */
  static canManageTable(auth: AuthContext | null, table: string): boolean {
    return this.hasAnyPermission(auth, [
      `${table}:create`,
      `${table}:update`,
      `${table}:delete`
    ]);
  }
}
