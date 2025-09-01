import { config } from '../config';

export interface MCPServerStatus {
  isRunning: boolean;
  port: number;
  uptime?: string;
  connections?: number;
  lastCheck: Date;
  error?: string;
}

export interface MCPTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface MCPModel {
  name: string;
  description: string;
  capabilities: string[];
}

export interface MCPResource {
  name: string;
  uri: string;
  description: string;
}

export class MCPService {
  public baseUrl: string;
  private healthCheckInterval: number;
  private serverType: 'mcp-handler' | 'local-http' = 'local-http';

  constructor() {
    this.baseUrl = config.mcp.serverUrl;
    this.healthCheckInterval = config.mcp.healthCheckInterval;
  }

  // Method to set the server URL dynamically
  setServerUrl(url: string) {
    this.baseUrl = url;
    // Detect server type based on URL
    if (url.includes('vercel.app') || url.includes('basin-admin.vercel.app')) {
      this.serverType = 'mcp-handler';
    } else {
      this.serverType = 'local-http';
    }
  }

  // Method to get the current server URL
  getServerUrl() {
    return this.baseUrl;
  }

  // Method to get the current server type
  getServerType() {
    return this.serverType;
  }

  // Get the appropriate endpoint for the current server type
  private getEndpoint(path: string): string {
    if (this.serverType === 'mcp-handler') {
      // mcp-handler uses /mcp for all endpoints
      return `${this.baseUrl}/mcp`;
    } else {
      // local-http uses specific endpoints
      return `${this.baseUrl}${path}`;
    }
  }

  async getServerStatus(): Promise<MCPServerStatus> {
    try {
      // Try to connect to the MCP server
      if (this.serverType === 'mcp-handler') {
        // mcp-handler expects POST requests with MCP protocol data
        console.log('Attempting to connect to production MCP server:', `${this.baseUrl}/mcp`);
        
        const response = await fetch(`${this.baseUrl}/mcp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/event-stream',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'initialize',
            params: {
              protocolVersion: '2024-11-05',
              capabilities: {},
              clientInfo: {
                name: 'basin-admin-dashboard',
                version: '1.0.0'
              }
            }
          }),
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          return {
            isRunning: true,
            port: 443, // HTTPS port
            uptime: 'Unknown',
            connections: 1,
            lastCheck: new Date(),
          };
        } else {
          return {
            isRunning: false,
            port: 443,
            lastCheck: new Date(),
            error: `HTTP ${response.status}: ${response.statusText}`,
          };
        }
      } else {
        // Local HTTP server expects GET requests
        const response = await fetch(`${this.baseUrl}/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/event-stream',
          },
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            isRunning: true,
            port: config.mcp.serverPort,
            uptime: data.uptime || 'Unknown',
            connections: data.connections || 0,
            lastCheck: new Date(),
          };
        } else {
          return {
            isRunning: false,
            port: config.mcp.serverPort,
            lastCheck: new Date(),
            error: `HTTP ${response.status}: ${response.statusText}`,
          };
        }
      }
    } catch (error) {
      console.error('MCP Server Status Error:', error);
      return {
        isRunning: false,
        port: this.serverType === 'mcp-handler' ? 443 : config.mcp.serverPort,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }

  async getAvailableTools(): Promise<MCPTool[]> {
    try {
      if (this.serverType === 'mcp-handler') {
        // mcp-handler expects POST requests with MCP protocol data
        const response = await fetch(`${this.baseUrl}/mcp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/event-stream',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/list',
            params: {}
          }),
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          const data = await response.json();
          // Convert MCP tools format to our format
          if (data.result && data.result.tools) {
            return data.result.tools.map((tool: any) => ({
              name: tool.name,
              description: tool.description,
              parameters: tool.inputSchema?.properties || {}
            }));
          }
          return [];
        }
        return [];
      } else {
        // Local HTTP server expects GET requests
        const response = await fetch(`${this.baseUrl}/tools`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/event-stream',
          },
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          const data = await response.json();
          return data.tools || [];
        }
        return [];
      }
    } catch (error) {
      console.error('Failed to fetch MCP tools:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        serverType: this.serverType,
        baseUrl: this.baseUrl
      });
      return [];
    }
  }

  async getAvailableModels(): Promise<MCPModel[]> {
    try {
      const endpoint = this.serverType === 'mcp-handler' ? '/mcp' : '/models';
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        return data.models || [];
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch MCP models:', error);
      return [];
    }
  }

  async getAvailableResources(): Promise<MCPResource[]> {
    try {
      const endpoint = this.serverType === 'mcp-handler' ? '/mcp' : '/resources';
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        return data.resources || [];
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch MCP resources:', error);
      return [];
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const status = await this.getServerStatus();
      return status.isRunning;
    } catch {
      return false;
    }
  }

  // Simulate MCP server stats for development when server is not running
  getSimulatedStats() {
    return {
      tools: [
        { name: 'echo', description: 'Echo back the input text', parameters: {} },
        { name: 'now', description: 'Get current timestamp', parameters: {} },
        { name: 'read_file', description: 'Read a file from the repository', parameters: {} },
        { name: 'get_collection_stats', description: 'Get statistics about data collections', parameters: {} },
      ],
      models: [
        { name: 'GPT-4', description: 'OpenAI GPT-4 model', capabilities: ['text-generation', 'reasoning'] },
        { name: 'Claude', description: 'Anthropic Claude model', capabilities: ['text-generation', 'analysis'] },
        { name: 'Gemini', description: 'Google Gemini model', capabilities: ['text-generation', 'multimodal'] },
      ],
      resources: [
        { name: 'welcome', uri: 'text://welcome', description: 'Welcome message resource' },
      ],
    };
  }
}

export const mcpService = new MCPService();
