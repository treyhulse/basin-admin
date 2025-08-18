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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface JWTPayload {
  sub: string;
  email: string;
  exp: number;
  iat: number;
}

// JWT token management
export const AUTH_TOKEN_KEY = 'basin_auth_token';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
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

export const getCurrentUser = (): User | null => {
  const token = getAuthToken();
  if (!token || !isTokenValid(token)) {
    removeAuthToken();
    return null;
  }

  try {
    const decoded = jwtDecode<JWTPayload>(token);
    // For now, we'll need to fetch user details from /auth/me
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
