"use client"

import { useState, useEffect } from "react"
import { CollectionDataTable, type DataColumn } from "./collection-data-table"
import { itemsAPI } from "@/lib/api"

// Collection metadata interface
interface CollectionMetadata {
  id: string
  name: string
  display_name: string
  description: string
  icon?: string
  is_primary: boolean
  created_at: string
  updated_at: string
}

// Move helper functions outside component to prevent recreation
const generateColumnsFromData = (data: any[]): DataColumn[] => {
  if (!data || data.length === 0) return []
  
  const firstItem = data[0]
  const generatedColumns: DataColumn[] = []
  
  Object.keys(firstItem).forEach(key => {
    const value = firstItem[key]
    const column: DataColumn = {
      key,
      label: formatColumnLabel(key),
      sortable: true,
      filterable: true,
      width: getColumnWidth(key, value)
    }
    
    generatedColumns.push(column)
  })
  
  return generatedColumns
}

// Format column labels (e.g., "first_name" -> "First Name")
const formatColumnLabel = (key: string): string => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Determine column width based on key and value type
const getColumnWidth = (key: string, value: any): string => {
  if (key === 'id') return '80px'
  if (typeof value === 'boolean') return '100px'
  if (typeof value === 'number') return '120px'
  if (key.includes('date') || key.includes('created') || key.includes('updated')) return '140px'
  if (key.includes('email')) return '200px'
  if (key.includes('name')) return '150px'
  return 'auto'
}

export function CollectionDataTableWrapper({ 
  collectionName 
}: { 
  collectionName: string 
}) {
  const [columns, setColumns] = useState<DataColumn[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [displayName, setDisplayName] = useState<string>("")

  // Single useEffect that runs only once - no dependencies
  useEffect(() => {
    console.log('CollectionDataTableWrapper: useEffect running for collection:', collectionName)
    
    if (!collectionName) {
      console.error('No collection name provided')
      return
    }
    
    // Generate display name from collection name
    const formattedName = collectionName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/\b\w/g, l => l.toUpperCase()) // Ensure first letter of each word is capitalized
    setDisplayName(formattedName)
    
    // Fetch schema only once
    const fetchSchema = async () => {
      console.log('CollectionDataTableWrapper: Fetching schema for collection:', collectionName)
      try {
        setIsLoading(true)
        const response = await itemsAPI.list(collectionName.toLowerCase(), { limit: 1 })
        const data = response.data || []
        
        if (data.length > 0) {
          const generatedColumns = generateColumnsFromData(data)
          setColumns(generatedColumns)
        } else {
          // If no data, create basic columns
          setColumns([
            { key: 'id', label: 'ID', width: '80px', sortable: true, filterable: true },
            { key: 'name', label: 'Name', width: 'auto', sortable: true, filterable: true },
            { key: 'created_at', label: 'Created', width: '140px', sortable: true, filterable: true }
          ])
        }
      } catch (error) {
        console.error(`Error fetching schema for ${collectionName}:`, error)
        // Fallback to basic columns
        setColumns([
          { key: 'id', label: 'ID', width: '80px', sortable: true, filterable: true },
          { key: 'name', label: 'Name', width: 'auto', sortable: true, filterable: true }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchema()
  }, [collectionName]) // Add collectionName as dependency

  // Memoized operations to prevent recreation
  const operations = {
    create: async (data: any) => {
      try {
        await itemsAPI.create(collectionName.toLowerCase(), data)
        console.log(`Created ${collectionName} item:`, data)
      } catch (error) {
        console.error(`Error creating ${collectionName} item:`, error)
        throw error
      }
    },
    edit: async (id: string, data: any) => {
      try {
        await itemsAPI.update(collectionName.toLowerCase(), id, data)
        console.log(`Updated ${collectionName} item:`, id, data)
      } catch (error) {
        console.error(`Error updating ${collectionName} item:`, error)
        throw error
      }
    },
    delete: async (id: string) => {
      try {
        await itemsAPI.delete(collectionName.toLowerCase(), id)
        console.log(`Deleted ${collectionName} item:`, id)
      } catch (error) {
        console.error(`Error deleting ${collectionName} item:`, error)
        throw error
      }
    },
    view: (id: string) => {
      console.log(`Viewing ${collectionName} item:`, id)
    }
  }

  if (isLoading || !collectionName) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading schema...</span>
      </div>
    )
  }

  return (
    <CollectionDataTable
      collectionName={collectionName}
      displayName={displayName}
      columns={columns}
      onCreate={operations.create}
      onEdit={operations.edit}
      onDelete={operations.delete}
      onView={operations.view}
    />
  )
}
