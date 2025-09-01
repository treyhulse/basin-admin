# MCP Server Setup Guide

This guide explains how to set up and use the Model Context Protocol (MCP) server with the Basin Admin dashboard.

## Quick Start

### 1. Start the MCP Server

The MCP server now includes both MCP protocol support and HTTP endpoints for dashboard integration.

```bash
# Development mode with HTTP endpoints
npm run mcp:http

# Or use the original MCP-only mode
npm run mcp:dev
```

### 2. Environment Configuration

Create a `.env.local` file in your project root with the following MCP settings:

```bash
# MCP Server Configuration
NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:3001
NEXT_PUBLIC_MCP_SERVER_PORT=3001
NEXT_PUBLIC_MCP_ENABLED=true
NEXT_PUBLIC_MCP_HEALTH_CHECK_INTERVAL=5000

# MCP Server Environment Variables
MCP_HTTP_PORT=3001
```

### 3. Access the Dashboard

Once the MCP server is running, you can access the dashboard at:
- **Dashboard**: `/dashboard/mcp`
- **Server Status**: `/dashboard/mcp/server`

## MCP Server Features

### HTTP Endpoints

The MCP server now provides these HTTP endpoints for dashboard integration:

- `GET /health` - Server health status
- `GET /tools` - Available MCP tools
- `GET /models` - Available AI models
- `GET /resources` - Available MCP resources
- `GET /status` - Comprehensive server status

### MCP Tools

The server includes these built-in tools:

1. **echo** - Echo back input text
2. **now** - Get current timestamp
3. **read_file** - Read files from repository (safe directory restricted)
4. **get_collection_stats** - Get Basin admin collection statistics

### MCP Resources

- **welcome** - Welcome message resource

## Dashboard Features

The updated MCP dashboard provides:

- **Real-time Status**: Live connection status to MCP server
- **Dynamic Data**: Real-time tool, model, and resource information
- **Health Monitoring**: Server uptime and connection status
- **Fallback Mode**: Shows simulated data when server is unavailable
- **Auto-refresh**: Configurable health check intervals

## Troubleshooting

### Server Won't Start

1. Check if port 3001 is available
2. Verify Node.js version compatibility
3. Check console for error messages

### Dashboard Shows "Inactive" Status

1. Ensure MCP server is running (`npm run mcp:http`)
2. Check environment variables in `.env.local`
3. Verify server is accessible at `http://localhost:3001`

### Tools/Models Not Loading

1. Check browser console for CORS errors
2. Verify MCP server HTTP endpoints are responding
3. Check network tab for failed requests

## Development

### Adding New Tools

To add new MCP tools, edit `mcp/basin.ts`:

```typescript
server.tool(
  "new_tool",
  "Description of the new tool",
  { param: { type: "string", description: "Parameter description" } },
  async ({ param }) => {
    // Tool implementation
    return { content: [{ type: "text", text: "Result" }] };
  }
);
```

### Adding HTTP Endpoints

To add new HTTP endpoints, edit the HTTP server section in `mcp/basin.ts`:

```typescript
} else if (req.url === '/new-endpoint') {
  res.writeHead(200);
  res.end(JSON.stringify({ message: 'New endpoint' }));
}
```

## Architecture

The MCP integration follows this architecture:

```
MCP Server (basin.ts) ←→ HTTP Endpoints ←→ MCP Service ←→ Dashboard Client ←→ Dashboard Page
```

- **MCP Server**: Handles MCP protocol and HTTP endpoints
- **MCP Service**: Manages communication between dashboard and server
- **Dashboard Client**: React component with real-time updates
- **Dashboard Page**: Server component that renders the client

This design ensures separation of concerns while providing real-time MCP server status and capabilities to the dashboard.
