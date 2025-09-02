import { authAPI, tenantsAPI } from '@/lib/api';
import { logger } from '@/lib/logger';
import type { Tenant } from '@/lib/auth';

export interface CreateTenantRequest {
  name: string;
  slug: string;
  domain?: string;
}

export interface TenantWithMembership extends Tenant {
  is_current?: boolean;
  role?: string;
  joined_at?: string;
}

/**
 * Service for managing tenant operations
 */
export class TenantService {
  /**
   * Get all tenants the current user has access to
   */
  static async getUserTenants(): Promise<TenantWithMembership[]> {
    try {
      logger.info('Fetching user tenants');
      const tenants = await authAPI.getUserTenants();
      logger.info('User tenants fetched successfully', { tenantCount: tenants.length });
      return tenants;
    } catch (error) {
      logger.error('Failed to fetch user tenants', undefined, error as Error);
      throw error;
    }
  }

  /**
   * Get all available tenants (admin only)
   */
  static async getAllTenants(): Promise<Tenant[]> {
    try {
      logger.info('Fetching all tenants');
      const response = await tenantsAPI.list();
      logger.info('All tenants fetched successfully', { tenantCount: response.length });
      return response;
    } catch (error) {
      logger.error('Failed to fetch all tenants', undefined, error as Error);
      throw error;
    }
  }

  /**
   * Get a specific tenant by ID
   */
  static async getTenant(id: string): Promise<Tenant> {
    try {
      logger.info('Fetching tenant', { tenantId: id });
      const tenant = await tenantsAPI.get(id);
      logger.info('Tenant fetched successfully', { tenantId: id, tenantName: tenant.name });
      return tenant;
    } catch (error) {
      logger.error('Failed to fetch tenant', { tenantId: id }, error as Error);
      throw error;
    }
  }

  /**
   * Create a new tenant
   */
  static async createTenant(tenantData: CreateTenantRequest): Promise<Tenant> {
    try {
      logger.info('Creating new tenant', { name: tenantData.name, slug: tenantData.slug });
      const tenant = await tenantsAPI.create(tenantData);
      logger.info('Tenant created successfully', { 
        tenantId: tenant.id, 
        name: tenant.name, 
        slug: tenant.slug 
      });
      return tenant;
    } catch (error) {
      logger.error('Failed to create tenant', { 
        name: tenantData.name, 
        slug: tenantData.slug 
      }, error as Error);
      
      // Re-throw with more context if it's an API error
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as any;
        const status = apiError.response?.status;
        const data = apiError.response?.data;
        
        if (status === 400) {
          throw new Error(data?.message || 'Invalid tenant data provided');
        } else if (status === 409) {
          throw new Error(data?.message || 'A tenant with this slug already exists');
        } else if (status === 401) {
          throw new Error('Authentication required to create tenant');
        } else if (status === 403) {
          throw new Error('You do not have permission to create tenants');
        } else if (status >= 500) {
          throw new Error('Server error occurred while creating tenant');
        }
      }
      
      throw error;
    }
  }

  /**
   * Update an existing tenant
   */
  static async updateTenant(id: string, tenantData: Partial<CreateTenantRequest>): Promise<Tenant> {
    try {
      logger.info('Updating tenant', { tenantId: id, updates: tenantData });
      const tenant = await tenantsAPI.update(id, tenantData);
      logger.info('Tenant updated successfully', { 
        tenantId: id, 
        name: tenant.name, 
        slug: tenant.slug 
      });
      return tenant;
    } catch (error) {
      logger.error('Failed to update tenant', { tenantId: id }, error as Error);
      throw error;
    }
  }

  /**
   * Delete a tenant
   */
  static async deleteTenant(id: string): Promise<void> {
    try {
      logger.info('Deleting tenant', { tenantId: id });
      await tenantsAPI.delete(id);
      logger.info('Tenant deleted successfully', { tenantId: id });
    } catch (error) {
      logger.error('Failed to delete tenant', { tenantId: id }, error as Error);
      throw error;
    }
  }

  /**
   * Switch to a different tenant
   */
  static async switchTenant(tenantId: string): Promise<void> {
    try {
      logger.info('Switching tenant', { tenantId });
      await authAPI.switchTenant(tenantId);
      logger.info('Tenant switched successfully', { tenantId });
    } catch (error) {
      logger.error('Failed to switch tenant', { tenantId }, error as Error);
      throw error;
    }
  }

  /**
   * Join a tenant (if user has invitation)
   */
  static async joinTenant(tenantId: string): Promise<void> {
    try {
      logger.info('Joining tenant', { tenantId });
      await tenantsAPI.join(tenantId);
      logger.info('Successfully joined tenant', { tenantId });
    } catch (error) {
      logger.error('Failed to join tenant', { tenantId }, error as Error);
      throw error;
    }
  }

  /**
   * Add a user to a tenant
   */
  static async addUserToTenant(
    tenantId: string, 
    userData: { user_id: string; role_id: string; tenant_id: string }
  ): Promise<void> {
    try {
      logger.info('Adding user to tenant', { 
        tenantId, 
        userId: userData.user_id, 
        roleId: userData.role_id 
      });
      await tenantsAPI.addUser(tenantId, userData);
      logger.info('User added to tenant successfully', { 
        tenantId, 
        userId: userData.user_id 
      });
    } catch (error) {
      logger.error('Failed to add user to tenant', { 
        tenantId, 
        userId: userData.user_id 
      }, error as Error);
      throw error;
    }
  }

  /**
   * Remove a user from a tenant
   */
  static async removeUserFromTenant(tenantId: string, userId: string): Promise<void> {
    try {
      logger.info('Removing user from tenant', { tenantId, userId });
      await tenantsAPI.removeUser(tenantId, userId);
      logger.info('User removed from tenant successfully', { tenantId, userId });
    } catch (error) {
      logger.error('Failed to remove user from tenant', { 
        tenantId, 
        userId 
      }, error as Error);
      throw error;
    }
  }

  /**
   * Validate tenant slug format
   */
  static validateTenantSlug(slug: string): { isValid: boolean; error?: string } {
    if (!slug) {
      return { isValid: false, error: 'Tenant slug is required' };
    }

    if (slug.length < 3) {
      return { isValid: false, error: 'Tenant slug must be at least 3 characters long' };
    }

    if (slug.length > 50) {
      return { isValid: false, error: 'Tenant slug must be less than 50 characters' };
    }

    // Only allow lowercase letters, numbers, and hyphens
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return { 
        isValid: false, 
        error: 'Tenant slug can only contain lowercase letters, numbers, and hyphens' 
      };
    }

    // Cannot start or end with hyphen
    if (slug.startsWith('-') || slug.endsWith('-')) {
      return { 
        isValid: false, 
        error: 'Tenant slug cannot start or end with a hyphen' 
      };
    }

    return { isValid: true };
  }

  /**
   * Generate a slug from a name
   */
  static generateSlugFromName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }
}
