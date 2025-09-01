'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  User, 
  getAuthToken, 
  setAuthToken, 
  removeAuthToken, 
  isTokenValid 
} from '@/lib/auth';
import type { Tenant, Session, AuthContext } from '@/lib/auth';
import { authAPI } from '@/lib/api';
import { logger, logAuth } from '@/lib/logger';

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  session: Session | null;
  auth: AuthContext | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, tenant_slug?: string) => Promise<void>;
  logout: () => void;
  refreshAuthContext: () => Promise<void>;
  switchTenant: (tenantId: string) => Promise<void>;
  hasPermission: (table: string, action: string) => boolean;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [auth, setAuth] = useState<AuthContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = user !== null && tenant !== null;
  const isAdmin = auth?.is_admin || false;

  const login = async (email: string, password: string, tenant_slug?: string) => {
    const startTime = Date.now();
    
    try {
      logAuth('Login attempt started in auth provider', { email, tenant_slug });
      
      const response = await authAPI.login(email, password, tenant_slug);
      const { token, user: userData, tenant_id, tenant_slug: responseTenantSlug } = response;
      
      // Store token
      setAuthToken(token);
      logAuth('Token stored successfully', { userId: userData.id, tenantId: tenant_id });
      
      // Set basic user and tenant info from login response
      setUser(userData);
      setTenant({
        id: tenant_id,
        slug: responseTenantSlug,
        name: responseTenantSlug, // We'll get the full name from auth context
      });
      
      logAuth('Basic user and tenant info set', { 
        userId: userData.id, 
        tenantId: tenant_id,
        tenantSlug: responseTenantSlug 
      });
      
      // Fetch full auth context to get complete tenant info, session, and permissions
      await refreshAuthContext();
      
      const duration = Date.now() - startTime;
      logAuth('Login completed successfully', { 
        email, 
        tenant_slug, 
        userId: userData.id,
        tenantId: tenant_id,
        duration 
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logAuth('Login failed in auth provider', { 
        email, 
        tenant_slug, 
        duration,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }, error instanceof Error ? error : new Error('Unknown error'));
      throw error;
    }
  };

  const logout = () => {
    logAuth('Logout initiated', { 
      userId: user?.id, 
      tenantId: tenant?.id 
    });
    
    removeAuthToken();
    setUser(null);
    setTenant(null);
    setSession(null);
    setAuth(null);
    
    logAuth('Logout completed - all state cleared');
  };

  const refreshAuthContext = useCallback(async () => {
    try {
      logAuth('Refreshing auth context');
      
      const authContext = await authAPI.getAuthContext();
      setUser(authContext.user);
      setTenant(authContext.tenant);
      setSession(authContext.session);
      setAuth(authContext.auth);
      
      logAuth('Auth context refreshed successfully', { 
        userId: authContext.user.id,
        tenantId: authContext.tenant.id,
        sessionId: authContext.session.id,
        isAdmin: authContext.auth.is_admin,
        roleCount: authContext.auth.roles?.length || 0,
        permissionCount: authContext.auth.permissions?.length || 0
      });
    } catch (error) {
      logAuth('Failed to refresh auth context', { 
        userId: user?.id,
        tenantId: tenant?.id 
      }, error instanceof Error ? error : new Error('Unknown error'));
      logout();
    }
  }, [user?.id, tenant?.id]);

  const switchTenant = async (tenantId: string) => {
    try {
      logAuth('Tenant switch initiated', { 
        currentTenantId: tenant?.id,
        newTenantId: tenantId 
      });
      
      const response = await authAPI.switchTenant(tenantId);
      const { token } = response;
      
      // Update token
      setAuthToken(token);
      logAuth('New token stored for tenant switch', { newTenantId: tenantId });
      
      // Refresh auth context to get new tenant info
      await refreshAuthContext();
      
      logAuth('Tenant switch completed successfully', { newTenantId: tenantId });
    } catch (error) {
      logAuth('Failed to switch tenant', { 
        currentTenantId: tenant?.id,
        newTenantId: tenantId 
      }, error instanceof Error ? error : new Error('Unknown error'));
      throw error;
    }
  };

  const hasPermission = (table: string, action: string): boolean => {
    if (!auth?.permissions) return false;
    return auth.permissions.includes(`${table}:${action}`);
  };

  const hasRole = (role: string): boolean => {
    if (!auth?.roles) return false;
    return auth.roles.includes(role);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        logAuth('Initializing authentication');
        
        const token = getAuthToken();
        
        if (token && isTokenValid(token)) {
          logAuth('Valid token found, attempting to restore session');
          
          // Token exists and is valid, try to get auth context
          await refreshAuthContext();
          logAuth('Session restored successfully');
        } else if (token) {
          logAuth('Invalid token found, removing it');
          
          // Token exists but is invalid, remove it
          removeAuthToken();
        } else {
          logAuth('No token found, user not authenticated');
        }
      } catch (error) {
        logAuth('Failed to initialize auth', undefined, error instanceof Error ? error : new Error('Unknown error'));
        removeAuthToken();
      } finally {
        setIsLoading(false);
        logAuth('Authentication initialization completed', { isLoading: false });
      }
    };

    initializeAuth();
  }, []); // Remove refreshAuthContext from dependencies - it's now stable

  const value: AuthContextType = {
    user,
    tenant,
    session,
    auth,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshAuthContext,
    switchTenant,
    hasPermission,
    hasRole,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
