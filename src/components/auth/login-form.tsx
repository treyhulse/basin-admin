import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Tenant } from "@/lib/auth"

interface LoginFormProps extends React.ComponentProps<"div"> {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  confirmPassword?: string;
  tenantSlug?: string;
  availableTenants?: Tenant[];
  isLoading: boolean;
  error: string;
  success?: string;
  isSignUp: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onFirstNameChange?: (firstName: string) => void;
  onLastNameChange?: (lastName: string) => void;
  onConfirmPasswordChange?: (confirmPassword: string) => void;
  onTenantSlugChange?: (tenantSlug: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleMode: () => void;
}

export function LoginForm({
  className,
  email,
  password,
  firstName = '',
  lastName = '',
  confirmPassword = '',
  tenantSlug = '',
  availableTenants = [],
  isLoading,
  error,
  success,
  isSignUp,
  onEmailChange,
  onPasswordChange,
  onFirstNameChange,
  onLastNameChange,
  onConfirmPasswordChange,
  onTenantSlugChange,
  onSubmit,
  onToggleMode,
  ...props
}: LoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">
                  {isSignUp ? 'Create Account' : 'Welcome back'}
                </h1>
                <p className="text-muted-foreground text-balance">
                  {isSignUp 
                    ? 'Sign up for your Basin Admin account' 
                    : 'Login to your Basin Admin account'
                  }
                </p>
              </div>

              {/* Tenant Selection */}
              {availableTenants.length > 0 && (
                <div className="grid gap-3">
                  <Label htmlFor="tenant">Organization</Label>
                  <Select value={tenantSlug} onValueChange={onTenantSlugChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.slug}>
                          <div className="flex items-center space-x-2">
                            <span>{tenant.name}</span>
                            {tenant.domain && (
                              <span className="text-xs">({tenant.domain})</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs">
                    {isSignUp 
                      ? 'Select the organization you want to join, or leave empty to create a new one'
                      : 'Select the organization you want to access'
                    }
                  </p>
                </div>
              )}

              {isSignUp && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      required={isSignUp}
                      value={firstName}
                      onChange={(e) => onFirstNameChange?.(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      required={isSignUp}
                      value={lastName}
                      onChange={(e) => onLastNameChange?.(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {isSignUp && (
                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    required={isSignUp}
                    value={confirmPassword}
                    onChange={(e) => onConfirmPasswordChange?.(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              )}
              
              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md border border-red-200">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-md border border-green-200">
                  {success}
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading 
                  ? (isSignUp ? 'Creating account...' : 'Signing in...') 
                  : (isSignUp ? 'Create Account' : 'Login')
                }
              </Button>
              
              <div className="text-center text-sm">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="underline underline-offset-4"
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
