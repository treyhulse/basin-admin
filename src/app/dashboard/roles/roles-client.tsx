'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, Plus, Edit, Trash2, Users, Key, Settings } from 'lucide-react';
import { rolesAPI, permissionsAPI } from '@/lib/api';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  user_count: number;
  created_at: string;
  updated_at: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export default function RolesClient() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await rolesAPI.list({ limit: 100 });
      setRoles(response.data || []);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await permissionsAPI.list({ limit: 100 });
      setPermissions(response.data || []);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRole = async () => {
    if (newRole.name.trim() && newRole.description.trim()) {
      try {
        await rolesAPI.create(newRole);
        setNewRole({
          name: '',
          description: '',
          permissions: [],
        });
        setIsCreatingRole(false);
        fetchRoles(); // Refresh the list
      } catch (error) {
        console.error('Failed to create role:', error);
      }
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (confirm('Are you sure you want to delete this role? This will affect all users with this role.')) {
      try {
        await rolesAPI.delete(roleId);
        fetchRoles(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete role:', error);
      }
    }
  };

  const getPermissionBadge = (action: string) => {
    const colors: Record<string, string> = {
      read: 'bg-primary/10 text-primary',
      create: 'bg-secondary/10 text-secondary',
      update: 'bg-accent/10 text-accent',
      delete: 'bg-destructive/10 text-destructive',
    };
    
    return (
      <Badge className={colors[action as keyof typeof colors] || 'bg-muted/10 text-muted-foreground'}>
        {action}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading roles and permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Roles & Permissions</h1>
        <p className="mt-2">
          Manage user roles and their associated permissions for access control.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">
              Defined roles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{permissions.length}</div>
            <p className="text-xs text-muted-foreground">
              Available permissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {roles.reduce((total, role) => total + role.user_count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Users with roles assigned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create New Role */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Role</CardTitle>
          <CardDescription>
            Define a new role with specific permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role-name">Role Name</Label>
              <Input
                id="role-name"
                placeholder="e.g., Admin, Editor, Viewer"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="role-description">Description</Label>
              <Input
                id="role-description"
                placeholder="What does this role do?"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {permissions.map((permission) => (
                <label key={permission.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newRole.permissions.includes(permission.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewRole({
                          ...newRole,
                          permissions: [...newRole.permissions, permission.id],
                        });
                      } else {
                        setNewRole({
                          ...newRole,
                          permissions: newRole.permissions.filter(p => p !== permission.id),
                        });
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{permission.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-2 mt-4">
            <Button onClick={handleCreateRole} disabled={!newRole.name.trim() || !newRole.description.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
            <Button variant="outline" onClick={() => setIsCreatingRole(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Roles Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Roles Overview</CardTitle>
          <CardDescription>
            All defined roles and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <div key={role.id} className="border rounded-lg p-4 hover:bg-accent/5">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <div>
                    <h3 className="font-medium">{role.name}</h3>
                    <p className="text-sm">{role.description}</p>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center space-x-4 text-sm">
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {role.user_count} users
                  </span>
                  <span>
                    Created {new Date(role.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-3">
                  <span className="text-xs font-medium">Permissions:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {role.permissions.slice(0, 3).map((permissionId) => {
                      const permission = permissions.find(p => p.id === permissionId);
                      return permission ? (
                        <Badge key={permission.id} variant="outline" className="text-xs">
                          {permission.name}
                        </Badge>
                      ) : null;
                    })}
                    {role.permissions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 mt-3">
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteRole(role.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Permissions</CardTitle>
          <CardDescription>
            All system permissions that can be assigned to roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {permissions.map((permission) => (
              <div key={permission.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium capitalize mb-3">
                      {permission.name}
                    </h3>
                    <p className="text-sm">{permission.description}</p>
                    <span className="text-xs">
                      Resource: {permission.resource}
                    </span>
                  </div>
                  <div className="text-right">
                    {getPermissionBadge(permission.action)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
