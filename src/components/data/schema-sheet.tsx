"use client"

import { useState, useCallback } from "react"
import { z } from "zod"
import { Plus, Settings, Database, Frame } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { SheetForm, SheetFormField } from "@/components/ui/sheet-form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useSchemaManagement, FieldData } from "@/hooks/use-schema-management"

/**
 * Available Field Types
 * 
 * Defines the supported field types for collection fields with their
 * descriptions for user guidance.
 */
const FIELD_TYPES = [
  { value: 'text', label: 'Text', description: 'Single line text input' },
  { value: 'integer', label: 'Integer', description: 'Whole number' },
  { value: 'boolean', label: 'Boolean', description: 'True/false value' },
  { value: 'jsonb', label: 'JSON', description: 'Structured data' },
  { value: 'timestamp', label: 'Timestamp', description: 'Date and time' },
  { value: 'uuid', label: 'UUID', description: 'Unique identifier' }
]

/**
 * Field Validation Schema
 * 
 * Zod schema for validating field data before submission.
 * Ensures field names follow naming conventions and required fields are present.
 */
const fieldSchema = z.object({
  name: z.string()
    .min(1, 'Field name is required')
    .regex(/^[a-z_][a-z0-9_]*$/, 'Field name must be lowercase with underscores only')
    .max(50, 'Field name must be less than 50 characters'),
  display_name: z.string()
    .min(1, 'Display name is required')
    .max(100, 'Display name must be less than 100 characters'),
  field_type: z.enum(['text', 'integer', 'boolean', 'jsonb', 'timestamp', 'uuid']),
  is_required: z.boolean().default(false),
  is_primary: z.boolean().default(false),
  validation_rules: z.string().optional().refine((val) => {
    if (!val) return true
    try {
      JSON.parse(val)
      return true
    } catch {
      return false
    }
  }, 'Validation rules must be valid JSON')
})

/** Type for form data based on the validation schema */
type FieldFormData = z.infer<typeof fieldSchema>

/**
 * Schema Sheet Component Props
 */
interface SchemaSheetProps {
  /** Collection identifier (UUID or name) */
  collectionId: string
  /** Human-readable collection name for display */
  collectionName: string
  /** Whether the schema sheet is open */
  open: boolean
  /** Callback when sheet open state changes */
  onOpenChange: (open: boolean) => void
}

/**
 * Schema Sheet Component
 * 
 * A comprehensive UI component for managing collection schema (fields).
 * Provides a full-featured interface for creating, editing, viewing, and deleting
 * collection fields with real-time validation and user feedback.
 * 
 * Features:
 * - Field listing with type badges and metadata
 * - Create new fields with validation
 * - Edit existing fields
 * - View field details
 * - Delete fields with confirmation
 * - Real-time schema updates
 * - Toast notifications for user feedback
 * - Responsive design with proper loading states
 * 
 * @param props - Component props
 * @returns JSX element for the schema management interface
 * 
 * @example
 * ```tsx
 * <SchemaSheet
 *   collectionId="customers"
 *   collectionName="Customers"
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 * />
 * ```
 */
