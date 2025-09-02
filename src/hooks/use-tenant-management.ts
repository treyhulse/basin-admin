'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { TenantService, type TenantWithMembership, type CreateTenantRequest } from '@/lib/services/tenant-service';
import { toast } from 'sonner';

/**
 * Hook for managing tenant operations
 */
export function useTenantManagement() {
  const { switchTenant, refreshAuthContext } = useAuth();
  const [tenants, setTenants] = useState<TenantWithMembership[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  /**
   * Fetch user's tenants
   */
  const fetchTenants = useCallback(async () => {
    setIsLoading(true);
    try {
      const userTenants = await TenantService.getUserTenants();
      setTenants(userTenants);
    } catch (error) {
      console.error('Failed to fetch tenants:', error);
      toast.error('Failed to load organizations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new tenant
   */
  const createTenant = useCallback(async (tenantData: CreateTenantRequest) => {
    setIsCreating(true);
    try {
      // Validate slug
      const slugValidation = TenantService.validateTenantSlug(tenantData.slug);
      if (!slugValidation.isValid) {
        toast.error(slugValidation.error || 'Invalid tenant slug');
        return null;
      }

      console.log('Creating tenant with data:', tenantData);
      const newTenant = await TenantService.createTenant(tenantData);
      console.log('Tenant created successfully:', newTenant);
      toast.success(`Organization "${newTenant.name}" created successfully`);
      
      // Refresh tenants list
      await fetchTenants();
      
      return newTenant;
    } catch (error) {
      console.error('Failed to create tenant:', error);
      
      // Extract more detailed error information
      let errorMessage = 'Failed to create organization';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Try to extract error message from API response
        const errorObj = error as any;
        if (errorObj.response?.data?.message) {
          errorMessage = errorObj.response.data.message;
        } else if (errorObj.response?.data?.error) {
          errorMessage = errorObj.response.data.error;
        } else if (errorObj.message) {
          errorMessage = errorObj.message;
        }
      }
      
      toast.error(errorMessage);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [fetchTenants]);

  /**
   * Switch to a different tenant
   */
  const switchToTenant = useCallback(async (tenantId: string) => {
    setIsSwitching(true);
    try {
      await TenantService.switchTenant(tenantId);
      await switchTenant(tenantId);
      toast.success('Organization switched successfully');
    } catch (error) {
      console.error('Failed to switch tenant:', error);
      toast.error('Failed to switch organization');
    } finally {
      setIsSwitching(false);
    }
  }, [switchTenant]);

  /**
   * Join a tenant
   */
  const joinTenant = useCallback(async (tenantId: string) => {
    try {
      await TenantService.joinTenant(tenantId);
      toast.success('Successfully joined organization');
      await fetchTenants();
    } catch (error) {
      console.error('Failed to join tenant:', error);
      toast.error('Failed to join organization');
    }
  }, [fetchTenants]);

  // Fetch tenants on mount
  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  return {
    tenants,
    isLoading,
    isCreating,
    isSwitching,
    fetchTenants,
    createTenant,
    switchToTenant,
    joinTenant,
  };
}

/**
 * Hook for tenant creation form
 */
export function useTenantCreation() {
  const [formData, setFormData] = useState<CreateTenantRequest>({
    name: '',
    slug: '',
    domain: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createTenant } = useTenantManagement();

  /**
   * Update form data
   */
  const updateField = useCallback((field: keyof CreateTenantRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-generate slug from name
    if (field === 'name' && value) {
      const generatedSlug = TenantService.generateSlugFromName(value);
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [errors]);

  /**
   * Validate form
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Organization name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Organization slug is required';
    } else {
      const slugValidation = TenantService.validateTenantSlug(formData.slug);
      if (!slugValidation.isValid) {
        newErrors.slug = slugValidation.error || 'Invalid slug format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * Submit form
   */
  const submitForm = useCallback(async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);
    try {
      const result = await createTenant(formData);
      if (result) {
        // Reset form on success
        setFormData({ name: '', slug: '', domain: '' });
        setErrors({});
        return true;
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, createTenant]);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    validateForm,
    submitForm,
  };
}
