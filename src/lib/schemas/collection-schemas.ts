import { z } from 'zod'
import { DataColumn } from '@/components/data/collection-data-table'
import { SheetFormField } from '@/components/ui/sheet-form'

export interface FieldConfig {
  type: 'text' | 'email' | 'url' | 'number' | 'boolean' | 'date' | 'select' | 'textarea'
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: string
  options?: string[]
  placeholder?: string
  description?: string
  key?: string
  label?: string
}

export interface SchemaConfig {
  [fieldName: string]: FieldConfig
}

// Default field configurations for common field types
const defaultFieldConfigs: Record<string, FieldConfig> = {
  id: { type: 'text', required: false },
  name: { type: 'text', required: true, minLength: 1, maxLength: 100 },
  email: { type: 'email', required: true },
  url: { type: 'url', required: false },
  description: { type: 'textarea', required: false, maxLength: 500 },
  status: { type: 'select', required: false, options: ['active', 'inactive', 'pending'] },
  is_active: { type: 'boolean', required: false },
  created_at: { type: 'date', required: false },
  updated_at: { type: 'date', required: false }
}

// Generate Zod schema from columns and field configurations
export function generateCollectionSchema(
  columns: DataColumn[], 
  fieldConfigs?: SchemaConfig
): z.ZodSchema<any> {
  const schemaFields: Record<string, any> = {}
  
  columns.forEach(column => {
    if (column.key === 'id') return // Skip ID field for create forms
    
    const config = fieldConfigs?.[column.key] || inferFieldConfig(column)
    schemaFields[column.key] = createZodField(config, column)
  })
  
  return z.object(schemaFields)
}

// Infer field configuration from column data
function inferFieldConfig(column: DataColumn): FieldConfig {
  const key = column.key.toLowerCase()
  
  console.log(`inferFieldConfig: Inferring config for column ${column.key}`)
  
  // Check against default configurations
  for (const [pattern, config] of Object.entries(defaultFieldConfigs)) {
    if (key.includes(pattern)) {
      console.log(`Found pattern match for ${column.key}: ${pattern}`)
      return { ...config }
    }
  }
  
  // Enhanced field type detection based on column name patterns
  if (key.includes('email')) {
    console.log(`Inferring email type for ${column.key}`)
    return { type: 'email', required: true }
  }
  
  if (key.includes('url') || key.includes('link') || key.includes('website')) {
    console.log(`Inferring URL type for ${column.key}`)
    return { type: 'url', required: false }
  }
  
  if (key.includes('phone') || key.includes('mobile') || key.includes('tel')) {
    console.log(`Inferring text type for ${column.key}`)
    return { type: 'text', required: false }
  }
  
  if (key.includes('price') || key.includes('amount') || key.includes('cost') || key.includes('total') || key.includes('count') || key.includes('quantity')) {
    console.log(`Inferring number type for ${column.key}`)
    return { type: 'number', required: false }
  }
  
  if (key.includes('active') || key.includes('enabled') || key.includes('status') || key.includes('is_')) {
    console.log(`Inferring boolean type for ${column.key}`)
    return { type: 'boolean', required: false }
  }
  
  if (key.includes('date') || key.includes('created') || key.includes('updated') || key.includes('published')) {
    console.log(`Inferring date type for ${column.key}`)
    return { type: 'date', required: false }
  }
  
  if (key.includes('description') || key.includes('content') || key.includes('notes') || key.includes('comment') || key.includes('bio')) {
    console.log(`Inferring textarea type for ${column.key}`)
    return { type: 'textarea', required: false }
  }
  
  if (key.includes('category') || key.includes('type') || key.includes('status') || key.includes('role')) {
    console.log(`Inferring select type for ${column.key}`)
    return { type: 'select', required: false, options: ['active', 'inactive', 'pending'] }
  }
  
  // Default to text field
  console.log(`Defaulting to text type for ${column.key}`)
  return { type: 'text', required: false }
}

