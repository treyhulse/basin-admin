import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { config } from './config';
import { logger } from './logger';
import type { User, Tenant, Session, AuthContext, AuthContextResponse } from './auth';

const AUTH_TOKEN_KEY = 'basin_auth_token';

/**
 * Server-side authentication utilities for Next.js server components and API routes
 */
export class ServerAuth {
  /**
   * Get auth token from cookies (server-side)
   */
  static async getAuthTokenFromCookies(): Promise<string | null> {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(AUTH_TOKEN_KEY)?.value;
      return token || null;
    } catch (error) {
      logger.error('Failed to get auth token from cookies', undefined, error as Error);
      return null;
    }
  }

  /**
   * Get auth token from NextRequest headers (for API routes)
   */
  static getAuthTokenFromRequest(request: NextRequest): string | null {
    try {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
      }
      return null;
    } catch (error) {
      logger.error('Failed to get auth token from request', undefined, error as Error);
      return null;
    }
  }

  /**
   * Fetch auth context from backend API using token
   */
  static async getAuthContext(token: string): Promise<AuthContextResponse | null> {
    try {
      logger.info('Fetching auth context on server', { hasToken: !!token });
      
      const response = await axios.get(`${config.api.baseURL}/auth/context`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: config.api.timeout
      });

      logger.info('Auth context fetched successfully on server', { 
        userId: response.data.user?.id,
        tenantId: response.data.tenant?.id 
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to fetch auth context on server', undefined, error as Error);
      return null;
    }
  }

  /**
   * Get current user from server-side (for server components)
   */
  static async getCurrentUser(): Promise<{
    user: User | null;
    tenant: Tenant | null;
    session: Session | null;
    auth: AuthContext | null;
    isAuthenticated: boolean;
  }> {
    try {
      const token = await this.getAuthTokenFromCookies();
      
      if (!token) {
        logger.info('No auth token found on server');
        return {
          user: null,
          tenant: null,
          session: null,
          auth: null,
          isAuthenticated: false
        };
      }

      const authContext = await this.getAuthContext(token);
      
      if (!authContext) {
        logger.warn('Failed to get auth context on server');
        return {
          user: null,
          tenant: null,
          session: null,
          auth: null,
          isAuthenticated: false
        };
      }

      logger.info('User authenticated on server', {
        userId: authContext.user.id,
        tenantId: authContext.tenant.id,
        isAdmin: authContext.auth.is_admin
      });

      return {
        user: authContext.user,
        tenant: authContext.tenant,
        session: authContext.session,
        auth: authContext.auth,
        isAuthenticated: true
      };
    } catch (error) {
      logger.error('Failed to get current user on server', undefined, error as Error);
      return {
        user: null,
        tenant: null,
        session: null,
        auth: null,
        isAuthenticated: false
      };
    }
  }

  /**
   * Get current user from NextRequest (for API routes)
   */
  static async getCurrentUserFromRequest(request: NextRequest): Promise<{
    user: User | null;
    tenant: Tenant | null;
    session: Session | null;
    auth: AuthContext | null;
    isAuthenticated: boolean;
  }> {
    try {
      const token = this.getAuthTokenFromRequest(request);
      
      if (!token) {
        logger.info('No auth token found in request');
        return {
          user: null,
          tenant: null,
          session: null,
          auth: null,
          isAuthenticated: false
        };
      }

      const authContext = await this.getAuthContext(token);
      
      if (!authContext) {
        logger.warn('Failed to get auth context from request');
        return {
          user: null,
          tenant: null,
          session: null,
          auth: null,
          isAuthenticated: false
        };
      }

      logger.info('User authenticated from request', {
        userId: authContext.user.id,
        tenantId: authContext.tenant.id,
        isAdmin: authContext.auth.is_admin
      });

      return {
        user: authContext.user,
        tenant: authContext.tenant,
        session: authContext.session,
        auth: authContext.auth,
        isAuthenticated: true
      };
    } catch (error) {
      logger.error('Failed to get current user from request', undefined, error as Error);
      return {
        user: null,
        tenant: null,
        session: null,
        auth: null,
        isAuthenticated: false
      };
    }
  }
}
