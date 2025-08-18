import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Database, Edit, Trash2 } from 'lucide-react';

// Mock data - replace with actual API calls
const mockCollections = [
  { name: 'users', display_name: 'Users', description: 'System users and authentication', count: 24 },
  { name: 'roles', display_name: 'Roles', description: 'User roles and permissions', count: 5 },
  { name: 'permissions', display_name: 'Permissions', description: 'System permissions', count: 12 },
  { name: 'collections', display_name: 'Collections', description: 'Data collection definitions', count: 8 },
  { name: 'fields', display_name: 'Fields', description: 'Collection field definitions', count: 45 },
];

export default function CollectionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
          <p className="text-gray-600 mt-2">
            Manage your data collections and their structure
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Collection</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCollections.map((collection) => (
          <Card key={collection.name} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{collection.display_name}</CardTitle>
                </div>
                <div className="text-sm text-gray-500">
                  {collection.count} items
                </div>
              </div>
              <CardDescription>{collection.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Database className="h-4 w-4 mr-2" />
                  View Data
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collection Management</CardTitle>
          <CardDescription>
            Create new collections or modify existing ones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., products, customers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Products, Customers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe what this collection is for..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Collection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