// Create Zod field based on configuration
function createZodField(config: FieldConfig, column: DataColumn): z.ZodTypeAny {
  let field: z.ZodTypeAny
  
  switch (config.type) {
    case 'email':
      field = z.string().email('Invalid email address')
      break
    case 'url':
      field = z.string().url('Invalid URL')
      break
    case 'number':
      field = z.string().refine(val => !isNaN(Number(val)), 'Must be a valid number')
      break
    case 'boolean':
      field = z.boolean()
      break
    case 'date':
      field = z.string()
      break
    case 'select':
      field = z.string()
      break
    case 'textarea':
      field = z.string()
      break
    default:
      field = z.string()
  }
  
  // Add validation rules - only apply to string fields
  if (config.type !== 'boolean' && config.required) {
    if (z.string().safeParse(field).success) {
      field = (field as z.ZodString).min(1, `${column.label} is required`)
    }
  }
  
  if (config.minLength && z.string().safeParse(field).success) {
    field = (field as z.ZodString).min(config.minLength, `Minimum length is ${config.minLength}`)
  }
  
  if (config.maxLength && z.string().safeParse(field).success) {
    field = (field as z.ZodString).max(config.maxLength, `Maximum length is ${config.maxLength}`)
  }
  
  if (config.pattern && z.string().safeParse(field).success) {
    field = (field as z.ZodString).regex(new RegExp(config.pattern), 'Invalid format')
  }
  
  return config.required ? field : field.optional()
}

// Generate form fields configuration for SheetForm
export function generateFormFields(
  columns: DataColumn[], 
  fieldConfigs?: SchemaConfig
): FieldConfig[] {
  console.log('generateFormFields: Generating fields for columns:', columns)
  
  return columns
    .filter(column => column.key !== 'id')
    .map(column => {
      const config = fieldConfigs?.[column.key] || inferFieldConfig(column)
      console.log(`Field ${column.key}:`, { column, config })
      
      // Enhance the basic config with smarter field detection
      const enhancedConfig = {
        ...config,
        key: column.key,
        label: column.label,
        placeholder: `Enter ${column.label.toLowerCase()}`,
        description: `Enter the ${column.label.toLowerCase()} for this item`
      }
      
      // Add required field logic for common required fields
      if (column.key === 'name' || column.key === 'title' || column.key === 'email') {
        enhancedConfig.required = true
      }
      
      // Add validation rules for common field types
      if (enhancedConfig.type === 'text' && column.key === 'name') {
        enhancedConfig.minLength = 1
        enhancedConfig.maxLength = 100
      }
      
      if (enhancedConfig.type === 'email') {
        enhancedConfig.required = true
      }
      
      if (enhancedConfig.type === 'textarea') {
        enhancedConfig.maxLength = 1000
      }
      
      console.log(`Enhanced field ${column.key}:`, enhancedConfig)
      return enhancedConfig
    })
}

// Helper function to create form field configuration
export function createFormFieldConfig(column: DataColumn, config: FieldConfig) {
  return {
    ...config,
    key: column.key,
    label: column.label
  }
}

// Generate columns from schema data instead of sample data
export function generateColumnsFromSchema(schemaData: any): DataColumn[] {
  console.log('generateColumnsFromSchema: Input schema data:', schemaData)
  
  // Handle the API response structure where fields are in data array
  let fieldsArray = schemaData
  
  // If schemaData has a data property, use that
  if (schemaData && schemaData.data && Array.isArray(schemaData.data)) {
    fieldsArray = schemaData.data
    console.log('generateColumnsFromSchema: Found fields in data array:', fieldsArray.length)
  }
  
  // If it's still not an array, try to find fields in other common structures
  if (!Array.isArray(fieldsArray)) {
    if (schemaData && schemaData.fields && Array.isArray(schemaData.fields)) {
      fieldsArray = schemaData.fields
      console.log('generateColumnsFromSchema: Found fields in fields array:', fieldsArray.length)
    } else {
      console.log('generateColumnsFromSchema: No valid fields array found in schema data')
      return []
    }
  }
  
  return fieldsArray.map((field: any) => {
    console.log('Processing schema field:', field)
    
    const column: DataColumn = {
      key: field.name || field.key || field.field_name,
      label: field.display_name || formatColumnLabel(field.name || field.key || field.field_name),
      sortable: true,
      filterable: true,
      width: getColumnWidthFromSchema(field)
    }
    
    console.log('Generated column:', column)
    return column
  })
}

