'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Key, 
  Settings,
  Edit,
  Clock,
  Building2
} from 'lucide-react';

export default function ProfilePage() {
  const { user, tenant, session, auth } = useAuth();

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <User className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium mb-2">User Not Found</h3>
            <p className="mb-4">
              Unable to load user profile information.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* User Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <User className="h-6 w-6" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold">
              {user.first_name?.[0]}{user.last_name?.[0]}
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">User ID</label>
                <p className="text-sm font-mono">{user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium">First Name</label>
                <p className="text-sm">{user.first_name || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <p className="text-sm">{user.last_name || 'Not provided'}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Account Created</label>
                <p className="text-sm">
                  {user.created_at ? format(new Date(user.created_at), 'PPP') : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {user.updated_at && (
            <div className="border-t pt-4">
              <div>
                <label className="text-sm font-medium">Last Updated</label>
                <p className="text-sm">
                  {format(new Date(user.updated_at), 'PPP')}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Organization Membership */}
      {tenant && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Building2 className="h-6 w-6" />
              <span>Organization Membership</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{tenant.name}</h4>
                <p className="text-sm text-muted-foreground">{tenant.slug}</p>
                {tenant.domain && (
                  <p className="text-sm text-muted-foreground">{tenant.domain}</p>
                )}
              </div>
              <Badge variant={tenant.is_active ? "default" : "secondary"}>
                {tenant.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Roles & Permissions */}
      {auth && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Shield className="h-6 w-6" />
              <span>Roles & Permissions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Admin Status</label>
              <div className="mt-1">
                <Badge variant={auth.is_admin ? "default" : "secondary"}>
                  {auth.is_admin ? "Administrator" : "Regular User"}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Roles</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {auth.roles.length > 0 ? (
                  auth.roles.map((role) => (
                    <Badge key={role} variant="outline">{role}</Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No roles assigned</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Permissions</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {auth.permissions.length > 0 ? (
                  auth.permissions.map((permission) => (
                    <Badge key={permission} variant="outline">{permission}</Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No permissions assigned</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session Information */}
      {session && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Key className="h-6 w-6" />
              <span>Current Session</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            
            <div>
              <label className="text-sm font-medium">Raw Session Data</label>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto mt-1">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8" />
              <div>
                <h3 className="font-medium">Account Settings</h3>
                <p className="text-sm">Update your profile and preferences</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8" />
              <div>
                <h3 className="font-medium">Security</h3>
                <p className="text-sm">Change password and security settings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Raw User Data (Debug) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Clock className="h-6 w-6" />
            <span>Raw User Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
