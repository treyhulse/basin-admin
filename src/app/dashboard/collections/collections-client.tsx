'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Database, Edit, Trash2, Settings, Eye, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { collectionsAPI, fieldsAPI, itemsAPI } from '@/lib/api';

interface Collection {
  id: string;
  name: string;
  description: string;
  icon?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

interface Field {
  id: string;
  name: string;
  field_type: string;
  is_required: boolean;
  is_primary: boolean;
  validation_rules?: any;
  description?: string;
}

export default function CollectionsClient() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    icon: '',
    is_primary: false,
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    if (selectedCollection) {
      fetchFields(selectedCollection);
    }
  }, [selectedCollection]);

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const response = await collectionsAPI.list({ limit: 100 });
      setCollections(response.data || []);
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFields = async (collectionId: string) => {
    try {
      const response = await fieldsAPI.list({ 
        collection_id: collectionId, 
        limit: 100 
      });
      setFields(response.data || []);
    } catch (error) {
      console.error('Failed to fetch fields:', error);
    }
  };

  const handleCreateCollection = async () => {
    if (newCollection.name.trim() && newCollection.description.trim()) {
      try {
        await collectionsAPI.create(newCollection);
        setNewCollection({
          name: '',
          description: '',
          icon: '',
          is_primary: false,
        });
        setIsCreatingCollection(false);
        fetchCollections(); // Refresh the list
      } catch (error) {
        console.error('Failed to create collection:', error);
      }
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    if (confirm('Are you sure you want to delete this collection? This will also delete all associated fields and data.')) {
      try {
        await collectionsAPI.delete(collectionId);
        fetchCollections(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete collection:', error);
      }
    }
  };

  const getFieldTypeColor = (fieldType: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-primary/10 text-primary',
      string: 'bg-primary/10 text-primary',
      integer: 'bg-secondary/10 text-secondary',
      boolean: 'bg-accent/10 text-accent',
      jsonb: 'bg-accent/10 text-accent',
      date: 'bg-muted/10 text-muted-foreground',
      timestamp: 'bg-muted/10 text-muted-foreground',
      email: 'bg-primary/10 text-primary',
      text: 'bg-primary/10 text-primary',
      decimal: 'bg-secondary/10 text-secondary',
    };
    return colors[fieldType as keyof typeof colors] || 'bg-muted/10 text-muted-foreground';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Collections</h1>
        <p className="mt-2">
          Manage your data collections and their field configurations.
        </p>
      </div>

      {/* Create New Collection */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Collection</CardTitle>
          <CardDescription>
            Define a new data collection with custom fields
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Collection Name</Label>
              <Input
                id="name"
                placeholder="e.g., Users, Products, Orders"
                value={newCollection.name}
                onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
              />
              <p className="text-xs mt-1">
                Use a descriptive name for your collection
              </p>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What is this collection for?"
                value={newCollection.description}
                onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newCollection.is_primary}
                onChange={(e) => setNewCollection({ ...newCollection, is_primary: e.target.checked })}
                className="h-4 w-4 rounded border"
              />
              <span className="text-sm">Primary Collection</span>
            </label>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button onClick={handleCreateCollection} disabled={!newCollection.name.trim() || !newCollection.description.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Collection
            </Button>
            <Button variant="outline" onClick={() => setIsCreatingCollection(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Collections Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Collections Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedCollection === collection.id
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-accent/5'
                }`}
                onClick={() => setSelectedCollection(collection.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{collection.name}</h3>
                  {collection.is_primary && (
                    <Badge variant="secondary">Primary</Badge>
                  )}
                </div>
                <p className="text-sm mt-1">{collection.description}</p>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span>Created {new Date(collection.created_at).toLocaleDateString()}</span>
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" className="h-6 px-2">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-6 px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCollection(collection.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fields Configuration */}
      {selectedCollection && (
        <Card>
          <CardHeader>
            <CardTitle>
              Fields for {collections.find(c => c.id === selectedCollection)?.name}
            </CardTitle>
            <CardDescription>
              Configure the data structure for this collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Field Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Required
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Primary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {fields.map((field) => (
                    <tr key={field.id} className="hover:bg-accent/5">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{field.name}</div>
                        {field.description && (
                          <div className="text-sm">{field.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getFieldTypeColor(field.field_type)}>
                          {field.field_type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {field.is_required && (
                          <Badge variant="destructive">Required</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {field.is_primary && (
                          <Badge variant="secondary">Primary</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {fields.length === 0 && (
                <td colSpan={5} className="px-6 py-4 text-center">
                  No fields configured yet. Add fields to define your data structure.
                </td>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!selectedCollection && collections.length > 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Database className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Select a Collection</h3>
            <p>Choose a collection from the overview to configure its fields</p>
          </CardContent>
        </Card>
      )}

      {/* No Collections State */}
      {collections.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-medium">
              No Collections Yet
            </h3>
            <p>Create your first collection to get started with data management.</p>
          </CardContent>
        </Card>
      )}

      {/* Relationships Tab */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          {/* Overview content */}
        </TabsContent>
        <TabsContent value="relationships" className="space-y-4">
          <Card>
            <CardContent className="text-center py-12">
              <Database className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Relationships</h3>
              <p>Configure how collections relate to each other</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