export function SchemaSheet({ 
  collectionId, 
  collectionName, 
  open, 
  onOpenChange 
}: SchemaSheetProps) {
  const [selectedField, setSelectedField] = useState<FieldData | null>(null)
  const [sheetMode, setSheetMode] = useState<'create' | 'edit' | 'view' | 'delete'>('create')
  const [isFieldSheetOpen, setIsFieldSheetOpen] = useState(false)

  const { state, actions } = useSchemaManagement({
    collectionId,
    onSuccess: (message) => {
      toast.success(message)
      if (sheetMode === 'create' || sheetMode === 'edit') {
        setIsFieldSheetOpen(false)
      }
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  // Open field sheet in different modes
  const openCreateField = useCallback(() => {
    setSelectedField(null)
    setSheetMode('create')
    setIsFieldSheetOpen(true)
  }, [])

  const openEditField = useCallback((field: FieldData) => {
    setSelectedField(field)
    setSheetMode('edit')
    setIsFieldSheetOpen(true)
  }, [])

  const openViewField = useCallback((field: FieldData) => {
    setSelectedField(field)
    setSheetMode('view')
    setIsFieldSheetOpen(true)
  }, [])

  const openDeleteField = useCallback((field: FieldData) => {
    setSelectedField(field)
    setSheetMode('delete')
    setIsFieldSheetOpen(true)
  }, [])

  // Handle field form submission
  const handleFieldSubmit = useCallback(async (data: FieldFormData) => {
    try {
      // Parse validation rules if provided
      const fieldData = {
        ...data,
        validation_rules: data.validation_rules ? JSON.parse(data.validation_rules) : undefined
      }

      if (sheetMode === 'create') {
        await actions.createField(fieldData)
      } else if (sheetMode === 'edit' && selectedField?.id) {
        await actions.updateField(selectedField.id, fieldData)
      }
    } catch (error) {
      toast.error('Invalid validation rules format')
    }
  }, [sheetMode, selectedField, actions])

  // Handle field deletion
  const handleFieldDelete = useCallback(async () => {
    if (selectedField?.id) {
      await actions.deleteField(selectedField.id)
    }
  }, [selectedField, actions])

  // Get default values for the form
  const getDefaultValues = useCallback((): Partial<FieldFormData> => {
    if (sheetMode === 'edit' && selectedField) {
      return {
        name: selectedField.name,
        display_name: selectedField.display_name || selectedField.name,
        field_type: selectedField.field_type,
        is_required: selectedField.is_required || false,
        is_primary: selectedField.is_primary || false,
        validation_rules: selectedField.validation_rules 
          ? JSON.stringify(selectedField.validation_rules, null, 2)
          : undefined
      }
    }
    
    return {
      name: '',
      display_name: '',
      field_type: 'text',
      is_required: false,
      is_primary: false
    }
  }, [sheetMode, selectedField])

  // Get sheet title and description
  const getSheetConfig = useCallback(() => {
    switch (sheetMode) {
      case 'create':
        return {
          title: 'Add New Field',
          description: `Add a new field to the ${collectionName} collection`
        }
      case 'edit':
        return {
          title: 'Edit Field',
          description: `Modify the ${selectedField?.display_name || selectedField?.name} field`
        }
      case 'view':
        return {
          title: 'Field Details',
          description: `View details of the ${selectedField?.display_name || selectedField?.name} field`
        }
      case 'delete':
        return {
          title: 'Delete Field',
          description: `Remove the ${selectedField?.display_name || selectedField?.name} field from the collection`
        }
      default:
        return {
          title: 'Manage Fields',
          description: `Manage the schema for ${collectionName} collection`
        }
    }
  }, [sheetMode, selectedField, collectionName])

  return (
    <>
      {/* Main Schema Sheet */}
      <SheetForm
        open={open}
        onOpenChange={onOpenChange}
        mode="view"
        title="Collection Schema"
        description={`Manage the schema and fields for ${collectionName}`}
        size="xl"
      >
        <div className="space-y-6">
          {/* Header with actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                {state.fields.length} fields
              </span>
            </div>
            <Button onClick={openCreateField} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </div>

          {/* Error display */}
          {state.error && (
            <div className="p-4 border border-destructive bg-destructive/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Frame className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">{state.error}</span>
              </div>
            </div>
          )}

          {/* Fields list */}
          {state.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">Loading schema...</span>
            </div>
          ) : state.fields.length === 0 ? (
            <div className="text-center py-8">
              <Frame className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No fields defined</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This collection doesn't have any fields yet. Add your first field to get started.
              </p>
              <Button onClick={openCreateField}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Field
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {state.fields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Frame className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{field.display_name || field.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {field.field_type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {field.is_primary && (
                        <Badge variant="default" className="text-xs">
                          Primary
                        </Badge>
                      )}
                      {field.is_required && (
                        <Badge variant="outline" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openViewField(field)}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditField(field)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteField(field)}
                      className="text-destructive hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Schema info */}
          <Separator />
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Collection ID:</strong> {collectionId}
            </p>
            <p>
              <strong>Total Fields:</strong> {state.fields.length}
            </p>
            <p>
              <strong>Primary Fields:</strong> {state.fields.filter(f => f.is_primary).length}
            </p>
            <p>
              <strong>Required Fields:</strong> {state.fields.filter(f => f.is_required).length}
            </p>
          </div>
        </div>
      </SheetForm>

      {/* Field Management Sheet */}
      <SheetForm
        open={isFieldSheetOpen}
        onOpenChange={setIsFieldSheetOpen}
        mode={sheetMode}
        title={getSheetConfig().title}
        description={getSheetConfig().description}
        schema={fieldSchema}
        defaultValues={getDefaultValues()}
        onSubmit={handleFieldSubmit}
        onDelete={handleFieldDelete}
        size="lg"
      >
        {sheetMode !== 'delete' && (
          <div className="space-y-4">
            <SheetFormField
              name="name"
              label="Field Name"
              description="Internal field name (lowercase, underscores only)"
            >
              <Input placeholder="field_name" />
            </SheetFormField>

            <SheetFormField
              name="display_name"
              label="Display Name"
              description="Human-readable name shown in the UI"
            >
              <Input placeholder="Field Name" />
            </SheetFormField>

            <SheetFormField
              name="field_type"
              label="Field Type"
              description="Data type for this field"
            >
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SheetFormField>

            <div className="flex items-center gap-4">
              <SheetFormField
                name="is_required"
                label="Required Field"
                description="Field must have a value"
                className="flex-1"
              >
                <Checkbox />
              </SheetFormField>

              <SheetFormField
                name="is_primary"
                label="Primary Field"
                description="Field is part of the primary key"
                className="flex-1"
              >
                <Checkbox />
              </SheetFormField>
            </div>

            <SheetFormField
              name="validation_rules"
              label="Validation Rules"
              description="Additional validation rules (JSON format)"
            >
              <Textarea 
                placeholder='{"min_length": 5, "max_length": 100}'
                className="font-mono text-sm"
                rows={3}
              />
            </SheetFormField>
          </div>
        )}
      </SheetForm>
    </>
  )
}
