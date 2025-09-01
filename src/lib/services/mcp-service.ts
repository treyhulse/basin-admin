import { config } from '../config';

export interface MCPServerStatus {
  isRunning: boolean;
  port: number;
  uptime?: string;
  connections?: number;
  lastCheck: Date;
  error?: string;
  environment?: 'development' | 'production' | 'external';
  serverUrl?: string;
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
  private baseUrl: string;
  private healthCheckInterval: number;
  private isProduction: boolean;

  constructor() {
    this.isProduction = config.mcp.isProduction;
    
    // Use production URL if available, otherwise fall back to development
    if (this.isProduction && config.mcp.productionServerUrl) {
      this.baseUrl = config.mcp.productionServerUrl;
    } else {
      this.baseUrl = config.mcp.serverUrl;
    }
    
    this.healthCheckInterval = config.mcp.healthCheckInterval;
  }

  async getServerStatus(): Promise<MCPServerStatus> {
    try {
      // Try to connect to the MCP server
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        return {
          isRunning: true,
          port: config.mcp.serverPort,
          uptime: data.uptime || 'Unknown',
          connections: data.connections || 0,
          lastCheck: new Date(),
          environment: this.isProduction ? 'production' : 'development',
          serverUrl: this.baseUrl,
        };
      } else {
        return {
          isRunning: false,
          port: config.mcp.serverPort,
          lastCheck: new Date(),
          error: `HTTP ${response.status}: ${response.statusText}`,
          environment: this.isProduction ? 'production' : 'development',
          serverUrl: this.baseUrl,
        };
      }
    } catch (error) {
      return {
        isRunning: false,
        port: config.mcp.serverPort,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : 'Connection failed',
        environment: this.isProduction ? 'production' : 'development',
        serverUrl: this.baseUrl,
      };
    }
  }

  async getAvailableTools(): Promise<MCPTool[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tools`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        return data.tools || [];
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch MCP tools:', error);
      return [];
    }
  }

  async getAvailableModels(): Promise<MCPModel[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
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
      const response = await fetch(`${this.baseUrl}/resources`, {
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

  // Get server information for display
  getServerInfo() {
    return {
      isProduction: this.isProduction,
      serverUrl: this.baseUrl,
      environment: this.isProduction ? 'production' : 'development',
      fallbackEnabled: config.mcp.fallbackEnabled,
    };
  }

  // Simulate MCP server stats for development when server is not running
  getSimulatedStats() {
    return {
      tools: [
        { name: 'echo', description: 'Echo back the input text' },
        { name: 'now', description: 'Get current timestamp' },
        { name: 'read_file', description: 'Read a file from the repository' },
        { name: 'get_collection_stats', description: 'Get statistics about data collections' },
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
