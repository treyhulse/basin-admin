'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cpu, Brain, Bot, RefreshCw, AlertCircle, CheckCircle, XCircle, Globe, Monitor } from "lucide-react";
import { mcpService, MCPServerStatus, MCPTool, MCPModel, MCPResource } from "@/lib/services/mcp-service";
import { config } from "@/lib/config";

// MCP Server configurations
const MCP_SERVERS = {
  production: {
    name: 'Production',
    url: config.mcp.productionUrl,
    icon: Globe,
    description: 'Live production MCP server (mcp-handler)',
    type: 'mcp-handler' as const,
    endpoints: {
      status: '/mcp',
      tools: '/mcp',
      models: '/mcp',
      resources: '/mcp'
    }
  },
  development: {
    name: 'Development',
    url: config.mcp.developmentUrl,
    icon: Monitor,
    description: 'Local development MCP server (custom HTTP)',
    type: 'local-http' as const,
    endpoints: {
      status: '/health',
      tools: '/tools',
      models: '/models',
      resources: '/resources'
    }
  }
};

export default function MCPDashboardClient() {
  const [selectedServer, setSelectedServer] = useState<'production' | 'development'>('production');
  const [serverStatus, setServerStatus] = useState<MCPServerStatus | null>(null);
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [models, setModels] = useState<MCPModel[]>([]);
  const [resources, setResources] = useState<MCPResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const getCurrentServerConfig = () => MCP_SERVERS[selectedServer];

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const currentServer = getCurrentServerConfig();
      
      // Set the MCP service to use the selected server URL
      mcpService.setServerUrl(currentServer.url);
      
      const [status, toolsData, modelsData, resourcesData] = await Promise.all([
        mcpService.getServerStatus(),
        mcpService.getAvailableTools(),
        mcpService.getAvailableModels(),
        mcpService.getAvailableResources(),
      ]);

      setServerStatus(status);
      setTools(toolsData);
      setModels(modelsData);
      setResources(resourcesData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to refresh MCP data:', error);
      
      const currentServer = getCurrentServerConfig();
      let errorMessage = 'Server not available, showing simulated data';
      
      // Provide more specific error messages based on server type
      if (currentServer.type === 'mcp-handler') {
        errorMessage = 'Production MCP server (mcp-handler) is not responding to HTTP endpoints. This server uses MCP protocol at /mcp endpoint.';
      } else if (currentServer.type === 'local-http') {
        errorMessage = 'Local development server is not available. Make sure the MCP server is running on port 3001.';
      }
      
      // Fallback to simulated data if server is not available
      const simulatedStats = mcpService.getSimulatedStats();
      setTools(simulatedStats.tools);
      setModels(simulatedStats.models);
      setResources(simulatedStats.resources);
      
      // Set server status as not running
      setServerStatus({
        isRunning: false,
        port: selectedServer === 'development' ? 3001 : 443,
        lastCheck: new Date(),
        error: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    // Set up periodic refresh
    const interval = setInterval(refreshData, config.mcp.healthCheckInterval);
    
    return () => clearInterval(interval);
  }, [selectedServer]);

  const handleServerChange = (server: 'production' | 'development') => {
    setSelectedServer(server);
  };

  const getStatusIcon = (isRunning: boolean) => {
    if (isRunning) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    return <XCircle className="h-4 w-4 text-red-600" />;
  };



  const formatUptime = (uptime?: string) => {
    if (!uptime || uptime === 'Unknown') return 'Unknown';
    return uptime;
  };

  const formatLastCheck = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const currentServer = getCurrentServerConfig();
  const ServerIcon = currentServer.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MCP Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your Model Context Protocol servers, AI models, and tools.
          </p>
        </div>
        <Button 
          onClick={refreshData} 
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Server Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ServerIcon className="h-5 w-5" />
            MCP Server Selection
            {serverStatus && (
              <Badge variant={serverStatus.isRunning ? "default" : "destructive"} className="ml-2">
                {serverStatus.isRunning ? 'Connected' : 'Disconnected'}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {Object.entries(MCP_SERVERS).map(([key, server]) => {
              const Icon = server.icon;
              const isSelected = selectedServer === key;
              return (
                <Button
                  key={key}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => handleServerChange(key as 'production' | 'development')}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {server.name}
                </Button>
              );
            })}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {currentServer.description} • {currentServer.url}
          </p>
          {currentServer.type === 'mcp-handler' && (
            <p className="mt-1 text-xs text-amber-600 bg-amber-50 p-2 rounded">
              ⚠️ Production server uses mcp-handler with MCP protocol at /mcp endpoint
            </p>
          )}
        </CardContent>
      </Card>

      {serverStatus && (
        <div className="rounded-lg border bg-yellow-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              Last updated: {formatLastCheck(lastRefresh)}
            </span>
          </div>
          {serverStatus.error && (
            <p className="mt-1 text-sm text-yellow-700">{serverStatus.error}</p>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MCP Server</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              {serverStatus && getStatusIcon(serverStatus.isRunning)}
              <div className="text-2xl font-bold">
                {serverStatus?.isRunning ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Server: {currentServer.name}
              </p>
              <p className="text-xs text-muted-foreground">
                URL: {currentServer.url}
              </p>
              <Badge variant="outline" className="text-xs">
                {selectedServer === 'production' ? '🌐 Production' : '💻 Development'}
              </Badge>
              {serverStatus?.uptime && (
                <p className="text-xs text-muted-foreground">
                  Uptime: {formatUptime(serverStatus.uptime)}
                </p>
              )}
              {serverStatus?.connections !== undefined && (
                <p className="text-xs text-muted-foreground">
                  Connections: {serverStatus.connections}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Models</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{models.length}</div>
            <p className="text-xs text-muted-foreground">
              {models.length > 0 
                ? models.slice(0, 2).map(m => m.name).join(', ') + (models.length > 2 ? '...' : '')
                : 'No models available'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tools</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tools.length}</div>
            <p className="text-xs text-muted-foreground">
              {tools.length > 0 
                ? tools.slice(0, 2).map(t => t.name).join(', ') + (tools.length > 2 ? '...' : '')
                : 'No tools available'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Available Tools ({tools.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tools.length > 0 ? (
              <div className="space-y-3">
                {tools.map((tool, index) => (
                  <div key={index} className="flex items-start justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">{tool.name}</p>
                      <p className="text-xs text-muted-foreground">{tool.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Object.keys(tool.parameters).length} params
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tools available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Available Models ({models.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {models.length > 0 ? (
              <div className="space-y-3">
                {models.map((model, index) => (
                  <div key={index} className="p-3 rounded-lg border">
                    <p className="font-medium text-sm">{model.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">{model.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.map((capability, capIndex) => (
                        <Badge key={capIndex} variant="secondary" className="text-xs">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No models available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Available Resources ({resources.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {resources.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {resources.map((resource, index) => (
                <div key={index} className="p-3 rounded-lg border">
                  <p className="font-medium text-sm">{resource.name}</p>
                  <p className="text-xs text-muted-foreground mb-1">{resource.description}</p>
                  <p className="text-xs font-mono bg-muted p-1 rounded">{resource.uri}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No resources available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
