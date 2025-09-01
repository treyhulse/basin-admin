import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Basin API configuration - using the working setup from basin.ts
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://basin-backend-production.up.railway.app";
const BASIN_API_TOKEN = process.env.BASIN_API_TOKEN || "basin_24b15f4e520c747870e4c3aec89cd44cd322dba0074b654cee88009691d4a228";

// Create authenticated API instance for MCP tools
const authenticatedAPI = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${BASIN_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Debug: Log the configuration being used
console.log('MCP: Config loaded:', {
  baseURL: NEXT_PUBLIC_API_URL,
  hasToken: !!BASIN_API_TOKEN
});

const handler = createMcpHandler(
  async (server) => {
    // Test API connection
    server.tool(
      "testAPIConnection",
      "Test the API connection and authentication",
      {},
      async () => {
        try {
          console.log('MCP: Testing API connection...');
          const response = await authenticatedAPI.get('/health');
          console.log('MCP: Test response:', response.status, response.data);
          
          return {
            content: [
              { 
                type: "text", 
                text: `✅ Basin API connection successful!\n\nStatus: ${response.status}\nResponse: ${JSON.stringify(response.data, null, 2)}`
              }
            ]
          };
        } catch (error: any) {
          console.error('MCP: API connection test failed:', error);
          
                                           return {
              content: [
                { 
                  type: "text", 
                  text: `❌ Basin API connection failed!\n\nError: ${error.message || 'Unknown error'}\n\nPlease check:\n- NEXT_PUBLIC_API_URL environment variable (currently: ${NEXT_PUBLIC_API_URL})\n- BASIN_API_TOKEN environment variable\n- Basin server is running and accessible`
                }
              ]
            };
        }
      }
    );

    // List collections
    server.tool(
      "listCollections",
      "List all collections with optional filtering and pagination",
      {
        limit: z.number().optional().describe("Number of collections to return"),
        offset: z.number().optional().describe("Number of collections to skip"),
        page: z.number().optional().describe("Page number for pagination"),
        per_page: z.number().optional().describe("Collections per page"),
        sort: z.string().optional().describe("Field to sort by"),
        order: z.enum(["asc", "desc"]).optional().describe("Sort order"),
        name: z.string().optional().describe("Filter by collection name"),
        icon: z.string().optional().describe("Filter by icon"),
        is_primary: z.boolean().optional().describe("Filter by primary status"),
      },
             async (params) => {
         try {
           // For now, let's make this work exactly like the simple version
           // We can add parameter support back later once we understand what the API accepts
           console.log('MCP: Sending listCollections request (no params for now)');
           
           const response = await authenticatedAPI.get('/items/collections');
           console.log('MCP: API Response status:', response.status);
           console.log('MCP: API Response data:', response.data);
          
          const collections = response.data.data || response.data;
          const meta = response.data.meta;
          
          return {
            content: [
              { 
                type: "text", 
                text: `Successfully retrieved ${collections?.length || 0} collections from Basin API.\n\nCollections:\n${collections?.map((c: any) => `- ${c.display_name || c.name}: ${c.description || 'No description'}`).join('\n') || 'No collections found'}\n\nMeta: ${meta ? `Total: ${meta.count}, Limit: ${meta.limit}, Offset: ${meta.offset}` : 'No meta info'}`
              }
            ]
          };
        } catch (error: any) {
          console.error('MCP: Error listing collections:', error);
          console.error('MCP: Error response:', error.response?.data);
          console.error('MCP: Error status:', error.response?.status);
          
          return {
            content: [
              { 
                type: "text", 
                text: `Error listing collections: ${error.message || 'Unknown error'}. Status: ${error.response?.status}. Response: ${JSON.stringify(error.response?.data)}`
              }
            ]
          };
        }
      }
    );

    // Get collection by ID
    server.tool(
      "getCollection",
      "Get a specific collection by its ID",
      {
        id: z.string().describe("The ID of the collection to retrieve"),
      },
      async ({ id }) => {
        try {
          const response = await authenticatedAPI.get(`/items/collections/${id}`);
          const collection = response.data.data || response.data;
          return {
            content: [
              { 
                type: "text", 
                text: `Successfully retrieved collection: ${collection.display_name || collection.name}\n\nCollection Details:\n${JSON.stringify(collection, null, 2)}`
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              { 
                type: "text", 
                text: `Error retrieving collection: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ]
          };
        }
      }
    );

    // Create collection
    server.tool(
      "createCollection",
      "Create a new collection",
      {
        name: z.string().describe("Name of the collection"),
        description: z.string().describe("Description of the collection"),
        icon: z.string().optional().describe("Icon for the collection"),
        is_primary: z.boolean().optional().describe("Whether this is a primary collection"),
        tenant_id: z.string().optional().describe("Tenant ID for the collection"),
      },
      async ({ name, description, icon, is_primary, tenant_id }) => {
        try {
          console.log('MCP: createCollection called with params:', { name, description, icon, is_primary, tenant_id });
          
          const collectionData = { 
            name, 
            description, 
            icon: icon || "📝", 
            is_primary: is_primary || false, 
            tenant_id: tenant_id || "8da6da20-a5b8-4890-9c88-b004ae1e698d" 
          };
          console.log('MCP: Attempting to create collection with data:', collectionData);
          console.log('MCP: Using API URL:', `${NEXT_PUBLIC_API_URL}/items/collections`);
          
          const response = await authenticatedAPI.post('/items/collections', collectionData);
          console.log('MCP: Create Response status:', response.status);
          console.log('MCP: Create Response data:', response.data);
          
          const collection = response.data.data || response.data;
          return {
            content: [
              { 
                type: "text", 
                text: `Successfully created collection: ${collection.display_name || collection.name}\n\nCollection Details:\n${JSON.stringify(collection, null, 2)}`
              }
            ]
          };
        } catch (error: any) {
          console.error('MCP: Error creating collection:', error);
          console.error('MCP: Error response:', error.response?.data);
          console.error('MCP: Error status:', error.response?.status);
          
          return {
            content: [
              { 
                type: "text", 
                text: `Error creating collection: ${error.message || 'Unknown error'}. Status: ${error.response?.status}. Response: ${JSON.stringify(error.response?.data)}`
              }
            ]
          };
        }
      }
    );

    // Update collection
    server.tool(
      "updateCollection",
      "Update an existing collection",
      {
        id: z.string().describe("The ID of the collection to update"),
        name: z.string().optional().describe("New name for the collection"),
        description: z.string().optional().describe("New description for the collection"),
        icon: z.string().optional().describe("New icon for the collection"),
        is_primary: z.boolean().optional().describe("New primary status"),
        tenant_id: z.string().optional().describe("New tenant ID"),
      },
      async ({ id, ...updateData }) => {
        try {
          const response = await authenticatedAPI.put(`/items/collections/${id}`, updateData);
          const collection = response.data.data || response.data;
          return {
            content: [
              { 
                type: "text", 
                text: `Successfully updated collection: ${collection.display_name || collection.name}\n\nUpdated Collection Details:\n${JSON.stringify(collection, null, 2)}`
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              { 
                type: "text", 
                text: `Error updating collection: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ]
          };
        }
      }
    );

    // Delete collection
    server.tool(
      "deleteCollection",
      "Delete a collection by its ID",
      {
        id: z.string().describe("The ID of the collection to delete"),
      },
      async ({ id }) => {
        try {
          await authenticatedAPI.delete(`/items/collections/${id}`);
          return {
            content: [
              { 
                type: "text", 
                text: `Successfully deleted collection with ID: ${id}`
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              { 
                type: "text", 
                text: `Error deleting collection: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ]
          };
        }
      }
    );

    // Bulk operations
    server.tool(
      "bulkCollectionOperations",
      "Perform bulk operations on collections (create multiple, update multiple, etc.)",
      {
        operations: z.array(z.object({
          action: z.enum(["create", "update", "delete"]).describe("Action to perform"),
          data: z.object({
            name: z.string().optional(),
            description: z.string().optional(),
            icon: z.string().optional(),
            is_primary: z.boolean().optional(),
            tenant_id: z.string().optional(),
          }).describe("Data for the operation"),
          id: z.string().optional().describe("Collection ID for update/delete operations"),
        })).describe("Array of operations to perform"),
      },
      async ({ operations }) => {
        try {
          console.log('MCP: Performing bulk operations:', operations);
          const results = [];
          
          for (const operation of operations) {
            try {
              let response;
              switch (operation.action) {
                case 'create':
                  response = await authenticatedAPI.post('/items/collections', operation.data);
                  results.push({ action: 'create', success: true, data: response.data.data || response.data });
                  break;
                case 'update':
                  if (!operation.id) {
                    results.push({ action: 'update', success: false, error: 'ID required for update' });
                    continue;
                  }
                  response = await authenticatedAPI.put(`/items/collections/${operation.id}`, operation.data);
                  results.push({ action: 'update', success: true, data: response.data.data || response.data });
                  break;
                case 'delete':
                  if (!operation.id) {
                    results.push({ action: 'delete', success: false, error: 'ID required for delete' });
                    continue;
                  }
                  await authenticatedAPI.delete(`/items/collections/${operation.id}`);
                  results.push({ action: 'delete', success: true, id: operation.id });
                  break;
                default:
                  results.push({ action: operation.action, success: false, error: 'Unknown action' });
              }
            } catch (error) {
              results.push({ 
                action: operation.action, 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
              });
            }
          }
          
          const successCount = results.filter(r => r.success).length;
          const totalCount = results.length;
          
          return {
            content: [
              { 
                type: "text", 
                text: `Bulk operations completed. ${successCount}/${totalCount} operations succeeded.\n\nResults:\n${JSON.stringify(results, null, 2)}`
              }
            ]
          };
        } catch (error) {
          console.error('MCP: Error in bulk operations:', error);
          return {
            content: [
              { 
                type: "text", 
                text: `Error in bulk operations: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ]
          };
        }
      }
    );

    // Simple collections test tool (no parameters)
    server.tool(
      "testCollectionsSimple",
      "Test collections endpoint with no parameters (like your working curl command)",
      {},
      async () => {
        try {
          console.log('MCP: Testing simple collections request (no params)');
          const response = await authenticatedAPI.get('/items/collections');
          const collections = response.data.data || response.data;
          const meta = response.data.meta;
          
          return {
            content: [
              {
                type: "text",
                text: `✅ Simple collections request successful!\n\nStatus: ${response.status}\nCollections found: ${collections?.length || 0}\n\nCollections:\n${collections?.map((c: any) => `- ${c.display_name || c.name}: ${c.description || 'No description'}`).join('\n') || 'No collections found'}\n\nMeta: ${meta ? `Total: ${meta.count}, Limit: ${meta.limit}, Offset: ${meta.offset}` : 'No meta info'}`
              }
            ]
          };
        } catch (error) {
          console.error('MCP: Simple collections test failed:', error);
          return {
            content: [
              {
                type: "text",
                text: `❌ Simple collections request failed!\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ]
          };
        }
      }
    );
  },
  {
    capabilities: {
      tools: { 
        testAPIConnection: { 
          description: "Test the API connection and authentication" 
        },
        listCollections: { 
          description: "List all collections with optional filtering and pagination" 
        },
        getCollection: { 
          description: "Get a specific collection by its ID" 
        },
        createCollection: { 
          description: "Create a new collection" 
        },
        updateCollection: { 
          description: "Update an existing collection" 
        },
        deleteCollection: { 
          description: "Delete a collection by its ID" 
        },
        bulkCollectionOperations: { 
          description: "Perform bulk operations on collections" 
        },
        testCollectionsSimple: { 
          description: "Test collections endpoint with no parameters" 
        }
      },
    },
  },
  {
    redisUrl: process.env.REDIS_URL,
    sseEndpoint: "/sse",
    streamableHttpEndpoint: "/mcp",
    verboseLogs: true,
    maxDuration: 60,
  }
);

// Wrap the handler to add CORS headers
const corsHandler = async (req: NextRequest) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Call the original handler
  const response = await handler(req);
  
  // Add CORS headers to the response
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  
  return response;
};

export { corsHandler as GET, corsHandler as POST, corsHandler as DELETE };