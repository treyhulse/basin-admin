import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { config } from '@/lib/config'

/**
 * Health Check API Route
 * 
 * Simple health check that pings the backend URL to verify it's up.
 * 
 * @param request - Next.js request object
 * @returns JSON response with health status
 */
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Ping the backend URL
    const response = await axios.get(config.api.baseURL, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const duration = Date.now() - startTime
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: duration,
      backendUrl: config.api.baseURL,
      backendStatus: response.status
    })
    
  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      backendUrl: config.api.baseURL,
      error: error.message || 'Backend unreachable'
    }, { status: 503 })
  }
}
