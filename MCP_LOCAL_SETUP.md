# Local MCP Server Setup

This guide explains how to set up and use the local Basin MCP server.

## Prerequisites

1. Node.js installed
2. Basin API server running (default: http://localhost:8080)
3. Basin API authentication token

## Configuration

Set the following environment variables:

```bash
# Basin API Configuration
export BASIN_API_URL=http://localhost:8080
export BASIN_API_TOKEN=your-actual-basin-api-token

# Or create a .env file in the project root:
BASIN_API_URL=http://localhost:8080
BASIN_API_TOKEN=your-actual-basin-api-token
```

## Running the MCP Server

```bash
npm run mcp:dev
```

This will start the MCP server using stdio transport, which is the correct approach for local development.

## Available Tools

The MCP server provides the following tools:

- **listCollections** - List all collections with filtering and pagination
- **getCollection** - Get a specific collection by ID
- **createCollection** - Create a new collection
- **updateCollection** - Update an existing collection
- **deleteCollection** - Delete a collection by ID
- **bulkCollectionOperations** - Perform multiple operations at once
- **testAPIConnection** - Test the connection to the Basin API

## Cursor Configuration

The `.cursor/mcp.json` file is already configured to use the local MCP server:

```json
{
  "mcpServers": {
    "basin-mcp-local": {
      "command": "npm",
      "args": ["run", "mcp:dev"]
    }
  }
}
```

## Testing

1. Start the MCP server: `npm run mcp:dev`
2. In Cursor, go to Settings/MCP
3. You should see the "basin-mcp-local" server with a green active status
4. The tools should now be available in your AI assistant

## Troubleshooting

- **No tools available**: Make sure the MCP server is running and the environment variables are set correctly
- **API connection failed**: Verify that your Basin API server is running and accessible
- **Authentication errors**: Check that your `BASIN_API_TOKEN` is valid and has the necessary permissions
