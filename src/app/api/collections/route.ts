import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { config } from '@/lib/config'

/**
 * Collections API Route
 * 
 * Next.js API route for handling collection-related operations.
 * This route acts as a proxy between the frontend and the backend API,
 * forwarding authentication headers and handling responses.
 * 
 * Endpoints:
 * - GET /api/collections - List all collections
 * 
 * Authentication:
 * - Requires Authorization header with Bearer token
 * - Token is forwarded to backend API for validation
 * 
 * @param request - Next.js request object
 * @returns JSON response with collections data or error
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

    // Make direct request to backend with forwarded auth header
    const response = await axios.get(`${config.api.baseURL}/items/collections`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      timeout: config.api.timeout
    })
    
    return NextResponse.json({
      success: true,
      data: response.data.data || [],
      message: 'Collections retrieved successfully'
    })
  } catch (error: any) {
    console.error('API Error fetching collections:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch collections',
        data: []
      },
      { status: 500 }
    )
  }
}
