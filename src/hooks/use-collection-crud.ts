import { useState, useCallback } from 'react'
import { CollectionService, ApiResponse, CollectionData } from '@/lib/services/collection-service'
import { generateCollectionSchema, generateFormFields } from '@/lib/schemas/collection-schemas'
import { DataColumn } from '@/components/data/collection-data-table'
import { toast } from 'sonner'

export interface UseCollectionCrudOptions {
  collectionName: string
  onSuccess?: (message: string) => void
  onError?: (error: string) => void
}

export interface CrudState {
  isOpen: boolean
  mode: 'create' | 'edit' | 'view' | 'delete'
  selectedItem: CollectionData | null
  isLoading: boolean
}

export function useCollectionCrud({ 
  collectionName, 
  onSuccess, 
  onError 
}: UseCollectionCrudOptions) {
  const [state, setState] = useState<CrudState>({
    isOpen: false,
    mode: 'create',
    selectedItem: null,
    isLoading: false
  })
  
  // Only create service when we have a valid collection name
  const service = collectionName ? new CollectionService({ collectionName }) : null
  
  // Open form in different modes
  const openCreate = useCallback(() => {
    console.log('openCreate called, setting state...')
    setState(prev => {
      const newState: CrudState = {
        ...prev,
        isOpen: true,
        mode: 'create',
        selectedItem: null
      }
      console.log('New state:', newState)
      return newState
    })
  }, [])
  
  const openEdit = useCallback((item: CollectionData) => {
    setState(prev => ({
      ...prev,
      isOpen: true,
      mode: 'edit',
      selectedItem: item
    }))
  }, [])
  
  const openView = useCallback((item: CollectionData) => {
    setState(prev => ({
      ...prev,
      isOpen: true,
      mode: 'view',
      selectedItem: item
    }))
  }, [])
  
  const openDelete = useCallback((item: CollectionData) => {
    setState(prev => ({
      ...prev,
      isOpen: true,
      mode: 'delete',
      selectedItem: item
    }))
  }, [])
  
  const close = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false,
      selectedItem: null
    }))
  }, [])
  
  // CRUD operations
  const create = useCallback(async (data: Partial<CollectionData>) => {
    console.log('useCollectionCrud: create function called with data:', data)
    
    if (!service) {
      console.log('useCollectionCrud: No service available')
      toast.error('Collection service not available')
      return
    }
    
    console.log('useCollectionCrud: Calling service.create...')
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const response = await service.create(data)
      console.log('useCollectionCrud: Service response:', response)
      if (response.success) {
        toast.success(response.message || 'Item created successfully')
        onSuccess?.(response.message || 'Item created successfully')
        close()
        return response.data
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create item'
      toast.error(message)
      onError?.(message)
      throw error
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [service, onSuccess, onError, close])
  
  const update = useCallback(async (data: Partial<CollectionData>) => {
    if (!service) {
      toast.error('Collection service not available')
      return
    }
    
    if (!state.selectedItem?.id) return
    
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const response = await service.update(state.selectedItem.id, data)
      if (response.success) {
        toast.success(response.message || 'Item updated successfully')
        onSuccess?.(response.message || 'Item updated successfully')
        close()
        return response.data
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update item'
      toast.error(message)
      onError?.(message)
      throw error
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [service, state.selectedItem?.id, onSuccess, onError, close])
  
    const remove = useCallback(async () => {
    if (!service) {
      toast.error('Collection service not available')
      return
    }
    
    if (!state.selectedItem?.id) return
    
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      const response = await service.delete(state.selectedItem.id)
      if (response.success) {
        toast.success(response.message || 'Item deleted successfully')
        onSuccess?.(response.message || 'Item deleted successfully')
        close()
        return response.data
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete item'
      toast.error(message)
      onError?.(message)
      throw error
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [service, state.selectedItem?.id, onSuccess, onError, close])
  
  // Generate schema and fields
  const generateSchema = useCallback((columns: DataColumn[]) => {
    return generateCollectionSchema(columns)
  }, [])
  
  const generateFields = useCallback((columns: DataColumn[]) => {
    return generateFormFields(columns)
  }, [])
  
  return {
    state,
    actions: {
      openCreate,
      openEdit,
      openView,
      openDelete,
      close,
      create,
      update,
      remove
    },
    utils: {
      generateSchema,
      generateFields
    }
  }
}
