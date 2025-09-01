import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { config } from '@/lib/config'

/**
 * Fields API Route
 * 
 * Next.js API route for handling field-related operations (schema management).
 * This route acts as a proxy between the frontend and the backend API,
 * forwarding authentication headers and handling responses.
 * 
 * Endpoints:
 * - GET /api/fields - List fields for a collection (supports both collection_id and name)
 * - POST /api/fields - Create a new field
 * 
 * Query Parameters (GET):
 * - collection_id: UUID of the collection
 * - name: Name of the collection (alternative to collection_id)
 * 
 * Request Body (POST):
 * - name: Field name (required)
 * - field_type: Field type (required)
 * - collection_id: Collection UUID (optional, if not provided, collection_name is required)
 * - collection_name: Collection name (optional, if not provided, collection_id is required)
 * - is_required: Whether field is required (optional)
 * - is_primary: Whether field is primary key (optional)
 * - validation_rules: JSON object with validation rules (optional)
 * 
 * Authentication:
 * - Requires Authorization header with Bearer token
 * - Token is forwarded to backend API for validation
 * 
 * @param request - Next.js request object
 * @returns JSON response with fields data or error
 */
export async function GET(request: NextRequest) {
  try {
    // Get the authorization header from the client request
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authorization header required',
          data: []
        },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const collectionId = searchParams.get('collection_id')
    const collectionName = searchParams.get('name')
    
    if (!collectionId && !collectionName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Collection ID or name is required',
          data: []
        },
        { status: 400 }
      )
    }
    
    // Build the query parameter
    const queryParam = collectionId ? `collection_id=${collectionId}` : `name=${collectionName}`
    
    // Make direct request to backend with forwarded auth header
    const response = await axios.get(`${config.api.baseURL}/items/fields?${queryParam}`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      timeout: config.api.timeout
    })
    
    return NextResponse.json({
      success: true,
      data: response.data.data || [],
      message: 'Fields retrieved successfully'
    })
  } catch (error: any) {
    console.error('API Error fetching fields:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch fields',
        data: []
      },
      { status: 500 }
    )
  }
}

/**
 * Create Field Endpoint
 * 
 * Creates a new field in the specified collection. Supports both UUID-based
 * collection IDs and collection names for maximum flexibility.
 * 
 * @param request - Next.js request object with field data in body
 * @returns JSON response with created field data or error
 */
export async function POST(request: NextRequest) {
  try {
    // Get the authorization header from the client request
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authorization header required',
          data: null
        },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    if ((!body.collection_id && !body.collection_name) || !body.name || !body.field_type) {
      return NextResponse.json(
        {
          success: false,
          error: 'Collection ID/name, field name, and field type are required',
          data: null
        },
        { status: 400 }
      )
    }
    
    // Make direct request to backend with forwarded auth header
    const response = await axios.post(`${config.api.baseURL}/items/fields`, body, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      timeout: config.api.timeout
    })
    
    return NextResponse.json({
      success: true,
      data: response.data.data,
      message: 'Field created successfully'
    }, { status: 201 })
  } catch (error: any) {
    console.error('API Error creating field:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create field',
        data: null
      },
      { status: 500 }
    )
  }
}
