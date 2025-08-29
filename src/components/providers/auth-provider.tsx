'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  getAuthToken, 
  setAuthToken, 
  removeAuthToken, 
  isTokenValid 
} from '@/lib/auth';
import type { Tenant, Session, AuthContext } from '@/lib/auth';
import { authAPI } from '@/lib/api';

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
    try {
      const response = await authAPI.login(email, password, tenant_slug);
      const { token, user: userData, tenant_id, tenant_slug: responseTenantSlug } = response;
      
      // Store token
      setAuthToken(token);
      
      // Set basic user and tenant info from login response
      setUser(userData);
      setTenant({
        id: tenant_id,
        slug: responseTenantSlug,
        name: responseTenantSlug, // We'll get the full name from auth context
      });
      
      // Fetch full auth context to get complete tenant info, session, and permissions
      await refreshAuthContext();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    setTenant(null);
    setSession(null);
    setAuth(null);
  };

  const refreshAuthContext = async () => {
    try {
      const authContext = await authAPI.getAuthContext();
      setUser(authContext.user);
      setTenant(authContext.tenant);
      setSession(authContext.session);
      setAuth(authContext.auth);
    } catch (error) {
      console.error('Failed to refresh auth context:', error);
      logout();
    }
  };

  const switchTenant = async (tenantId: string) => {
    try {
      const response = await authAPI.switchTenant(tenantId);
      const { token } = response;
      
      // Update token
      setAuthToken(token);
      
      // Refresh auth context to get new tenant info
      await refreshAuthContext();
    } catch (error) {
      console.error('Failed to switch tenant:', error);
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
        const token = getAuthToken();
        
        if (token && isTokenValid(token)) {
          // Token exists and is valid, try to get auth context
          await refreshAuthContext();
        } else if (token) {
          // Token exists but is invalid, remove it
          removeAuthToken();
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        removeAuthToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

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
