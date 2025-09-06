'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Play, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Terminal,
  Database,
  Users,
  Settings,
  Shield,
  Key,
  Building,
  Send,
  Bot,
  User,
  MessageSquare,
  Wrench
} from "lucide-react";

// MCP Tool definitions based on the route.ts file
const MCP_TOOLS = {
  // Health and Status
  APIHealthCheck: {
    name: "API Health Check",
    description: "Check the health and connection status of the Basin API",
    icon: CheckCircle,
    category: "Health",
    parameters: {}
  },
  
  // Collections
  listCollections: {
    name: "List Collections",
    description: "List all collections with optional filtering and pagination",
    icon: Database,
    category: "Collections",
    parameters: {}
  },
  getCollection: {
    name: "Get Collection",
    description: "Get a specific collection by its ID",
    icon: Database,
    category: "Collections",
    parameters: {
      id: { type: "string", required: true, description: "The ID of the collection to retrieve" }
    }
  },
  createCollection: {
    name: "Create Collection",
    description: "Create a new collection",
    icon: Database,
    category: "Collections",
    parameters: {
      name: { type: "string", required: true, description: "Name of the collection" },
      description: { type: "string", required: true, description: "Description of the collection" },
      icon: { type: "string", required: false, description: "Icon for the collection" },
      is_primary: { type: "boolean", required: false, description: "Whether this is a primary collection" },
      tenant_id: { type: "string", required: false, description: "Tenant ID for the collection" }
    }
  },
  updateCollection: {
    name: "Update Collection",
    description: "Update an existing collection",
    icon: Database,
    category: "Collections",
    parameters: {
      id: { type: "string", required: true, description: "The ID of the collection to update" },
      name: { type: "string", required: false, description: "New name for the collection" },
      description: { type: "string", required: false, description: "New description for the collection" },
      icon: { type: "string", required: false, description: "New icon for the collection" },
      is_primary: { type: "boolean", required: false, description: "New primary status" },
      tenant_id: { type: "string", required: false, description: "New tenant ID" }
    }
  },
  deleteCollection: {
    name: "Delete Collection",
    description: "Delete a collection by its ID",
    icon: Database,
    category: "Collections",
    parameters: {
      id: { type: "string", required: true, description: "The ID of the collection to delete" }
    }
  },
  bulkCollectionOperations: {
    name: "Bulk Collection Operations",
    description: "Perform bulk operations on collections (create multiple, update multiple, etc.)",
    icon: Database,
    category: "Collections",
    parameters: {
      operations: { type: "array", required: true, description: "Array of operations to perform" }
    }
  },
  testCollectionsSimple: {
    name: "Test Collections Simple",
    description: "Test collections endpoint with no parameters",
    icon: Database,
    category: "Collections",
    parameters: {}
  },

  // Fields
  listFields: {
    name: "List Fields",
    description: "List all fields with optional filtering and pagination",
    icon: Settings,
    category: "Fields",
    parameters: {}
  },

  // Permissions
  listPermissions: {
    name: "List Permissions",
    description: "List all permissions with optional filtering and pagination",
    icon: Shield,
    category: "Permissions",
    parameters: {}
  },

  // Roles
  listRoles: {
    name: "List Roles",
    description: "List all roles with optional filtering and pagination",
    icon: Key,
    category: "Roles",
    parameters: {}
  },

  // Users
  listUsers: {
    name: "List Users",
    description: "List all users with optional filtering and pagination",
    icon: Users,
    category: "Users",
    parameters: {}
  },

  // Tenants
  listTenants: {
    name: "List Tenants",
    description: "List all tenants with optional filtering and pagination",
    icon: Building,
    category: "Tenants",
    parameters: {}
  }
};

interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

interface LogEntry {
  id: string;
  tool: string;
  request: any;
  response: MCPResponse;
  timestamp: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  toolUsed?: string;
}

