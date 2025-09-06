'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTenantCreation } from '@/hooks/use-tenant-management';
import { Plus, Loader2 } from 'lucide-react';

interface TenantCreationDialogProps {
  children?: React.ReactNode;
  onSuccess?: () => void;
}

export function TenantCreationDialog({ children, onSuccess }: TenantCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const { formData, errors, isSubmitting, updateField, submitForm } = useTenantCreation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== DIALOG SUBMIT DEBUG ===');
    console.log('Form data at submit:', formData);
    console.log('Form errors at submit:', errors);
    console.log('Is submitting:', isSubmitting);
    
    const success = await submitForm();
    console.log('Submit form result:', success);
    
    if (success) {
      console.log('Success! Closing dialog and calling onSuccess');
      setOpen(false);
      onSuccess?.();
    } else {
      console.log('Submit failed, keeping dialog open');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Organization
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
            <DialogDescription>
              Create a new organization to manage your team and resources.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="My Organization"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="slug">Organization Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                placeholder="my-organization"
                className={errors.slug ? 'border-red-500' : ''}
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Used in URLs. Only lowercase letters, numbers, and hyphens allowed.
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="domain">Domain (Optional)</Label>
              <Input
                id="domain"
                value={formData.domain}
                onChange={(e) => updateField('domain', e.target.value)}
                placeholder="mycompany.com"
                className={errors.domain ? 'border-red-500' : ''}
              />
              {errors.domain && (
                <p className="text-sm text-red-500">{errors.domain}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Your organization's domain for SSO and branding.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Organization
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
