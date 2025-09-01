'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { LoginForm } from '@/components/auth/login-form';
import { authAPI, tenantsAPI } from '@/lib/api';
import { logger, logAuth } from '@/lib/logger';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  // Fetch available tenants on component mount
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        logAuth('Fetching available tenants for login page');
        const tenants = await tenantsAPI.list();
        setAvailableTenants(tenants);
        logAuth('Tenants fetched successfully', { tenantCount: tenants.length });
      } catch (error) {
        logger.error('Failed to fetch tenants for login page', undefined, error instanceof Error ? error : new Error('Unknown error'));
        // Don't show error to user, just log it
      }
    };

    fetchTenants();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setError('');
    setSuccess('');
    
    if (isSignUp) {
      // Sign up validation
      if (!email || !password || !firstName || !lastName || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    } else {
      // Login validation
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // Call the signup API
        const signupData = {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          tenant_slug: tenantSlug || undefined
        };
        
        logAuth('Signup attempt started', { email, tenant_slug: tenantSlug });
        await authAPI.signup(signupData);
        
        // Sign up successful, show success message and switch to login
        setSuccess('Account created successfully! Please sign in.');
        setIsSignUp(false);
        setFirstName('');
        setLastName('');
        setConfirmPassword('');
        setPassword('');
        
        logAuth('Signup completed successfully', { email, tenant_slug: tenantSlug });
      } else {
        logAuth('Login attempt started from login page', { email, tenant_slug: tenantSlug });
        await login(email, password, tenantSlug || undefined);
        logAuth('Login successful, redirecting to dashboard', { email, tenant_slug: tenantSlug });
        router.push('/dashboard');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      if (isSignUp) {
        setError(`Failed to create account: ${errorMessage}`);
        logAuth('Signup failed on login page', { 
          email, 
          tenant_slug: tenantSlug,
          errorMessage 
        }, error instanceof Error ? error : new Error('Unknown error'));
      } else {
        setError(errorMessage);
        logAuth('Login failed on login page', { 
          email, 
          tenant_slug: tenantSlug,
          errorMessage 
        }, error instanceof Error ? error : new Error('Unknown error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setFirstName('');
    setLastName('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <LoginForm
          email={email}
          password={password}
          firstName={firstName}
          lastName={lastName}
          confirmPassword={confirmPassword}
          tenantSlug={tenantSlug}
          availableTenants={availableTenants}
          isLoading={isLoading}
          error={error}
          success={success}
          isSignUp={isSignUp}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onConfirmPasswordChange={setConfirmPassword}
          onTenantSlugChange={setTenantSlug}
          onSubmit={handleSubmit}
          onToggleMode={handleToggleMode}
        />
      </div>
    </div>
  );
}
