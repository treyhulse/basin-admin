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
        if (selectedCollection === collectionId) {
          setSelectedCollection('');
          setFields([]);
        }
      } catch (error) {
        console.error('Failed to delete collection:', error);
      }
    }
  };

  const getStatusBadge = (isPrimary: boolean) => {
    if (isPrimary) {
      return <Badge className="bg-blue-100 text-blue-800">Primary</Badge>;
    }
    return <Badge variant="outline">Secondary</Badge>;
  };

  const getFieldTypeBadge = (fieldType: string) => {
    const colors = {
      string: 'bg-blue-100 text-blue-800',
      integer: 'bg-green-100 text-green-800',
      boolean: 'bg-yellow-100 text-yellow-800',
      jsonb: 'bg-purple-100 text-purple-800',
      timestamp: 'bg-gray-100 text-gray-800',
      uuid: 'bg-indigo-100 text-indigo-800',
      text: 'bg-blue-100 text-blue-800',
      decimal: 'bg-green-100 text-green-800',
    };
    
    return (
      <Badge className={colors[fieldType as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {fieldType}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
        <p className="text-gray-600 mt-2">
          Manage your data collections and their structure
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Create New Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Create New Collection
              </CardTitle>
              <CardDescription>
                Define a new data collection with its basic properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isCreatingCollection ? (
                <Button onClick={() => setIsCreatingCollection(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Collection
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="collection-name">Collection Name</Label>
                      <Input
                        id="collection-name"
                        placeholder="e.g., products, customers"
                        value={newCollection.name}
                        onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Lowercase, no spaces, used in API endpoints
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="collection-description">Description</Label>
                      <Input
                        id="collection-description"
                        placeholder="Describe what this collection is for..."
                        value={newCollection.description}
                        onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="collection-icon">Icon (optional)</Label>
                      <Input
                        id="collection-icon"
                        placeholder="e.g., database, table, folder"
                        value={newCollection.icon}
                        onChange={(e) => setNewCollection({ ...newCollection, icon: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is-primary"
                        checked={newCollection.is_primary}
                        onChange={(e) => setNewCollection({ ...newCollection, is_primary: e.target.checked })}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                      <Label htmlFor="is-primary">Primary Collection</Label>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleCreateCollection}>Create Collection</Button>
                    <Button variant="outline" onClick={() => setIsCreatingCollection(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Collections Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Data Collections</CardTitle>
              <CardDescription>
                All collections in your system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <Card key={collection.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Database className="h-5 w-5 text-blue-600" />
                          <CardTitle className="text-lg capitalize">
                            {collection.name.replace(/_/g, ' ')}
                          </CardTitle>
                        </div>
                        <div className="flex space-x-1">
                          {getStatusBadge(collection.is_primary)}
                        </div>
                      </div>
                      <CardDescription>{collection.description}</CardDescription>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Updated {new Date(collection.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedCollection(collection.id)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View Data
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteCollection(collection.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Collection Fields</CardTitle>
              <CardDescription>
                Configure fields for the selected collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedCollection ? (
                <div className="text-center py-12">
                  <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Collection</h3>
                  <p className="text-gray-600">Choose a collection from the overview to configure its fields</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Fields for {collections.find(c => c.id === selectedCollection)?.name?.replace(/_/g, ' ')}
                    </h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Field Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Required
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Primary
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {fields.map((field) => (
                          <tr key={field.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{field.name}</div>
                                {field.description && (
                                  <div className="text-sm text-gray-500">{field.description}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getFieldTypeBadge(field.field_type)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {field.is_required ? (
                                <Badge className="bg-red-100 text-red-800">Required</Badge>
                              ) : (
                                <Badge variant="outline">Optional</Badge>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {field.is_primary ? (
                                <Badge className="bg-blue-100 text-blue-800">Primary</Badge>
                              ) : (
                                <Badge variant="outline">Not Primary</Badge>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {fields.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                              No fields configured for this collection
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relationships" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Collection Relationships</CardTitle>
              <CardDescription>
                Define relationships between collections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Relationships</h3>
                <p className="text-gray-600">Configure how collections relate to each other</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
