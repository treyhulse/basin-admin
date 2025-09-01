import { fieldsAPI, nextApi } from '@/lib/api'

/**
 * Field Data Interface
 * 
 * Represents a collection field with all its metadata and configuration.
 * This interface defines the structure of field data used throughout
 * the schema management system.
 */
export interface FieldData {
  /** Unique identifier for the field (UUID) */
  id?: string
  /** Field name (must be unique within collection, snake_case recommended) */
  name: string
  /** Human-readable display name for the field */
  display_name?: string
  /** ID of the collection this field belongs to */
  collection_id: string
  /** Data type of the field - determines validation and storage */
  field_type: 'text' | 'integer' | 'boolean' | 'jsonb' | 'timestamp' | 'uuid'
  /** Whether this field is required for record creation */
  is_required?: boolean
  /** Whether this field is the primary key for the collection */
  is_primary?: boolean
  /** Additional validation rules as JSON object */
  validation_rules?: Record<string, unknown>
  /** Tenant ID for multi-tenant support */
  tenant_id?: string
  /** Timestamp when the field was created */
  created_at?: string
  /** Timestamp when the field was last updated */
  updated_at?: string
}

/**
 * Field Service Configuration
 * 
 * Configuration object for initializing the FieldService instance.
 */
export interface FieldServiceConfig {
  /** Collection identifier (can be UUID or collection name) */
  collectionId: string
  /** Base URL for API endpoints (defaults to '/api/fields') */
  baseUrl?: string
}

/**
 * API Response Wrapper
 * 
 * Standard response format for all API operations, providing
 * consistent structure for success/error handling.
 */
export interface ApiResponse<T> {
  /** Response data payload */
  data: T
  /** Human-readable message describing the operation result */
  message?: string
  /** Whether the operation was successful */
  success: boolean
}

/**
 * Pagination Parameters
 * 
 * Parameters for controlling pagination in list operations.
 */
export interface PaginationParams {
  /** Maximum number of items to return */
  limit?: number
  /** Number of items to skip (for offset-based pagination) */
  offset?: number
  /** Page number (for page-based pagination) */
  page?: number
  /** Items per page (alternative to limit) */
  per_page?: number
  /** Field name to sort by */
  sort?: string
  /** Sort order: 'asc' or 'desc' */
  order?: string
  /** Filter criteria */
  filter?: string
}

/**
 * Field Service
 * 
 * A comprehensive service for managing collection fields (schema management).
 * This service provides CRUD operations for fields and handles both UUID-based
 * collection IDs and collection names for maximum flexibility.
 * 
 * Key Features:
 * - Full CRUD operations (Create, Read, Update, Delete)
 * - Automatic collection ID/name detection and handling
 * - Schema retrieval with field sorting
 * - Comprehensive error handling and logging
 * - Integration with Next.js API routes for authentication
 * 
 * @example
 * ```typescript
 * // Initialize service with collection name
 * const fieldService = new FieldService({ collectionId: 'customers' })
 * 
 * // Get all fields for the collection
 * const fields = await fieldService.getSchema()
 * 
 * // Create a new field
 * const newField = await fieldService.create({
 *   name: 'email',
 *   field_type: 'text',
 *   is_required: true
 * })
 * ```
 */
export class FieldService {
  /** Collection identifier (UUID or name) */
  private collectionId: string
  /** Base URL for API endpoints */
  private baseUrl: string

  /**
   * Initialize the Field Service
   * 
   * @param config - Service configuration
   * @param config.collectionId - Collection identifier (UUID or name)
   * @param config.baseUrl - API base URL (defaults to '/api/fields')
   */
  constructor(config: FieldServiceConfig) {
    this.collectionId = config.collectionId
    this.baseUrl = config.baseUrl || '/api/fields'
  }

  /**
   * List fields for a specific collection
   * 
   * Retrieves all fields belonging to the configured collection with optional
   * pagination parameters. Automatically detects whether to use collection_id
   * or collection name based on the identifier format.
   * 
   * @param params - Optional pagination parameters
   * @returns Promise resolving to API response with field data array
   * 
   * @example
   * ```typescript
   * // Get all fields
   * const response = await fieldService.list()
   * 
   * // Get fields with pagination
   * const response = await fieldService.list({ limit: 10, offset: 0 })
   * ```
   */
  async list(params?: PaginationParams): Promise<ApiResponse<FieldData[]>> {
    try {
      // Try to use collection_id if it looks like a UUID, otherwise use name
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(this.collectionId)
      const paramName = isUuid ? 'collection_id' : 'name'
      
      const response = await nextApi.get(`${this.baseUrl}?${paramName}=${this.collectionId}`)
      
      return {
        data: response.data.data || [],
        success: true,
        message: 'Fields retrieved successfully'
      }
    } catch (error) {
      return this.handleError(error, 'Failed to retrieve fields')
    }
  }

  /**
   * Get single field by ID
   * 
   * Retrieves a specific field by its unique identifier.
   * 
   * @param id - Field ID (UUID)
   * @returns Promise resolving to API response with field data
   * 
   * @example
   * ```typescript
   * const field = await fieldService.get('field-uuid-here')
   * ```
   */
  async get(id: string): Promise<ApiResponse<FieldData>> {
    try {
      const response = await nextApi.get(`${this.baseUrl}/${id}`)
      
      return {
        data: response.data.data,
        success: true,
        message: 'Field retrieved successfully'
      }
    } catch (error) {
      return this.handleError(error, 'Failed to retrieve field')
    }
  }

