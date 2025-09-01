"use client"

import { useState, useEffect } from "react"
import { Database, Plus, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CollectionDataTableWrapper } from "@/components/data/collection-data-table-wrapper"
import { useCollectionCrud } from "@/hooks/use-collection-crud"
import { collectionsAPI } from "@/lib/api"
import Link from "next/link"

interface Collection {
  id: string
  name: string
  display_name: string
  description: string
  icon?: string
  is_primary: boolean
  created_at: string
  updated_at: string
}

export default function DataPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingCollection, setIsCreatingCollection] = useState(false)
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    icon: '',
    is_primary: false,
  })

  // CRUD hook for the selected collection
  const { actions, state } = useCollectionCrud({ collectionName: selectedCollection })

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      setIsLoading(true)
      const response = await collectionsAPI.list({ limit: 100 })
      setCollections(response.data || [])
      
      // Auto-select first collection if none selected
      if (response.data && response.data.length > 0 && !selectedCollection) {
        setSelectedCollection(response.data[0].name)
      }
    } catch (error) {
      console.error('Failed to fetch collections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCollection = async () => {
    if (newCollection.name.trim() && newCollection.description.trim()) {
      try {
        await collectionsAPI.create(newCollection)
        setNewCollection({
          name: '',
          description: '',
          icon: '',
          is_primary: false,
        })
        setIsCreatingCollection(false)
        fetchCollections()
      } catch (error) {
        console.error('Failed to create collection:', error)
      }
    }
  }

  const handleDeleteCollection = async (collectionId: string) => {
    if (confirm('Are you sure you want to delete this collection? This will also delete all associated fields and data.')) {
      try {
        await collectionsAPI.delete(collectionId)
        fetchCollections()
        // Clear selection if deleted collection was selected
        if (selectedCollection === collections.find(c => c.id === collectionId)?.name) {
          setSelectedCollection("")
        }
      } catch (error) {
        console.error('Failed to delete collection:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading collections...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">All Collections</h1>
        <p className="text-muted-foreground">
          Manage and view data across all your collections
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Create New Collection */}
          {!isCreatingCollection ? (
            <div className="text-center py-8">
              <Button onClick={() => setIsCreatingCollection(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Collection
              </Button>
            </div>
          ) : (
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
                    <label className="text-sm font-medium">Collection Name</label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="e.g., Users, Products, Orders"
                      value={newCollection.name}
                      onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
          )}

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
                      selectedCollection === collection.name
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-accent/5'
                    }`}
                    onClick={() => setSelectedCollection(collection.name)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{collection.display_name || collection.name}</h3>
                      {collection.is_primary && (
                        <Badge variant="secondary">Primary</Badge>
                      )}
                    </div>
                    <p className="text-sm mt-1 text-muted-foreground">{collection.description}</p>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-muted-foreground">
                        Created {new Date(collection.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-6 px-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteCollection(collection.id)
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        asChild
                        className="w-full justify-between"
                      >
                        <Link href={`/dashboard/data/${collection.name.toLowerCase()}`}>
                          View Data
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* No Collections State */}
          {collections.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Collections Yet</h3>
                <p className="text-muted-foreground">Create your first collection to get started with data management.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          {/* Collection Selection */}
          {collections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Select Collection to Manage</CardTitle>
                <CardDescription>
                  Choose a collection to view and manage its data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {collections.map((collection) => (
                    <Button
                      key={collection.id}
                      variant={selectedCollection === collection.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCollection(collection.name)}
                    >
                      {collection.display_name || collection.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Data Table for Selected Collection */}
          {selectedCollection && (
            <CollectionDataTableWrapper 
              collectionName={selectedCollection}
              crudActions={actions}
              crudState={state}
            />
          )}

          {/* No Collection Selected */}
          {!selectedCollection && collections.length > 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Select a Collection</h3>
                <p className="text-muted-foreground">Choose a collection from above to view and manage its data</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
