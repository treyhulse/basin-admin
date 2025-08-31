"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { SheetForm, SheetFormField } from "@/components/ui/sheet-form"
import { z } from "zod"
import { CollectionService } from "@/lib/services/collection-service"

// Generic types for dynamic data
export interface CollectionData {
  id: string
  [key: string]: any
}

export interface CollectionDataTableProps {
  collectionName: string
  displayName: string
  data?: CollectionData[] // Make optional since we'll fetch it
  columns: DataColumn[] // Make optional since we'll fetch it
  loading?: boolean
  schema?: any
  fieldConfigs?: any[]
  crudActions?: any
  crudState?: any
  // Legacy props for backward compatibility
  onCreate?: (data: any) => Promise<void>
  onEdit?: (id: string, data: any) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onView?: (id: string) => void
}

export interface DataColumn {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, row: CollectionData) => React.ReactNode
  width?: string
}

// Generic schema for form validation with proper field types
const createGenericSchema = (columns: DataColumn[]) => {
  const schemaFields: Record<string, any> = {}
  
  columns.forEach(column => {
    if (column.key !== 'id') {
      const fieldType = getFieldType(column)
      schemaFields[column.key] = fieldType
    }
  })
  
  return z.object(schemaFields)
}

// Determine field type based on column key and data
const getFieldType = (column: DataColumn) => {
  const key = column.key.toLowerCase()
  
  // Email fields
  if (key.includes('email')) {
    return z.string().email('Invalid email address').min(1, `${column.label} is required`)
  }
  
  // URL fields
  if (key.includes('url') || key.includes('link')) {
    return z.string().url('Invalid URL').min(1, `${column.label} is required`)
  }
  
  // Date fields
  if (key.includes('date') || key.includes('created') || key.includes('updated')) {
    return z.string().min(1, `${column.label} is required`)
  }
  
  // Number fields
  if (key.includes('price') || key.includes('amount') || key.includes('total') || key.includes('count')) {
    return z.string().min(1, `${column.label} is required`).refine(val => !isNaN(Number(val)), 'Must be a valid number')
  }
  
  // Boolean fields
  if (key.includes('active') || key.includes('enabled') || key.includes('status')) {
    return z.boolean().optional()
  }
  
  // Default to string
  return z.string().min(1, `${column.label} is required`)
}

