'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, Kanban, Calendar, Grid3X3, Plus, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { collectionsAPI, itemsAPI } from '@/lib/api';

type ViewType = 'table' | 'kanban' | 'calendar' | 'cards';

interface Collection {
  id: string;
  name: string;
  description: string;
  is_primary: boolean;
}

interface DataItem {
  id: string;
  [key: string]: any;
}

export default function DataViewsClient() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [viewType, setViewType] = useState<ViewType>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [dataItems, setDataItems] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    if (selectedCollection) {
      fetchCollectionData(selectedCollection);
    }
  }, [selectedCollection]);

  const fetchCollections = async () => {
    try {
      const response = await collectionsAPI.list({ limit: 100 });
      setCollections(response.data || []);
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    }
  };

  const fetchCollectionData = async (collectionName: string) => {
    try {
      setIsLoadingData(true);
      const response = await itemsAPI.list(collectionName, { limit: 100 });
      setDataItems(response.data || []);
    } catch (error) {
      console.error('Failed to fetch collection data:', error);
      setDataItems([]);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleCollectionChange = (collectionId: string) => {
    setSelectedCollection(collectionId);
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
      // Here you would fetch the actual data for the selected collection
      console.log('Selected collection:', collection.name);
    }
  };

  const renderViewContent = () => {
    if (!selectedCollection) {
      return (
        <div className="text-center py-12">
          <Table className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Select a Collection</h3>
          <p>Choose a collection from the dropdown above to view its data</p>
        </div>
      );
    }

    if (isLoadingData) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading data...</p>
        </div>
      );
    }

    switch (viewType) {
      case 'table':
        return <TableView collectionId={selectedCollection} data={dataItems} />;
      case 'kanban':
        return <KanbanView collectionId={selectedCollection} data={dataItems} />;
      case 'calendar':
        return <CalendarView collectionId={selectedCollection} data={dataItems} />;
      case 'cards':
        return <CardsView collectionId={selectedCollection} data={dataItems} />;
      default:
        return <TableView collectionId={selectedCollection} data={dataItems} />;
    }
  };

  const getCollectionName = (collectionId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    return collection ? collection.name.replace(/_/g, ' ') : 'Unknown Collection';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Views</h1>
        <p className="mt-2">
          View and manage your data collections in different formats
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>View Controls</CardTitle>
          <CardDescription>
            Select a collection and view type to display your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Collection Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Collection
              </label>
              <Select value={selectedCollection} onValueChange={handleCollectionChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a collection" />
                </SelectTrigger>
                <SelectContent>
                  {collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      <div className="flex items-center justify-between w-full">
                        <span className="capitalize">{collection.name.replace(/_/g, ' ')}</span>
                        {collection.is_primary && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Type Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">
                View Type
              </label>
              <Select value={viewType} onValueChange={(value: ViewType) => setViewType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">
                    <div className="flex items-center">
                      <Table className="h-4 w-4 mr-2" />
                      Table View
                    </div>
                  </SelectItem>
                  <SelectItem value="kanban">
                    <div className="flex items-center">
                      <Kanban className="h-4 w-4 mr-2" />
                      Kanban Board
                    </div>
                  </SelectItem>
                  <SelectItem value="calendar">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Calendar View
                    </div>
                  </SelectItem>
                  <SelectItem value="cards">
                    <div className="flex items-center">
                      <Grid3X3 className="h-4 w-4 mr-2" />
                      Card Grid
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* View Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedCollection && getCollectionName(selectedCollection)} - {viewType.charAt(0).toUpperCase() + viewType.slice(1)} View
          </CardTitle>
          <CardDescription>
            {dataItems.length} items found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderViewContent()}
        </CardContent>
      </Card>
    </div>
  );
}

// View Components
function TableView({ collectionId, data }: { collectionId: string; data: DataItem[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        No data found in this collection
      </div>
    );
  }

  // Get sample keys for table headers (first 5 keys)
  const sampleKeys = Object.keys(data[0] || {}).slice(0, 5);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {sampleKeys.map((key) => (
              <th key={key} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {key.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.slice(0, 10).map((item, index) => (
            <tr key={item.id || index} className="hover:bg-gray-50">
              {sampleKeys.map((key) => (
                <td key={key} className="px-6 py-4 whitespace-nowrap text-sm">
                  {typeof item[key] === 'boolean' ? (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item[key] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item[key] ? 'Yes' : 'No'}
                    </span>
                  ) : (
                    String(item[key] || '-')
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 10 && (
        <div className="mt-4 text-center text-sm">
          Showing first 10 of {data.length} items
        </div>
      )}
    </div>
  );
}

function KanbanView({ collectionId, data }: { collectionId: string; data: DataItem[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        No data found in this collection
      </div>
    );
  }

  // Simple kanban with status-based columns
  const columns = [
    { title: 'To Do', status: 'pending', color: 'bg-gray-50' },
    { title: 'In Progress', status: 'in_progress', color: 'bg-blue-50' },
    { title: 'Done', status: 'completed', color: 'bg-green-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <div key={column.title} className={`${column.color} p-4 rounded-lg`}>
          <h3 className="font-medium mb-3">{column.title}</h3>
          <div className="space-y-2">
            {data.slice(0, 3).map((item, index) => (
              <div key={item.id || index} className="p-3 rounded border">
                <div className="font-medium text-sm">
                  {item.name || item.title || `Item ${index + 1}`}
                </div>
                {item.description && (
                  <div className="text-xs mt-1">{item.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CalendarView({ collectionId, data }: { collectionId: string; data: DataItem[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        No data found in this collection
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <Calendar className="h-12 w-12 mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">Calendar View</h3>
      <p className="">
        Calendar view for {collectionId.replace(/_/g, ' ')} collection
      </p>
      <p className="text-sm mt-2">
        {data.length} items available for calendar display
      </p>
    </div>
  );
}

function CardsView({ collectionId, data }: { collectionId: string; data: DataItem[] }) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        No data found in this collection
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.slice(0, 9).map((item, index) => (
        <div key={item.id || index} className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
          <h3 className="font-medium mb-2">
            {item.name || item.title || `Item ${index + 1}`}
          </h3>
          {item.description && (
            <p className="text-sm">{item.description}</p>
          )}
          {item.created_at && (
            <p className="text-xs mt-2">
              Created: {new Date(item.created_at).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
      {data.length > 9 && (
        <div className="text-center py-8">
          Showing first 9 of {data.length} items
        </div>
      )}
    </div>
  );
}
