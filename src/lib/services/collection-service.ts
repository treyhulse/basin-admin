import { itemsAPI, collectionsAPI, fieldsAPI } from '@/lib/api'

export interface CollectionData {
  id: string
  [key: string]: any
}

export interface CollectionServiceConfig {
  collectionName: string
  baseUrl?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginationParams {
  limit?: number
  offset?: number
  page?: number
  per_page?: number
  sort?: string
  order?: string
  filter?: string
}

export class CollectionService {
  private collectionName: string
  private baseUrl: string

  constructor(config: CollectionServiceConfig) {
    this.collectionName = config.collectionName
    this.baseUrl = config.baseUrl || '/items'
  }

  // List items with pagination and filtering
  async list(params?: PaginationParams): Promise<ApiResponse<CollectionData[]>> {
    try {
      const response = await itemsAPI.list(this.collectionName, params)
      return {
        data: response.data || [],
        success: true,
        message: 'Items retrieved successfully'
      }
    } catch (error) {
      return this.handleError(error, 'Failed to retrieve items')
    }
  }

  // Get single item by ID
  async get(id: string): Promise<ApiResponse<CollectionData>> {
    try {
      const response = await itemsAPI.get(this.collectionName, id)
      return {
        data: response.data,
        success: true,
        message: 'Item retrieved successfully'
      }
    } catch (error) {
      return this.handleError(error, 'Failed to retrieve item')
    }
  }

  // Create new item
  async create(data: Partial<CollectionData>): Promise<ApiResponse<CollectionData>> {
    try {
      console.log(`CollectionService: Creating ${this.collectionName} item`)
      console.log('CollectionService: Data being sent:', data)
      console.log('CollectionService: Collection name:', this.collectionName)
      
      const response = await itemsAPI.create(this.collectionName, data)
      console.log('CollectionService: API response:', response)
      
      return {
        data: response.data,
        success: true,
        message: 'Item created successfully'
      }
    } catch (error) {
      console.log('CollectionService: API error:', error)
      console.log('CollectionService: Error response:', (error as any).response?.data)
      return this.handleError(error, 'Failed to create item')
    }
  }

  // Update existing item
  async update(id: string, data: Partial<CollectionData>): Promise<ApiResponse<CollectionData>> {
    try {
      const response = await itemsAPI.update(this.collectionName, id, data)
      return {
        data: response.data,
        success: true,
        message: 'Item updated successfully'
      }
    } catch (error) {
      return this.handleError(error, 'Failed to update item')
    }
  }

  // Delete item
  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      await itemsAPI.delete(this.collectionName, id)
      return {
        data: undefined as any,
        success: true,
        message: 'Item deleted successfully'
      }
    } catch (error) {
      return this.handleError(error, 'Failed to delete item')
    }
  }

  // Get collection metadata by name
  async getCollectionMetadata(): Promise<ApiResponse<any>> {
    try {
      console.log(`CollectionService: Fetching metadata for ${this.collectionName}`)
      
      const response = await collectionsAPI.getByName(this.collectionName)
      const collection = response.data?.[0] // getByName returns an array, take first match
      
      if (!collection) {
        return {
          data: null,
          success: false,
          message: 'Collection not found'
        }
      }
      
      return {
        data: collection,
        success: true,
        message: 'Collection metadata retrieved successfully'
      }
    } catch (error) {
      return this.handleError(error, 'Failed to retrieve collection metadata')
    }
  }

  // Get collection schema/metadata
  async getSchema(): Promise<ApiResponse<any>> {
    try {
      console.log(`CollectionService: Fetching schema for ${this.collectionName}`)
      
      // First try to get the collection ID by name using your existing API
      const collectionsResponse = await collectionsAPI.list()
      const collection = collectionsResponse.data?.find((col: any) => col.name === this.collectionName)
      
      if (!collection) {
        console.log('CollectionService: Collection not found, falling back to data inference')
        // Fallback to old method
        const response = await itemsAPI.list(this.collectionName, { limit: 1 })
        const schema = response.schema || response.meta?.schema || {}
        return {
          data: schema,
          success: true,
          message: 'Schema retrieved successfully'
        }
      }
      
      console.log('CollectionService: Found collection:', collection)
      
      // Use the dedicated fields endpoint from your backend
      const fieldsData = await fieldsAPI.getByCollection(collection.id)
      console.log('CollectionService: Fields response:', fieldsData)
      
      return {
        data: fieldsData,
        success: true,
        message: 'Schema retrieved successfully'
      }
    } catch (error) {
      console.log('CollectionService: Schema fetch error:', error)
      return this.handleError(error, 'Failed to retrieve schema')
    }
  }

  private handleError(error: any, defaultMessage: string): ApiResponse<any> {
    console.error(`CollectionService Error (${this.collectionName}):`, error)
    
    const message = error.response?.data?.message || error.message || defaultMessage
    const status = error.response?.status || 500
    
    return {
      data: null,
      success: false,
      message: `${message} (${status})`
    }
  }
}

// Factory function to create service instances
export const createCollectionService = (collectionName: string) => {
  return new CollectionService({ collectionName })
}
