'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TenantService } from '@/lib/services/tenant-service';
import { config } from '@/lib/config';
import { getAuthToken } from '@/lib/auth';

export function TenantDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDebug = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const info = {
        config: {
          apiBaseURL: config.api.baseURL,
          timeout: config.api.timeout,
        },
        auth: {
          hasToken: !!token,
          tokenLength: token?.length || 0,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
        },
        timestamp: new Date().toISOString(),
      };
      
      setDebugInfo(info);
      
      // Try to create a test tenant
      console.log('Testing tenant creation...');
      const testData = {
        name: 'Test Organization',
        slug: 'test-org-' + Date.now(),
        domain: 'test.com'
      };
      
      console.log('Creating tenant with data:', testData);
      const result = await TenantService.createTenant(testData);
      console.log('Tenant creation result:', result);
      
      setDebugInfo(prev => ({
        ...prev,
        testResult: {
          success: true,
          tenant: result,
        }
      }));
      
    } catch (error) {
      console.error('Debug test failed:', error);
      setDebugInfo(prev => ({
        ...prev,
        testResult: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          fullError: error,
        }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Tenant Creation Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDebug} disabled={isLoading}>
          {isLoading ? 'Running Debug...' : 'Run Debug Test'}
        </Button>
        
        {debugInfo && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Configuration:</h3>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                {JSON.stringify(debugInfo.config, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Authentication:</h3>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                {JSON.stringify(debugInfo.auth, null, 2)}
              </pre>
            </div>
            
            {debugInfo.testResult && (
              <div>
                <h3 className="font-semibold mb-2">Test Result:</h3>
                <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                  {JSON.stringify(debugInfo.testResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