  /**
   * Create new field
   * 
   * Creates a new field in the collection. Automatically determines whether
   * to use collection_id or collection_name based on the service configuration.
   * 
   * @param data - Field data (name and field_type are required)
   * @returns Promise resolving to API response with created field data
   * 
   * @example
   * ```typescript
   * const newField = await fieldService.create({
   *   name: 'email',
   *   field_type: 'text',
   *   is_required: true,
   *   validation_rules: { maxLength: 255 }
   * })
   * ```
   */
  async create(data: Partial<FieldData>): Promise<ApiResponse<FieldData>> {
    try {
      console.log(`FieldService: Creating field for collection ${this.collectionId}`)
      console.log('FieldService: Data being sent:', data)
      
      // Determine if we have a UUID or collection name
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(this.collectionId)
      
      const fieldData = {
        ...data,
        [isUuid ? 'collection_id' : 'collection_name']: this.collectionId
      }
      
      const response = await nextApi.post(this.baseUrl, fieldData)
      
      console.log('FieldService: API response:', response.data)
      
      return {
        data: response.data.data,
        success: true,
        message: 'Field created successfully'
      }
    } catch (error) {
      console.log('FieldService: API error:', error)
      return this.handleError(error, 'Failed to create field')
    }
  }

  /**
   * Update existing field
   * 
   * Updates an existing field with new data. Only provided fields will be updated.
   * 
   * @param id - Field ID (UUID) to update
   * @param data - Partial field data to update
   * @returns Promise resolving to API response with updated field data
   * 
   * @example
   * ```typescript
   * const updatedField = await fieldService.update('field-uuid', {
   *   is_required: true,
   *   validation_rules: { minLength: 5 }
   * })
   * ```
   */
  async update(id: string, data: Partial<FieldData>): Promise<ApiResponse<FieldData>> {
    try {
      const response = await nextApi.put(`${this.baseUrl}/${id}`, data)
      
      return {
        data: response.data.data,
        success: true,
        message: 'Field updated successfully'
      }
    } catch (error) {
      return this.handleError(error, 'Failed to update field')
    }
  }

  /**
   * Delete field
   * 
   * Permanently deletes a field from the collection. This operation cannot be undone.
   * 
   * @param id - Field ID (UUID) to delete
   * @returns Promise resolving to API response (no data returned)
   * 
   * @example
   * ```typescript
   * await fieldService.delete('field-uuid')
   * ```
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      await nextApi.delete(`${this.baseUrl}/${id}`)
      
      return {
        data: undefined,
        success: true,
        message: 'Field deleted successfully'
      }
    } catch (error) {
      return this.handleError(error, 'Failed to delete field')
    }
  }

  /**
   * Get fields by collection
   * 
   * Retrieves all fields for the configured collection. This is an alias
   * for the list() method with the same functionality.
   * 
   * @returns Promise resolving to API response with field data array
   * 
   * @example
   * ```typescript
   * const fields = await fieldService.getByCollection()
   * ```
   */
  async getByCollection(): Promise<ApiResponse<FieldData[]>> {
    try {
      // Try to use collection_id if it looks like a UUID, otherwise use name
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(this.collectionId)
      const paramName = isUuid ? 'collection_id' : 'name'
      
      const response = await nextApi.get(`${this.baseUrl}?${paramName}=${this.collectionId}`)
      
      return {
        data: response.data.data || [],
        success: true,
        message: 'Collection fields retrieved successfully'
      }
    } catch (error) {
      return this.handleError(error, 'Failed to retrieve collection fields')
    }
  }

  /**
   * Get collection schema
   * 
   * Retrieves the complete schema for the collection, including all fields
   * sorted by priority (primary fields first, then by creation order).
   * This is the recommended method for getting the collection structure.
   * 
   * @returns Promise resolving to API response with sorted field data array
   * 
   * @example
   * ```typescript
   * const schema = await fieldService.getSchema()
   * // Fields are automatically sorted: primary fields first, then by creation date
   * ```
   */
  async getSchema(): Promise<ApiResponse<FieldData[]>> {
    try {
      // Try to use collection_id if it looks like a UUID, otherwise use name
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(this.collectionId)
      const paramName = isUuid ? 'collection_id' : 'name'
      
      const response = await nextApi.get(`${this.baseUrl}?${paramName}=${this.collectionId}`)
      const fields = response.data.data || []
      
      // Sort fields by creation order or custom order
      const sortedFields = fields.sort((a: FieldData, b: FieldData) => {
        if (a.is_primary && !b.is_primary) return -1
        if (!a.is_primary && b.is_primary) return 1
        return (a.created_at || '').localeCompare(b.created_at || '')
      })
      
      return {
        data: sortedFields,
        success: true,
        message: 'Collection schema retrieved successfully'
      }
    } catch (error) {
      return this.handleError(error, 'Failed to retrieve collection schema')
    }
  }

  /**
   * Handle API errors
   * 
   * Centralized error handling for all API operations. Provides consistent
   * error response format and logging for debugging purposes.
   * 
   * @param error - The error object from the API call
   * @param defaultMessage - Default error message if none is provided
   * @returns Standardized error response
   * 
   * @private
   */
  private handleError(error: any, defaultMessage: string): ApiResponse<any> {
    console.error('FieldService error:', error)
    
    let message = defaultMessage
    if (error.response?.data?.error) {
      message = error.response.data.error
    } else if (error.message) {
      message = error.message
    }
    
    return {
      data: null,
      success: false,
      message
    }
  }
}
