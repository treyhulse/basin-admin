'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { logger, LogEntry, LogLevel } from '@/lib/logger';
import { api } from '@/lib/api';

interface ConnectionStatus {
  isConnected: boolean;
  lastCheck: Date | null;
  error: string | null;
  responseTime: number | null;
}

export function DebugLogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    lastCheck: null,
    error: null,
    responseTime: null,
  });
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);

  useEffect(() => {
    // Load logs from localStorage
    const loadLogs = () => {
      const storedLogs = logger.getStoredLogs();
      setLogs(storedLogs);
    };

    loadLogs();
    
    // Refresh logs every 2 seconds
    const interval = setInterval(loadLogs, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    setIsCheckingConnection(true);
    const startTime = Date.now();
    
    try {
      // Try to make a simple request to check connection
      await api.get('/health');
      const responseTime = Date.now() - startTime;
      
      setConnectionStatus({
        isConnected: true,
        lastCheck: new Date(),
        error: null,
        responseTime,
      });
    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setConnectionStatus({
        isConnected: false,
        lastCheck: new Date(),
        error: errorMessage,
        responseTime,
      });
    } finally {
      setIsCheckingConnection(false);
    }
  };

  const clearLogs = () => {
    logger.clearStoredLogs();
    setLogs([]);
  };

  const getLogLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warn': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'debug': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const filterLogs = (level: LogLevel | 'all') => {
    if (level === 'all') return logs;
    return logs.filter(log => log.level === level);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Debug Information
            <div className="flex gap-2">
              <Button 
                onClick={checkConnection} 
                disabled={isCheckingConnection}
                variant="outline"
                size="sm"
              >
                {isCheckingConnection ? 'Checking...' : 'Check Connection'}
              </Button>
              <Button onClick={clearLogs} variant="outline" size="sm">
                Clear Logs
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Connection Status</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span>Status:</span>
                  <Badge variant={connectionStatus.isConnected ? "default" : "destructive"}>
                    {connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
                {connectionStatus.lastCheck && (
                  <div className="text-sm text-muted-foreground">
                    Last check: {connectionStatus.lastCheck.toLocaleTimeString()}
                  </div>
                )}
                {connectionStatus.responseTime !== null && (
                  <div className="text-sm text-muted-foreground">
                    Response time: {connectionStatus.responseTime}ms
                  </div>
                )}
                {connectionStatus.error && (
                  <div className="text-sm text-red-600">
                    Error: {connectionStatus.error}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">API Configuration</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Base URL:</span> {api.defaults.baseURL}
                </div>
                <div>
                  <span className="font-medium">Timeout:</span> {api.defaults.timeout}ms
                </div>
                <div>
                  <span className="font-medium">Environment:</span> {process.env.NODE_ENV}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({logs.length})</TabsTrigger>
              <TabsTrigger value="error">{logs.filter(l => l.level === 'error').length}</TabsTrigger>
              <TabsTrigger value="warn">{logs.filter(l => l.level === 'warn').length}</TabsTrigger>
              <TabsTrigger value="info">{logs.filter(l => l.level === 'info').length}</TabsTrigger>
              <TabsTrigger value="debug">{logs.filter(l => l.level === 'debug').length}</TabsTrigger>
            </TabsList>
            
            {(['all', 'error', 'warn', 'info', 'debug'] as const).map(level => (
              <TabsContent key={level} value={level} className="mt-4">
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filterLogs(level).length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No {level === 'all' ? '' : level} logs found
                    </div>
                  ) : (
                    filterLogs(level).map((log, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={getLogLevelColor(log.level)}>
                              {log.level.toUpperCase()}
                            </Badge>
                            <span className="text-sm font-mono">
                              {formatTimestamp(log.timestamp)}
                            </span>
                          </div>
                          {log.context?.requestId && (
                            <span className="text-xs text-muted-foreground font-mono">
                              {log.context.requestId}
                            </span>
                          )}
                        </div>
                        
                        <div className="font-medium">{log.message}</div>
                        
                        {log.context && Object.keys(log.context).length > 0 && (
                          <div className="text-sm">
                            <span className="font-medium">Context:</span>
                            <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.context, null, 2)}
                            </pre>
                          </div>
                        )}
                        
                        {log.error && (
                          <div className="text-sm">
                            <span className="font-medium text-red-600">Error:</span>
                            <div className="mt-1 text-xs bg-red-50 p-2 rounded font-mono">
                              {log.error.message}
                            </div>
                          </div>
                        )}
                        
                        {log.data && (
                          <div className="text-sm">
                            <span className="font-medium">Data:</span>
                            <pre className="mt-1 text-xs bg-muted p-2 rounded overflow-x-auto">
                              {JSON.stringify(log.data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
