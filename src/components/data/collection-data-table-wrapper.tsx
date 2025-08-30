"use client"

import { useState, useEffect } from "react"
import { CollectionDataTable, type DataColumn } from "./collection-data-table"
import { itemsAPI } from "@/lib/api"

interface CollectionDataTableWrapperProps {
  collectionName: string
}

export function CollectionDataTableWrapper({
  collectionName
}: CollectionDataTableWrapperProps) {
  const [columns, setColumns] = useState<DataColumn[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Generate columns dynamically from data
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

  // Fetch initial data to determine schema
  useEffect(() => {
    const fetchSchema = async () => {
      try {
        setIsLoading(true)
        const response = await itemsAPI.list(collectionName.toLowerCase(), { limit: 1 })
        const data = response.data || []
        
        if (data.length > 0) {
          const generatedColumns = generateColumnsFromData(data)
          setColumns(generatedColumns)
        } else {
          // If no data, create basic columns based on collection name
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
  }, [collectionName])

  // Real CRUD operations using your API
  const createOperations = (collection: string) => ({
    create: async (data: any) => {
      try {
        await itemsAPI.create(collection, data)
        console.log(`Created ${collection} item:`, data)
      } catch (error) {
        console.error(`Error creating ${collection} item:`, error)
        throw error
      }
    },
    edit: async (id: string, data: any) => {
      try {
        await itemsAPI.update(collection, id, data)
        console.log(`Updated ${collection} item:`, id, data)
      } catch (error) {
        console.error(`Error updating ${collection} item:`, error)
        throw error
      }
    },
    delete: async (id: string) => {
      try {
        await itemsAPI.delete(collection, id)
        console.log(`Deleted ${collection} item:`, id)
      } catch (error) {
        console.error(`Error deleting ${collection} item:`, error)
        throw error
      }
    },
    view: (id: string) => {
      // Navigate to detail page or open view modal
      console.log(`Viewing ${collection} item:`, id)
      // You could implement navigation here: router.push(`/dashboard/data/${collection}/${id}`)
    }
  })

  const operations = createOperations(collectionName.toLowerCase())

  if (isLoading) {
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
      columns={columns}
      onCreate={operations.create}
      onEdit={operations.edit}
      onDelete={operations.delete}
      onView={operations.view}
    />
  )
}
