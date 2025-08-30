'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Users, Calendar, Globe, Shield, Settings } from 'lucide-react';
import { format } from 'date-fns';

export default function OrganizationPage() {
  const { tenant, user, session, auth } = useAuth();

  if (!tenant) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Organization</h1>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <Building2 className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Organization Selected</h3>
            <p className="mb-4">
              You are not currently associated with any organization.
            </p>
            <Button variant="outline">
              Join Organization
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Organization</h1>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Organization Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Building2 className="h-6 w-6" />
            <span>{tenant.name}</span>
            <Badge variant={tenant.is_active ? "default" : "secondary"}>
              {tenant.is_active ? "Active" : "Inactive"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Organization ID</label>
                <p className="text-sm font-mono">{tenant.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <p className="text-sm">{tenant.slug}</p>
              </div>
              {tenant.domain && (
                <div>
                  <label className="text-sm font-medium">Domain</label>
                  <p className="text-sm">{tenant.domain}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Created</label>
                <p className="text-sm">
                  {tenant.created_at ? format(new Date(tenant.created_at), 'PPP') : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Last Updated</label>
                <p className="text-sm">
                  {tenant.updated_at ? format(new Date(tenant.updated_at), 'PPP') : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="border-t pt-6">
            <h4 className="text-sm font-medium mb-4">Status</h4>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${tenant.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm">
                  {tenant.is_active ? 'Organization is active' : 'Organization is inactive'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Debug Info */}
      {session && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Session ID</label>
                <p className="text-sm font-mono">{session.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Expires At</label>
                <p className="text-sm">
                  {session.expires_at ? format(new Date(session.expires_at), 'PPP p') : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Raw Session Object</label>
                <pre className="text-xs p-3 rounded-md overflow-x-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Auth Context Debug Info */}
      {auth && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Auth Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Is Admin</label>
                <p className="text-sm">
                  <Badge variant={auth.is_admin ? "default" : "secondary"}>
                    {auth.is_admin ? "Yes" : "No"}
                  </Badge>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Roles</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {auth.roles.map((role) => (
                    <Badge key={role} variant="outline">{role}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Permissions</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {auth.permissions.map((permission) => (
                    <Badge key={permission} variant="outline">{permission}</Badge>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto bg-background p-3 rounded-md">
                <label className="text-sm font-medium">Raw Auth Object</label>
                <pre className="text-xs p-3 rounded-md overflow-x-auto">
                  {JSON.stringify(auth, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8" />
              <div>
                <h3 className="font-medium">Manage Users</h3>
                <p className="text-sm">Add, remove, and manage organization members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8" />
              <div>
                <h3 className="font-medium">Roles & Permissions</h3>
                <p className="text-sm">Configure access control and user roles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Globe className="h-8 w-8" />
              <div>
                <h3 className="font-medium">Domain Settings</h3>
                <p className="text-sm">Configure custom domain and branding</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current User Info */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Membership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="font-medium">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-sm">{user.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">Member since</p>
                <p className="text-sm">
                  {user.created_at ? format(new Date(user.created_at), 'PPP') : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