// Format column labels (e.g., "first_name" -> "First Name")
function formatColumnLabel(key: string): string {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Determine column width based on schema field information
function getColumnWidthFromSchema(field: any): string {
  const fieldType = field.field_type || field.type || 'text'
  const key = field.name || field.key || ''
  
  if (key === 'id') return '80px'
  if (fieldType === 'boolean') return '100px'
  if (fieldType === 'number' || fieldType === 'integer' || fieldType === 'float') return '120px'
  if (key.includes('date') || key.includes('created') || key.includes('updated')) return '140px'
  if (key.includes('email')) return '200px'
  if (key.includes('name') || key.includes('title')) return '150px'
  if (fieldType === 'text' && field.max_length > 100) return '200px'
  return 'auto'
}

// Generate form fields from actual collection schema
export function generateFormFieldsFromSchema(
  columns: DataColumn[], 
  schema: any
): FieldConfig[] {
  console.log('generateFormFieldsFromSchema: Input schema:', schema)
  
  // Handle the API response structure where fields are in data array
  let fieldsArray = schema
  
  // If schema has a data property, use that
  if (schema && schema.data && Array.isArray(schema.data)) {
    fieldsArray = schema.data
    console.log('generateFormFieldsFromSchema: Found fields in data array:', fieldsArray.length)
  }
  
  // If it's still not an array, try to find fields in other common structures
  if (!Array.isArray(fieldsArray)) {
    if (schema && schema.fields && Array.isArray(schema.fields)) {
      fieldsArray = schema.fields
      console.log('generateFormFieldsFromSchema: Found fields in fields array:', fieldsArray.length)
    } else {
      console.log('generateFormFieldsFromSchema: No valid fields array found in schema')
      return []
    }
  }
  
  return columns
    .filter(column => column.key !== 'id')
    .map(column => {
      // Find the corresponding field in the schema data
      const schemaField = fieldsArray.find((field: any) => field.name === column.key)
      console.log(`Field ${column.key}:`, schemaField)
      
      if (schemaField) {
        // Use schema information to create proper field config
        return {
          type: inferFieldTypeFromSchema(schemaField),
          required: schemaField.is_required || schemaField.required || false,
          minLength: schemaField.min_length || schemaField.minLength,
          maxLength: schemaField.max_length || schemaField.maxLength,
          pattern: schemaField.pattern,
          options: schemaField.options || schemaField.enum,
          placeholder: `Enter ${column.label.toLowerCase()}`,
          description: schemaField.display_name || schemaField.description,
          key: column.key,
          label: column.label
        }
      } else {
        // Fallback to inferred configuration
        const config = inferFieldConfig(column)
        return {
          ...config,
          key: column.key,
          label: column.label
        }
      }
    })
}

// Generate Zod schema from actual collection schema
export function generateCollectionSchemaFromSchema(
  columns: DataColumn[], 
  schema: any
): z.ZodSchema<any> {
  console.log('generateCollectionSchemaFromSchema: Input schema:', schema)
  
  // Handle the API response structure where fields are in data array
  let fieldsArray = schema
  
  // If schema has a data property, use that
  if (schema && schema.data && Array.isArray(schema.data)) {
    fieldsArray = schema.data
    console.log('generateCollectionSchemaFromSchema: Found fields in data array:', fieldsArray.length)
  }
  
  // If it's still not an array, try to find fields in other common structures
  if (!Array.isArray(fieldsArray)) {
    if (schema && schema.fields && Array.isArray(schema.fields)) {
      fieldsArray = schema.fields
      console.log('generateCollectionSchemaFromSchema: Found fields in fields array:', fieldsArray.length)
    } else {
      console.log('generateCollectionSchemaFromSchema: No valid fields array found in schema')
      return z.object({})
    }
  }
  
  const schemaFields: Record<string, any> = {}
  
  columns.forEach(column => {
    if (column.key === 'id') return // Skip ID field for create forms
    
    // Find the corresponding field in the schema data
    const schemaField = fieldsArray.find((field: any) => field.name === column.key)
    console.log(`Schema field ${column.key}:`, schemaField)
    
    if (schemaField) {
      // Use schema information to create proper Zod field
      schemaFields[column.key] = createZodFieldFromSchema(schemaField, column)
    } else {
      // Fallback to basic field generation
      const config = inferFieldConfig(column)
      schemaFields[column.key] = createZodField(config, column)
    }
  })
  
  return z.object(schemaFields)
}

// Infer field type from schema information
function inferFieldTypeFromSchema(schemaField: any): FieldConfig['type'] {
  if (schemaField.type) {
    const type = schemaField.type.toLowerCase()
    console.log(`inferFieldTypeFromSchema: Processing type '${type}' for field '${schemaField.name}'`)
    
    if (type.includes('email')) return 'email'
    if (type.includes('url')) return 'url'
    if (type.includes('number') || type.includes('int') || type.includes('float')) return 'number'
    if (type.includes('bool')) return 'boolean'
    if (type.includes('date') || type.includes('datetime')) return 'date'
    if (type.includes('text') || type.includes('string')) return 'text'
    if (type.includes('json')) return 'textarea' // Handle JSON fields as textarea for now
    if (schemaField.enum || schemaField.options) return 'select'
    if (type.includes('text') && schemaField.max_length > 100) return 'textarea'
  }
  
  // Fallback based on field name
  const key = schemaField.name || schemaField.key || ''
  if (key.includes('email')) return 'email'
  if (key.includes('url')) return 'url'
  if (key.includes('description') || key.includes('content')) return 'textarea'
  if (key.includes('status') || key.includes('type')) return 'select'
  if (key.includes('tags')) return 'textarea' // Handle tags as textarea
  
  return 'text'
}

// Create Zod field from schema information
function createZodFieldFromSchema(schemaField: any, column: DataColumn): z.ZodTypeAny {
  const fieldType = inferFieldTypeFromSchema(schemaField)
  let field: z.ZodTypeAny
  
  switch (fieldType) {
    case 'email':
      field = z.string().email('Invalid email address')
      break
    case 'url':
      field = z.string().url('Invalid URL')
      break
    case 'number':
      field = z.string().refine(val => !isNaN(Number(val)), 'Must be a valid number')
      break
    case 'boolean':
      field = z.boolean()
      break
    case 'date':
      field = z.string()
      break
    case 'select':
      field = z.string()
      break
    case 'textarea':
      field = z.string()
      break
    default:
      field = z.string()
  }
  
  // Add validation rules based on schema
  if (schemaField.required && z.string().safeParse(field).success) {
    field = (field as z.ZodString).min(1, `${column.label} is required`)
  }
  
  if (schemaField.min_length && z.string().safeParse(field).success) {
    field = (field as z.ZodString).min(schemaField.min_length, `Minimum length is ${schemaField.min_length}`)
  }
  
  if (schemaField.max_length && z.string().safeParse(field).success) {
    field = (field as z.ZodString).max(schemaField.max_length, `Maximum length is ${schemaField.max_length}`)
  }
  
  if (schemaField.pattern && z.string().safeParse(field).success) {
    field = (field as z.ZodString).regex(new RegExp(schemaField.pattern), 'Invalid format')
  }
  
  return schemaField.required ? field : field.optional()
}


