import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { config } from '@/lib/config'

/**
 * Field by ID API Route
 * 
 * Next.js API route for handling individual field operations by ID.
 * This route acts as a proxy between the frontend and the backend API,
 * forwarding authentication headers and handling responses.
 * 
 * Endpoints:
 * - GET /api/fields/[id] - Get a specific field by ID
 * - PUT /api/fields/[id] - Update a specific field by ID
 * - DELETE /api/fields/[id] - Delete a specific field by ID
 * 
 * URL Parameters:
 * - id: Field ID (UUID)
 * 
 * Authentication:
 * - Requires Authorization header with Bearer token
 * - Token is forwarded to backend API for validation
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing the field ID
 * @returns JSON response with field data or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Make direct request to backend with forwarded auth header
    const response = await axios.get(`${config.api.baseURL}/items/fields/${params.id}`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      timeout: config.api.timeout
    })
    
    return NextResponse.json({
      success: true,
      data: response.data.data,
      message: 'Field retrieved successfully'
    })
  } catch (error: any) {
    console.error('API Error fetching field:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch field',
        data: null
      },
      { status: 500 }
    )
  }
}

/**
 * Update Field Endpoint
 * 
 * Updates an existing field with new data. Only provided fields will be updated.
 * 
 * @param request - Next.js request object with updated field data in body
 * @param params - Route parameters containing the field ID
 * @returns JSON response with updated field data or error
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    if (!body.name || !body.field_type) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name and field type are required',
          data: null
        },
        { status: 400 }
      )
    }
    
    // Make direct request to backend with forwarded auth header
    const response = await axios.put(`${config.api.baseURL}/items/fields/${params.id}`, body, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      timeout: config.api.timeout
    })
    
    return NextResponse.json({
      success: true,
      data: response.data.data,
      message: 'Field updated successfully'
    })
  } catch (error: any) {
    console.error('API Error updating field:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update field',
        data: null
      },
      { status: 500 }
    )
  }
}

/**
 * Delete Field Endpoint
 * 
 * Permanently deletes a field from the collection. This operation cannot be undone.
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing the field ID
 * @returns JSON response confirming deletion or error
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the authorization header from the client request
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authorization header required'
        },
        { status: 401 }
      )
    }

    // Make direct request to backend with forwarded auth header
    await axios.delete(`${config.api.baseURL}/items/fields/${params.id}`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      timeout: config.api.timeout
    })
    
    return NextResponse.json({
      success: true,
      message: 'Field deleted successfully'
    })
  } catch (error: any) {
    console.error('API Error deleting field:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete field'
      },
      { status: 500 }
    )
  }
}
