'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Copy, Eye, EyeOff, Trash2, Key, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { apiKeysAPI, usersAPI } from '@/lib/api';
import { SheetForm, SheetFormField } from '@/components/ui/sheet-form';
import { z } from 'zod';

// API Key form schema
const ApiKeySchema = z.object({
  name: z.string().min(1, "Key name is required"),
  user_id: z.string().min(1, "User selection is required"),
  permissions: z.array(z.string()).min(1, "At least one permission is required")
});

type ApiKeyFormData = z.infer<typeof ApiKeySchema>;

interface ApiKey {
  id: string;
  name: string;
  key: string;
  user_id: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'expired';
  created_at: string;
  expires_at?: string;
  last_used?: string;
  usage_count?: number;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export default function ApiKeysClient() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [apiKeysResponse, usersResponse] = await Promise.all([
        apiKeysAPI.list({ limit: 100 }),
        usersAPI.list({ limit: 1000 })
      ]);
      
      setApiKeys(apiKeysResponse.data || []);
      setUsers(usersResponse.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = async (data: ApiKeyFormData) => {
    try {
      await apiKeysAPI.create(data);
      setDrawerOpen(false);
      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Failed to create API key:', error);
      throw error; // Re-throw to show error in form
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      try {
        await apiKeysAPI.delete(keyId);
        fetchData(); // Refresh the data
      } catch (error) {
        console.error('Failed to delete API key:', error);
      }
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = async (key: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatPermissions = (permissions: string[]) => {
    return permissions.map(perm => (
      <Badge key={perm} variant="outline" className="mr-1">
        {perm}
      </Badge>
    ));
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      return `${user.first_name} ${user.last_name}`;
    }
    return 'Unknown User';
  };

  const getUserEmail = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.email : 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Loading API keys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API Keys</h1>
        <p className="mt-2">
          Manage API keys for external integrations and applications
        </p>
      </div>

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          {/* Create New API Key */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Create New API Key
              </CardTitle>
              <CardDescription>
                Generate a new API key with specific permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setDrawerOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New API Key
              </Button>
            </CardContent>
          </Card>

          {/* Existing API Keys */}
          <Card>
            <CardHeader>
              <CardTitle>Existing API Keys</CardTitle>
              <CardDescription>
                Manage your active API keys and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Key className="h-5 w-5 text-blue-600" />
                        <div>
                          <h3 className="font-medium">{apiKey.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusBadge(apiKey.status)}
                            <span className="text-sm">
                              Created {new Date(apiKey.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {showKeys[apiKey.id] ? (
                            <EyeOff className="h-4 w-4 mr-2" />
                          ) : (
                            <Eye className="h-4 w-4 mr-2" />
                          )}
                          {showKeys[apiKey.id] ? 'Hide' : 'Show'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {copiedKey === apiKey.id ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDeleteKey(apiKey.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Revoke
                        </Button>
                      </div>
                    </div>

                    {/* API Key Display */}
                    {showKeys[apiKey.id] && (
                      <div className="p-3 rounded border mb-3">
                        <div className="flex items-center justify-between">
                          <code className="text-sm font-mono">
                            {apiKey.key}
                          </code>
                        </div>
                      </div>
                    )}

                    {/* Key Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span>User:</span>
                        <div className="mt-1">
                          <div className="font-medium">{getUserName(apiKey.user_id)}</div>
                          <div>{getUserEmail(apiKey.user_id)}</div>
                        </div>
                      </div>
                      <div>
                        <span>Permissions:</span>
                        <div className="mt-1">{formatPermissions(apiKey.permissions)}</div>
                      </div>
                      <div>
                        <span>Last Used:</span>
                        <div className="mt-1 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {apiKey.last_used ? new Date(apiKey.last_used).toLocaleDateString() : 'Never'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {apiKeys.length === 0 && (
                  <div className="text-center py-8">
                    No API keys found. Create your first API key above.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* API Key Creation Sheet */}
      <SheetForm<ApiKeyFormData>
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode="create"
        title="Create New API Key"
        description="Generate a new API key with specific permissions for external integrations"
        schema={ApiKeySchema}
        onSubmit={handleCreateKey}
        size="lg"
      >
        <SheetFormField name="name" label="Key Name" description="Give your API key a descriptive name">
          <Input placeholder="e.g., Frontend App, Mobile App, Webhook" />
        </SheetFormField>
        
        <SheetFormField name="user_id" label="User" description="Select the user this API key will be associated with">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SheetFormField>
        
        <SheetFormField name="permissions" label="Permissions" description="Select the permissions this API key should have">
          <div className="space-y-3">
            {['read', 'create', 'update', 'delete'].map((permission) => (
              <div key={permission} className="flex items-center space-x-2">
                <Checkbox
                  id={`permission-${permission}`}
                  value={permission}
                  onCheckedChange={(checked) => {
                    // This part of the logic needs to be handled by the form's internal state
                    // For now, we'll just log the change, as the form's state management
                    // is not directly exposed here.
                    console.log(`Permission ${permission} changed to ${checked}`);
                  }}
                />
                <Label htmlFor={`permission-${permission}`} className="text-sm font-normal capitalize">
                  {permission}
                </Label>
              </div>
            ))}
          </div>
        </SheetFormField>
      </SheetForm>
    </div>
  );
}
