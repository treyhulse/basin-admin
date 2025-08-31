# Centralized CRUD Architecture

This document describes the new centralized CRUD (Create, Read, Update, Delete) architecture for handling collection operations in the Basin Admin application.

## Overview

The new architecture provides a centralized, type-safe, and consistent way to handle CRUD operations across all collection types. It consists of several key components:

1. **CollectionService** - Centralized API service layer
2. **Schema Generator** - Dynamic form schema generation
3. **CRUD Hook** - React hook for managing CRUD state and operations
4. **Toast System** - User feedback for operations

## Architecture Components

### 1. CollectionService (`src/lib/services/collection-service.ts`)

The `CollectionService` class provides a unified interface for all collection operations:

```typescript
import { CollectionService } from '@/lib/services/collection-service'

const service = new CollectionService({ collectionName: 'users' })

// List items with pagination
const response = await service.list({ limit: 10, page: 1 })

// Create new item
const response = await service.create({ name: 'John', email: 'john@example.com' })

// Update existing item
const response = await service.update('user-id', { name: 'John Doe' })

// Delete item
const response = await service.delete('user-id')

// Get single item
const response = await service.get('user-id')
```

**Features:**
- Consistent error handling
- Type-safe responses
- Automatic authentication token management
- Centralized logging

### 2. Schema Generator (`src/lib/schemas/collection-schemas.ts`)

Automatically generates Zod schemas and form fields based on collection metadata:

```typescript
import { generateCollectionSchema, generateFormFields } from '@/lib/schemas/collection-schemas'

// Generate Zod schema for validation
const schema = generateCollectionSchema(columns)

// Generate React form fields
const formFields = generateFormFields(columns)
```

**Supported Field Types:**
- `text` - Standard text input
- `email` - Email input with validation
- `url` - URL input with validation
- `number` - Numeric input
- `boolean` - Checkbox
- `date` - Date picker
- `select` - Dropdown selection
- `textarea` - Multi-line text input

### 3. CRUD Hook (`src/hooks/use-collection-crud.ts`)

React hook that manages CRUD state and operations:

```typescript
import { useCollectionCrud } from '@/hooks/use-collection-crud'

const { state, actions, utils } = useCollectionCrud({
  collectionName: 'users',
  onSuccess: (message) => console.log('Success:', message),
  onError: (error) => console.error('Error:', error)
})

// Open forms in different modes
actions.openCreate()    // Open create form
actions.openEdit(item)  // Open edit form
actions.openView(item)  // Open view form
actions.openDelete(item) // Open delete confirmation

// Perform operations
await actions.create(data)  // Create new item
await actions.update(data)  // Update existing item
await actions.remove()      // Delete item

// Close form
actions.close()

// Generate schemas and fields
const schema = utils.generateSchema(columns)
const fields = utils.generateFields(columns)
```

**State Management:**
- Form open/close state
- Current operation mode (create/edit/view/delete)
- Selected item for editing
- Loading states

### 4. Toast System (`src/components/ui/toast.tsx`)

User feedback system for operation results:

```typescript
import { useToast } from '@/hooks/use-toast'

const toast = useToast()

// Show success message
toast.toast({ 
  title: "Success", 
  description: "Item created successfully", 
  variant: "success" 
})

// Show error message
toast.toast({ 
  title: "Error", 
  description: "Failed to create item", 
  variant: "destructive" 
})
```

## Usage Example

Here's a complete example of how to use the new system:

```typescript
// In your collection page component
import { useCollectionCrud } from '@/hooks/use-collection-crud'
import { useToast } from '@/hooks/use-toast'
import { ToastContainer } from '@/components/ui/toast'

export default function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const [collectionName, setCollectionName] = useState<string>("")
  const toast = useToast()

  const { actions, state } = useCollectionCrud({
    collectionName,
    onSuccess: (message) => toast.toast({ 
      title: "Success", 
      description: message, 
      variant: "success" 
    }),
    onError: (error) => toast.toast({ 
      title: "Error", 
      description: error, 
      variant: "destructive" 
    })
  })

  // ... rest of your component logic

  return (
    <div>
      <CollectionDataTableWrapper 
        collectionName={collectionName}
        crudActions={actions}
        crudState={state}
      />
      <ToastContainer 
        toasts={toast.toasts}
        onDismiss={toast.dismiss}
      />
    </div>
  )
}
```

## Benefits

1. **Consistency** - All collections use the same CRUD patterns
2. **Type Safety** - Full TypeScript support with proper interfaces
3. **Error Handling** - Centralized error handling and user feedback
4. **Maintainability** - Single source of truth for CRUD operations
5. **Scalability** - Easy to add new collections without duplicating code
6. **Testing** - Each layer can be tested independently
7. **Performance** - Optimized with React hooks and memoization

## Migration from Legacy System

The new system is designed to work alongside the existing legacy system:

- If `crudActions` and `crudState` are provided, the new system is used
- If not provided, the component falls back to legacy `onCreate`, `onEdit`, etc. props
- This allows for gradual migration without breaking existing functionality

## Future Enhancements

1. **Real-time Updates** - WebSocket integration for live data updates
2. **Bulk Operations** - Support for bulk create, update, and delete
3. **Advanced Filtering** - Complex query builders and filters
4. **Audit Logging** - Track all CRUD operations for compliance
5. **Caching** - Intelligent caching strategies for better performance
6. **Offline Support** - Queue operations when offline and sync when online

## Troubleshooting

### Common Issues

1. **Type Errors** - Ensure all interfaces are properly imported
2. **Missing Props** - Check that `crudActions` and `crudState` are passed correctly
3. **Schema Generation** - Verify that columns have proper `key` and `label` properties
4. **Toast Not Showing** - Ensure `ToastContainer` is rendered in the component tree

### Debug Mode

Enable debug logging by setting the environment variable:
```bash
NEXT_PUBLIC_DEBUG_CRUD=true
```

This will log all CRUD operations to the console for debugging purposes.
