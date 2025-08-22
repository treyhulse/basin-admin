'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Shield, Users, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { rolesAPI, permissionsAPI, usersAPI } from '@/lib/api';

interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Permission {
  id: string;
  role_id: string;
  table_name: string;
  action: string;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
}

export default function RolesClient() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [rolesResponse, permissionsResponse, usersResponse] = await Promise.all([
        rolesAPI.list({ limit: 100 }),
        permissionsAPI.list({ limit: 1000 }),
        usersAPI.list({ limit: 1000 })
      ]);
      
      setRoles(rolesResponse.data || []);
      setPermissions(permissionsResponse.data || []);
      setUsers(usersResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRole = async () => {
    if (newRole.name.trim() && newRole.description.trim()) {
      try {
        await rolesAPI.create(newRole);
        setNewRole({ name: '', description: '' });
        setIsCreatingRole(false);
        fetchData(); // Refresh the data
      } catch (error) {
        console.error('Failed to create role:', error);
      }
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (confirm('Are you sure you want to delete this role? This will affect all users with this role.')) {
      try {
        await rolesAPI.delete(roleId);
        fetchData(); // Refresh the data
      } catch (error) {
        console.error('Failed to delete role:', error);
      }
    }
  };

  const getPermissionsByCategory = () => {
    const grouped = permissions.reduce((acc, permission) => {
      if (!acc[permission.table_name]) {
        acc[permission.table_name] = [];
      }
      acc[permission.table_name].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
    
    return grouped;
  };

  const getRolePermissions = (roleId: string) => {
    return permissions.filter(p => p.role_id === roleId);
  };

  const getUserCount = (roleId: string) => {
    return users.filter(u => u.role_id === roleId).length;
  };

  const getPermissionBadge = (action: string) => {
    const colors = {
      read: 'bg-blue-100 text-blue-800',
      create: 'bg-green-100 text-green-800',
      update: 'bg-yellow-100 text-yellow-800',
      delete: 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={colors[action as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {action}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading roles and permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
        <p className="text-gray-600 mt-2">
          Manage user roles and their access permissions
        </p>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          {/* Create New Role */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Create New Role
              </CardTitle>
              <CardDescription>
                Define a new role with specific permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isCreatingRole ? (
                <Button onClick={() => setIsCreatingRole(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Role
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="role-name">Role Name</Label>
                      <Input
                        id="role-name"
                        placeholder="e.g., Moderator"
                        value={newRole.name}
                        onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="role-description">Description</Label>
                      <Input
                        id="role-description"
                        placeholder="Describe the role's purpose"
                        value={newRole.description}
                        onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleCreateRole}>Create Role</Button>
                    <Button variant="outline" onClick={() => setIsCreatingRole(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Existing Roles */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Roles</CardTitle>
              <CardDescription>
                Manage roles and their assigned permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5 text-blue-600" />
                          <div>
                            <h3 className="font-medium text-gray-900">{role.name}</h3>
                            <p className="text-sm text-gray-600">{role.description}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {getUserCount(role.id)} users
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Created {new Date(role.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {/* Show permissions for this role */}
                        <div className="mt-2">
                          <span className="text-xs font-medium text-gray-500">Permissions:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {getRolePermissions(role.id).map((permission) => (
                              <Badge key={permission.id} variant="outline" className="text-xs">
                                {permission.table_name}.{permission.action}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>
                All permissions in the system organized by table
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(getPermissionsByCategory()).map(([tableName, tablePermissions]) => (
                  <div key={tableName}>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 capitalize">
                      {tableName.replace(/_/g, ' ')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {tablePermissions.map((permission) => {
                        const role = roles.find(r => r.id === permission.role_id);
                        return (
                          <div key={permission.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                {getPermissionBadge(permission.action)}
                                <span className="text-xs text-gray-500">
                                  {role ? role.name : 'Unknown Role'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                {permission.table_name}.{permission.action}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
