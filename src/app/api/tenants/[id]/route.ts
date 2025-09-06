import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    console.log('=== PROXY DELETE /tenants/[id] ===');
    console.log('Tenant ID:', id);
    console.log('Auth header:', authHeader);
    console.log('Target URL:', `${config.api.baseURL}/tenants/${id}`);
    
    const response = await fetch(`${config.api.baseURL}/tenants/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log('Proxy response status:', response.status);
    console.log('Proxy response data:', data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy DELETE /tenants/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

