"use client"

import { useState, useEffect } from "react"
import { CollectionDataTable, type DataColumn } from "./collection-data-table"
import { CollectionService } from "@/lib/services/collection-service"
import { 
  generateCollectionSchema, 
  generateFormFields,
  generateFormFieldsFromSchema,
  generateCollectionSchemaFromSchema,
  generateColumnsFromSchema
} from "@/lib/schemas/collection-schemas"

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
  collectionName,
  crudActions,
  crudState
}: { 
  collectionName: string
  crudActions?: any
  crudState?: any
}) {
  const [columns, setColumns] = useState<DataColumn[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [displayName, setDisplayName] = useState<string>("")
  const [formFields, setFormFields] = useState<any[]>([])
  const [formSchema, setFormSchema] = useState<any>(null)

  // Single useEffect that handles everything
  useEffect(() => {
    if (!collectionName) return

    const initializeCollection = async () => {
      try {
        setIsLoading(true)
        
        // Generate display name
        const formattedName = collectionName
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
          .replace(/\b\w/g, l => l.toUpperCase())
        setDisplayName(formattedName)

        // Initialize service and fetch data
        const service = new CollectionService({ collectionName })
        const response = await service.list({ limit: 1 })
        const data = response.data || []
        
        let generatedColumns: DataColumn[]
        if (data.length > 0) {
          generatedColumns = generateColumnsFromData(data)
        } else {
          // Fallback columns
          generatedColumns = [
            { key: 'id', label: 'ID', width: '80px', sortable: true, filterable: true },
            { key: 'name', label: 'Name', width: 'auto', sortable: true, filterable: true },
            { key: 'created_at', label: 'Created', width: '140px', sortable: true, filterable: true }
          ]
        }
        
        setColumns(generatedColumns)
        
        // Generate form configuration using schema if available
        let fields, schema, finalColumns
        
        try {
          // Try to get schema from the service
          const schemaResponse = await service.getSchema()
          if (schemaResponse.success && schemaResponse.data) {
            console.log('CollectionDataTableWrapper: Using schema-based field generation')
            
            // Generate columns from the actual schema instead of data
            const schemaColumns = generateColumnsFromSchema(schemaResponse.data)
            console.log('CollectionDataTableWrapper: Schema-based columns:', schemaColumns)
            
            // Use schema columns if available, otherwise fall back to data columns
            finalColumns = schemaColumns.length > 0 ? schemaColumns : generatedColumns
            
            fields = generateFormFieldsFromSchema(finalColumns, schemaResponse.data)
            schema = generateCollectionSchemaFromSchema(finalColumns, schemaResponse.data)
          } else {
            console.log('CollectionDataTableWrapper: No schema available, using basic field generation')
            finalColumns = generatedColumns
            fields = generateFormFields(finalColumns)
            schema = generateCollectionSchema(finalColumns)
          }
        } catch (error) {
          console.log('CollectionDataTableWrapper: Schema fetch failed, using basic field generation:', error)
          finalColumns = generatedColumns
          fields = generateFormFields(finalColumns)
          schema = generateCollectionSchema(finalColumns)
        }
        
        console.log('CollectionDataTableWrapper: Final columns:', finalColumns)
        console.log('CollectionDataTableWrapper: Generated fields:', fields)
        console.log('CollectionDataTableWrapper: Generated schema:', schema)
        
        setColumns(finalColumns)
        setFormFields(fields)
        setFormSchema(schema)
        
      } catch (error) {
        console.error(`Error initializing collection ${collectionName}:`, error)
        
        // Set fallback values on error
        setColumns([
          { key: 'id', label: 'ID', width: '80px', sortable: true, filterable: true },
          { key: 'name', label: 'Name', width: 'auto', sortable: true, filterable: true }
        ])
        
        const fallbackFields = generateFormFields([
          { key: 'id', label: 'ID', width: '80px', sortable: true, filterable: true },
          { key: 'name', label: 'Name', width: 'auto', sortable: true, filterable: true }
        ])
        const fallbackSchema = generateCollectionSchema([
          { key: 'id', label: 'ID', width: '80px', sortable: true, filterable: true },
          { key: 'name', label: 'Name', width: 'auto', sortable: true, filterable: true }
        ])
        
        setFormFields(fallbackFields)
        setFormSchema(fallbackSchema)
      } finally {
        setIsLoading(false)
      }
    }

    initializeCollection()
  }, [collectionName])

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
      schema={formSchema}
      fieldConfigs={formFields}
      crudActions={crudActions}
      crudState={crudState}
    />
  )
}