export default function MCPClientPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [response, setResponse] = useState<MCPResponse | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkConnection = async () => {
    setIsConnecting(true);
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        setIsConnected(true);
        addLog('APIHealthCheck', {}, { success: true, data: 'Connected', timestamp: new Date().toISOString() });
      } else {
        setIsConnected(false);
        addLog('APIHealthCheck', {}, { success: false, error: 'Connection failed', timestamp: new Date().toISOString() });
      }
    } catch (error) {
      setIsConnected(false);
      addLog('APIHealthCheck', {}, { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error', 
        timestamp: new Date().toISOString() 
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const addLog = (tool: string, request: any, response: MCPResponse) => {
    const logEntry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      tool,
      request,
      response,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [logEntry, ...prev].slice(0, 50)); // Keep last 50 logs
  };

  const addMessage = (role: 'user' | 'assistant', content: string, toolUsed?: string) => {
    const message: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role,
      content,
      timestamp: new Date().toISOString(),
      toolUsed
    };
    setMessages(prev => [...prev, message]);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    addMessage('user', userMessage);
    setIsChatLoading(true);

    try {
      // For now, we'll use a simple response. In a real implementation,
      // you'd call OpenAI API here and potentially use MCP tools
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: {
            availableTools: Object.keys(MCP_TOOLS),
            isConnected
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        addMessage('assistant', data.response, data.toolUsed);
      } else {
        addMessage('assistant', 'Sorry, I encountered an error processing your message.');
      }
    } catch (error) {
      addMessage('assistant', 'Sorry, I encountered an error processing your message.');
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  const executeTool = async () => {
    if (!selectedTool) return;

    setIsExecuting(true);
    setResponse(null);

    try {
      const tool = MCP_TOOLS[selectedTool as keyof typeof MCP_TOOLS];
      const requestBody = {
        jsonrpc: '2.0',
        id: Math.random().toString(36).substr(2, 9),
        method: 'tools/call',
        params: {
          name: selectedTool,
          arguments: parameters
        }
      };

      const response = await fetch('/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/event-stream',
        },
        body: JSON.stringify(requestBody)
      });

      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('text/event-stream')) {
        // Handle SSE response
        const text = await response.text();
        const lines = text.split('\n');
        let data = '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            data = line.substring(6);
            break;
          }
        }
        
        try {
          result = JSON.parse(data);
        } catch (e) {
          result = { error: { message: `Failed to parse SSE data: ${data}` } };
        }
      } else {
        // Handle JSON response
        result = await response.json();
      }
      
      if (result.error) {
        const mcpResponse: MCPResponse = {
          success: false,
          error: result.error.message || 'Unknown error',
          timestamp: new Date().toISOString()
        };
        setResponse(mcpResponse);
        addLog(selectedTool, parameters, mcpResponse);
      } else {
        const mcpResponse: MCPResponse = {
          success: true,
          data: result.result,
          timestamp: new Date().toISOString()
        };
        setResponse(mcpResponse);
        addLog(selectedTool, parameters, mcpResponse);
      }
    } catch (error) {
      const mcpResponse: MCPResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
      setResponse(mcpResponse);
      addLog(selectedTool, parameters, mcpResponse);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleParameterChange = (key: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderParameterInput = (key: string, param: any) => {
    const value = parameters[key] || '';

    if (param.type === 'boolean') {
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{param.description}</Label>
          <select
            id={key}
            value={value}
            onChange={(e) => handleParameterChange(key, e.target.value === 'true')}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select...</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
      );
    }

    if (param.type === 'array') {
      return (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{param.description}</Label>
          <Textarea
            id={key}
            value={value}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleParameterChange(key, parsed);
              } catch {
                handleParameterChange(key, e.target.value);
              }
            }}
            placeholder="Enter JSON array..."
            className="font-mono text-sm"
          />
        </div>
      );
    }

    return (
      <div key={key} className="space-y-2">
        <Label htmlFor={key}>
          {param.description}
          {param.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Input
          id={key}
          value={value}
          onChange={(e) => handleParameterChange(key, e.target.value)}
          placeholder={`Enter ${param.type}...`}
        />
      </div>
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Health': return CheckCircle;
      case 'Collections': return Database;
      case 'Fields': return Settings;
      case 'Permissions': return Shield;
      case 'Roles': return Key;
      case 'Users': return Users;
      case 'Tenants': return Building;
      default: return Terminal;
    }
  };

  const groupedTools = Object.entries(MCP_TOOLS).reduce((acc, [key, tool]) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push({ key, ...tool });
    return acc;
  }, {} as Record<string, Array<{ key: string } & typeof MCP_TOOLS[keyof typeof MCP_TOOLS]>>);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">MCP Client</h1>
          <p className="text-muted-foreground">AI Assistant with Basin Admin Tools</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">
              {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Button 
            onClick={checkConnection} 
            disabled={isConnecting}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isConnecting ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Start a conversation with the AI assistant!</p>
                      <p className="text-sm">I can help you manage collections, users, and more using Basin Admin tools.</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.role === 'user' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                          <div className={`rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            {message.toolUsed && (
                              <div className="text-xs opacity-70 mt-1">
                                Used tool: {message.toolUsed}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {isChatLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleChatKeyPress}
                    placeholder="Ask me anything about your Basin Admin data..."
                    className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                    disabled={isChatLoading}
                  />
                  <Button 
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim() || isChatLoading}
                    size="sm"
                    className="self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Compact Tool Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(groupedTools).map(([category, tools]) => {
                  const CategoryIcon = getCategoryIcon(category);
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <CategoryIcon className="w-3 h-3" />
                        {category}
                      </div>
                      <div className="space-y-1">
                        {tools.map((tool) => (
                          <button
                            key={tool.key}
                            onClick={() => {
                              setSelectedTool(tool.key);
                              setParameters({});
                            }}
                            className={`w-full text-left p-2 rounded text-sm transition-colors ${
                              selectedTool === tool.key
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 border'
                                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 border'
                            }`}
                          >
                            <div className="font-medium truncate">{tool.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{tool.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Compact Parameters */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedTool && MCP_TOOLS[selectedTool as keyof typeof MCP_TOOLS] ? (
                  <>
                    <div className="space-y-3">
                      {Object.entries(MCP_TOOLS[selectedTool as keyof typeof MCP_TOOLS].parameters).map(([key, param]) =>
                        renderParameterInput(key, param)
                      )}
                    </div>
                    
                    <Button 
                      onClick={executeTool}
                      disabled={isExecuting || !isConnected}
                      className="w-full"
                      size="sm"
                    >
                      <Play className="w-3 h-3 mr-2" />
                      {isExecuting ? 'Executing...' : 'Execute'}
                    </Button>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground py-4 text-sm">
                    Select a tool
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Compact Response */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {response ? (
                    response.success ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )
                  ) : (
                    <Terminal className="w-4 h-4" />
                  )}
                  Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                {response ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={response.success ? "default" : "destructive"} className="text-xs">
                        {response.success ? "Success" : "Error"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(response.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-xs overflow-auto max-h-64">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(response.data || response.error, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4 text-sm">
                    Execute a tool to see results
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Execution Logs</CardTitle>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No logs yet. Execute a tool to see logs here.
                </div>
              ) : (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={log.response.success ? "default" : "destructive"}>
                            {log.response.success ? "Success" : "Error"}
                          </Badge>
                          <span className="font-medium">{log.tool}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium mb-1">Request:</div>
                          <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded overflow-auto">
                            {JSON.stringify(log.request, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-1">Response:</div>
                          <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded overflow-auto max-h-32">
                            {JSON.stringify(log.response, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