export function CollectionDataTable({
  collectionName,
  displayName,
  data,
  columns,
  loading = false,
  schema: propSchema,
  fieldConfigs,
  crudActions,
  crudState,
  onCreate,
  onEdit,
  onDelete,
  onView
}: CollectionDataTableProps) {
  // Debug logging
  console.log('CollectionDataTable props:', {
    collectionName,
    displayName,
    hasCrudActions: !!crudActions,
    hasCrudState: !!crudState,
    crudStateDetails: crudState
  })
  
  const [currentData, setCurrentData] = useState<CollectionData[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [filterText, setFilterText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  
  // Sheet form state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CollectionData | null>(null)
  const [editingData, setEditingData] = useState<any>({})

  // Fetch data from database
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const service = new CollectionService({ collectionName })
      const response = await service.list()
      setCurrentData(response.data || [])
    } catch (error) {
      console.error(`Error fetching ${collectionName} data:`, error)
      setCurrentData([])
    } finally {
      setIsLoading(false)
    }
  }, [collectionName])

  // Initial data fetch - only when collectionName changes
  useEffect(() => {
    console.log('CollectionDataTable: useEffect running for collection:', collectionName)
    if (collectionName) {
      console.log('CollectionDataTable: Fetching data for collection:', collectionName)
      fetchData()
    }
  }, [collectionName]) // Only depend on collectionName, not fetchData

  // Update data when prop changes (if provided)
  useEffect(() => {
    if (data) {
      setCurrentData(data)
    }
  }, [data])

  // Sorting
  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  // Filtering
  const filteredData = React.useMemo(() => {
    if (!filterText) return currentData
    
    return currentData.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(filterText.toLowerCase())
      )
    )
  }, [currentData, filterText])

  // Sorting
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData
    
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortConfig])

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = sortedData.slice(startIndex, endIndex)

  // Handle create
  const handleCreate = async (formData: any) => {
    if (onCreate) {
      await onCreate(formData)
      setIsCreateOpen(false)
      // Refresh data after creation
      fetchData()
    }
  }

  // Handle edit
  const handleEdit = async (formData: any) => {
    if (onEdit && selectedItem) {
      await onEdit(selectedItem.id, formData)
      setIsEditOpen(false)
      setSelectedItem(null)
      // Refresh data after edit
      fetchData()
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (onDelete && selectedItem) {
      await onDelete(selectedItem.id)
      setIsDeleteOpen(false)
      setSelectedItem(null)
      // Refresh data after deletion
      fetchData()
    }
  }

  // Open edit modal
  const openEdit = (item: CollectionData) => {
    setSelectedItem(item)
    setEditingData({ ...item })
    setIsEditOpen(true)
  }

  // Open delete modal
  const openDelete = (item: CollectionData) => {
    setSelectedItem(item)
    setIsDeleteOpen(true)
  }

  // Generate schema for forms
  const formSchema = createGenericSchema(columns)

  // Render cell value
  const renderCellValue = (column: DataColumn, item: CollectionData) => {
    const value = item[column.key]
    
    if (column.render) {
      return column.render(value, item)
    }
    
    // Default rendering
    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      )
    }
    
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">-</span>
    }
    
    // Format dates
    if (column.key.includes('date') || column.key.includes('created') || column.key.includes('updated')) {
      try {
        const date = new Date(value)
        if (!isNaN(date.getTime())) {
          return <span className="font-mono text-sm">{date.toLocaleDateString()}</span>
        }
      } catch (e) {
        // Fall through to string rendering
      }
    }
    
    // Format numbers
    if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
      const num = Number(value)
      if (column.key.includes('price') || column.key.includes('amount') || column.key.includes('total')) {
        return <span className="font-mono text-sm">${num.toFixed(2)}</span>
      }
      if (column.key.includes('percentage') || column.key.includes('rate')) {
        return <span className="font-mono text-sm">{num.toFixed(2)}%</span>
      }
      return <span className="font-mono text-sm">{num.toLocaleString()}</span>
    }
    
    // Format emails
    if (column.key.includes('email')) {
      return (
        <a 
          href={`mailto:${value}`} 
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {value}
        </a>
      )
    }
    
    // Format URLs
    if (column.key.includes('url') || column.key.includes('link')) {
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {value}
        </a>
      )
    }
    
    return String(value)
  }

  // Render appropriate form field based on column type
  const renderFormField = (column: DataColumn) => {
    const key = column.key.toLowerCase()
    
    // Email fields
    if (key.includes('email')) {
      return <Input type="email" placeholder={`Enter ${column.label.toLowerCase()}`} />
    }
    
    // URL fields
    if (key.includes('url') || key.includes('link')) {
      return <Input type="url" placeholder={`Enter ${column.label.toLowerCase()}`} />
    }
    
    // Date fields
    if (key.includes('date') || key.includes('created') || key.includes('updated')) {
      return <Input type="date" />
    }
    
    // Number fields
    if (key.includes('price') || key.includes('amount') || key.includes('total') || key.includes('count')) {
      return <Input type="number" step="0.01" placeholder={`Enter ${column.label.toLowerCase()}`} />
    }
    
    // Boolean fields
    if (key.includes('active') || key.includes('enabled') || key.includes('status')) {
      return (
        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      )
    }
    
    // Textarea for longer text fields
    if (key.includes('description') || key.includes('content') || key.includes('notes')) {
      return <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder={`Enter ${column.label.toLowerCase()}`} />
    }
    
    // Default to text input
    return <Input placeholder={`Enter ${column.label.toLowerCase()}`} />
  }

  // Create a form field renderer that works with react-hook-form and uses fieldConfigs
  const renderFormFieldWithForm = (column: DataColumn) => {
    // Find the field configuration for this column
    const fieldConfig = fieldConfigs?.find(field => field.key === column.key)
    
    if (fieldConfig) {
      // Use the field configuration to render the appropriate input
      switch (fieldConfig.type) {
        case 'email':
          return <Input type="email" placeholder={fieldConfig.placeholder || `Enter ${column.label.toLowerCase()}`} />
        
        case 'url':
          return <Input type="url" placeholder={fieldConfig.placeholder || `Enter ${column.label.toLowerCase()}`} />
        
        case 'number':
          return <Input type="number" step="0.01" placeholder={fieldConfig.placeholder || `Enter ${column.label.toLowerCase()}`} />
        
        case 'boolean':
          return (
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          )
        
        case 'date':
          return <Input type="date" />
        
        case 'select':
          if (fieldConfig.options && fieldConfig.options.length > 0) {
            return (
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="">Select {column.label.toLowerCase()}</option>
                {fieldConfig.options.map((option: string) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )
          }
          return <Input placeholder={fieldConfig.placeholder || `Enter ${column.label.toLowerCase()}`} />
        
        case 'textarea':
          return (
            <textarea 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
              placeholder={fieldConfig.placeholder || `Enter ${column.label.toLowerCase()}`} 
            />
          )
        
        default:
          return <Input placeholder={fieldConfig.placeholder || `Enter ${column.label.toLowerCase()}`} />
      }
    }
    
    // Fallback to basic field type detection if no fieldConfig
    const key = column.key.toLowerCase()
    
    // Email fields
    if (key.includes('email')) {
      return <Input type="email" placeholder={`Enter ${column.label.toLowerCase()}`} />
    }
    
    // URL fields
    if (key.includes('url') || key.includes('link')) {
      return <Input type="url" placeholder={`Enter ${column.label.toLowerCase()}`} />
    }
    
    // Date fields
    if (key.includes('date') || key.includes('created') || key.includes('updated')) {
      return <Input type="date" />
    }
    
    // Number fields
    if (key.includes('price') || key.includes('amount') || key.includes('total') || key.includes('count')) {
      return <Input type="number" step="0.01" placeholder={`Enter ${column.label.toLowerCase()}`} />
    }
    
    // Boolean fields
    if (key.includes('active') || key.includes('enabled') || key.includes('status')) {
      return (
        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      )
    }
    
    // Textarea for longer text fields
    if (key.includes('description') || key.includes('content') || key.includes('notes')) {
      return <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder={`Enter ${column.label.toLowerCase()}`} />
    }
    
    // Default to text input
    return <Input placeholder={`Enter ${column.label.toLowerCase()}`} />
  }

  if (loading || isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading {displayName}...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight">{displayName}</h2>
          <p className="text-muted-foreground">
            Manage your {displayName.toLowerCase()} data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchData}
            className="flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
          {/* Use centralized CRUD if available, otherwise fall back to legacy */}
          {crudActions ? (
            <Button onClick={crudActions.openCreate}>
              Add {displayName.slice(0, -1)}
            </Button>
          ) : onCreate ? (
            <Button onClick={() => setIsCreateOpen(true)}>
              Add {displayName.slice(0, -1)}
            </Button>
          ) : null}
        </div>
      </div>

      {/* Schema Display */}
      <Card>
        <CardHeader>
          <CardTitle>Collection Schema</CardTitle>
          <CardDescription>
            Field definitions and validation rules for {displayName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>View Schema ({columns.length} fields)</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {columns.map(column => {
                    const fieldConfig = fieldConfigs?.find(field => field.key === column.key)
                    return (
                      <div key={column.key} className="border rounded-lg p-3">
                        <div className="font-medium text-sm">{column.key}</div>
                        <div className="text-xs text-muted-foreground">{column.label}</div>
                        {fieldConfig && (
                          <div className="mt-2 space-y-1">
                            <div className="text-xs">
                              <span className="font-medium">Type:</span> {fieldConfig.type}
                            </div>
                            {fieldConfig.required && (
                              <div className="text-xs text-red-600">
                                <span className="font-medium">Required</span>
                              </div>
                            )}
                            {fieldConfig.minLength && (
                              <div className="text-xs">
                                <span className="font-medium">Min:</span> {fieldConfig.minLength}
                              </div>
                            )}
                            {fieldConfig.maxLength && (
                              <div className="text-xs">
                                <span className="font-medium">Max:</span> {fieldConfig.maxLength}
                              </div>
                            )}
                            {fieldConfig.options && fieldConfig.options.length > 0 && (
                              <div className="text-xs">
                                <span className="font-medium">Options:</span> {fieldConfig.options.join(', ')}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                
                {/* Concise Debug Info */}
                <div className="p-3 bg-muted rounded text-xs">
                  <div><strong>Schema Info:</strong></div>
                  <div>Fields: {columns.length} | Configs: {fieldConfigs?.length || 0} | Schema: {propSchema ? '✅' : '❌'}</div>
                  <div className="mt-2"><strong>Columns:</strong></div>
                  <div className="text-xs font-mono">
                    {columns.map(col => `${col.key} (${col.label})`).join(', ')}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search all fields..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="font-medium">{sortedData.length}</span> total items
              </div>
              {filterText && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">{filteredData.length}</span> filtered results
                </div>
              )}
              {sortConfig && (
                <div className="text-sm text-muted-foreground">
                  Sorted by <span className="font-medium">{sortConfig.key}</span> 
                  ({sortConfig.direction === 'asc' ? 'ascending' : 'descending'})
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className={`h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] ${
                          column.sortable ? 'cursor-pointer hover:text-foreground' : ''
                        }`}
                        style={{ width: column.width }}
                        onClick={() => column.sortable && handleSort(column.key)}
                      >
                        <div className="flex items-center gap-1">
                          {column.label}
                          {column.sortable && sortConfig?.key === column.key && (
                            <span className="text-foreground">
                              {sortConfig.direction === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] w-20">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {paginatedData.map((item, index) => (
                    <tr
                      key={item.id || index}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                        >
                          {renderCellValue(column, item)}
                        </td>
                      ))}
                      <td className="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {/* Use centralized CRUD if available, otherwise fall back to legacy */}
                            {crudActions ? (
                              <>
                                <DropdownMenuItem onClick={() => crudActions.openView(item)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => crudActions.openEdit(item)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => crudActions.openDelete(item)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <>
                                {onView && (
                                  <DropdownMenuItem onClick={() => onView(item.id)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                )}
                                {onEdit && (
                                  <DropdownMenuItem onClick={() => openEdit(item)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                )}
                                {onDelete && (
                                  <DropdownMenuItem 
                                    onClick={() => openDelete(item)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                                )}
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Centralized CRUD Form */}
      {(() => {
        console.log('About to render centralized CRUD form with fieldConfigs:', fieldConfigs)
        return null
      })()}
      {crudActions && crudState ? (
        <SheetForm
          open={crudState.isOpen}
          onOpenChange={crudActions.close}
          mode={crudState.mode}
          title={
            crudState.mode === 'create' 
              ? `Create ${displayName.slice(0, -1)}`
              : crudState.mode === 'edit'
              ? `Edit ${displayName.slice(0, -1)}`
              : crudState.mode === 'delete'
              ? `Delete ${displayName.slice(0, -1)}`
              : `View ${displayName.slice(0, -1)}`
          }
          description={
            crudState.mode === 'create'
              ? `Add a new ${displayName.slice(0, -1).toLowerCase()} to the collection`
              : crudState.mode === 'edit'
              ? `Update the ${displayName.slice(0, -1).toLowerCase()} information`
              : crudState.mode === 'delete'
              ? `Are you sure you want to delete this ${displayName.slice(0, -1).toLowerCase()}? This action cannot be undone.`
              : `View ${displayName.slice(0, -1).toLowerCase()} details`
          }
          schema={propSchema || formSchema}
          defaultValues={crudState.selectedItem || {}}
          onSubmit={crudState.mode === 'create' ? crudActions.create : crudActions.update}
          onDelete={crudState.mode === 'delete' ? crudActions.remove : undefined}
          loading={crudState.isLoading}
          fields={
            <div className="space-y-4">
              {columns
                .filter(col => col.key !== 'id')
                .map(column => (
                  <SheetFormField
                    key={column.key}
                    name={column.key}
                    label={column.label}
                  >
                    {renderFormFieldWithForm(column)}
                  </SheetFormField>
                ))}
            </div>
          }
        />
      ) : (
        <div className="text-sm text-muted-foreground p-4 text-center">
          Debug: crudActions: {crudActions ? '✅ available' : '❌ missing'}, 
          crudState: {crudState ? '✅ available' : '❌ missing'}
        </div>
      )}

              {/* Create Form */}
        {onCreate && (
          <SheetForm
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            mode="create"
            title={`Create ${displayName.slice(0, -1)}`}
            description={`Add a new ${displayName.slice(0, -1).toLowerCase()} to the collection`}
            schema={formSchema}
            onSubmit={handleCreate}
            fields={
              <div className="space-y-4">
                {columns
                  .filter(col => col.key !== 'id')
                  .map(column => (
                    <SheetFormField
                      key={column.key}
                      name={column.key}
                      label={column.label}
                    >
                      {renderFormField(column)}
                    </SheetFormField>
                  ))}
              </div>
            }
          />
        )}

              {/* Edit Form */}
        {onEdit && selectedItem && (
          <SheetForm
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            mode="edit"
            title={`Edit ${displayName.slice(0, -1)}`}
            description={`Update the ${displayName.slice(0, -1).toLowerCase()} information`}
            schema={formSchema}
            defaultValues={editingData}
            onSubmit={handleEdit}
            fields={
              <div className="space-y-4">
                {columns
                  .filter(col => col.key !== 'id')
                  .map(column => (
                    <SheetFormField
                      key={column.key}
                      name={column.key}
                      label={column.label}
                    >
                      {renderFormField(column)}
                    </SheetFormField>
                  ))}
              </div>
            }
          />
        )}

      {/* Delete Confirmation */}
      {onDelete && selectedItem && (
        <SheetForm
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          mode="delete"
          title={`Delete ${displayName.slice(0, -1)}`}
          description={`Are you sure you want to delete this ${displayName.slice(0, -1).toLowerCase()}? This action cannot be undone.`}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
