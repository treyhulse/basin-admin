import { jwtDecode } from 'jwt-decode';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  id: string;
  expires_at: string;
}

export interface AuthContext {
  is_admin: boolean;
  roles: string[];
  permissions: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
  tenant_id: string;
  tenant_slug: string;
}

export interface AuthContextResponse {
  user: User;
  tenant: Tenant;
  session: Session;
  auth: AuthContext;
}

export interface LoginRequest {
  email: string;
  password: string;
  tenant_slug?: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  tenant_slug?: string;
}

export interface JWTPayload {
  sub: string;
  email: string;
  tenant_id: string;
  tenant_slug: string;
  exp: number;
  iat: number;
}

// JWT token management - using cookies only for better security
export const AUTH_TOKEN_KEY = 'basin_auth_token';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Get token from cookie only
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => 
    cookie.trim().startsWith(`${AUTH_TOKEN_KEY}=`)
  );
  
  if (tokenCookie) {
    return tokenCookie.split('=')[1];
  }
  
  return null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  
  // Set cookie only - no localStorage
  document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; max-age=86400; SameSite=Strict`;
};

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  
  // Remove cookie only
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

export const getTokenPayload = (token: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch {
    return null;
  }
};

export const getCurrentUser = (): User | null => {
  const token = getAuthToken();
  if (!token || !isTokenValid(token)) {
    removeAuthToken();
    return null;
  }

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    // For now, we'll need to fetch user details from /auth/context
    // This is a simplified version
    return null;
  } catch {
    removeAuthToken();
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return token !== null && isTokenValid(token);
};
