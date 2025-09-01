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
         // API health check
     server.tool(
       "APIHealthCheck",
       "Check the health and connection status of the Basin API",
       {},
       async () => {
         try {
           console.log('MCP: Checking API health...');
           const response = await authenticatedAPI.get('/health');
           console.log('MCP: Health check response:', response.status, response.data);
           
           return {
             content: [
               { 
                 type: "text", 
                 text: `✅ Basin API health check successful!\n\nStatus: ${response.status}\nResponse: ${JSON.stringify(response.data, null, 2)}`
               }
             ]
           };
         } catch (error: any) {
           console.error('MCP: API health check failed:', error);
           
                                            return {
               content: [
                 { 
                   type: "text", 
                   text: `❌ Basin API health check failed!\n\nError: ${error.message || 'Unknown error'}\n\nPlease check:\n- NEXT_PUBLIC_API_URL environment variable (currently: ${NEXT_PUBLIC_API_URL})\n- BASIN_API_TOKEN environment variable\n- Basin server is running and accessible`
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
      {},
      async () => {
        try {
          console.log('MCP: Testing listCollections request (no params)');
          const response = await authenticatedAPI.get('/items/collections');
          const collections = response.data.data || response.data;
          const meta = response.data.meta;
          
          return {
            content: [
              {
                type: "text",
                text: `✅ List collections successful!\n\nStatus: ${response.status}\nCollections found: ${collections?.length || 0}\n\nCollections:\n${collections?.map((c: any) => `- ${c.display_name || c.name}: ${c.description || 'No description'}`).join('\n') || 'No collections found'}\n\nMeta: ${meta ? `Total: ${meta.count}, Limit: ${meta.limit}, Offset: ${meta.offset}` : 'No meta info'}`
              }
            ]
          };
        } catch (error) {
          console.error('MCP: List collections failed:', error);
          return {
            content: [
              {
                type: "text",
                text: `❌ List collections failed!\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ]
          };
        }
      }
         );

     // List fields
     server.tool(
       "listFields",
       "List all fields with optional filtering and pagination",
       {},
       async () => {
         try {
           console.log('MCP: Testing listFields request (no params)');
           const response = await authenticatedAPI.get('/items/fields');
           const fields = response.data.data || response.data;
           const meta = response.data.meta;
           
           return {
             content: [
               {
                 type: "text",
                 text: `✅ List fields successful!\n\nStatus: ${response.status}\nFields found: ${fields?.length || 0}\n\nFields:\n${fields?.map((f: any) => `- ${f.display_name || f.name}: ${f.description || 'No description'} (Type: ${f.type || 'Unknown'})`).join('\n') || 'No fields found'}\n\nMeta: ${meta ? `Total: ${meta.count}, Limit: ${meta.limit}, Offset: ${meta.offset}` : 'No meta info'}`
               }
             ]
           };
         } catch (error) {
           console.error('MCP: List fields failed:', error);
           return {
             content: [
               {
                 type: "text",
                 text: `❌ List fields failed!\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`
               }
             ]
           };
         }
       }
           );

      // List permissions
      server.tool(
        "listPermissions",
        "List all permissions with optional filtering and pagination",
        {},
        async () => {
          try {
            console.log('MCP: Testing listPermissions request (no params)');
            const response = await authenticatedAPI.get('/items/permissions');
            const permissions = response.data.data || response.data;
            const meta = response.data.meta;
            
            return {
              content: [
                {
                  type: "text",
                  text: `✅ List permissions successful!\n\nStatus: ${response.status}\nPermissions found: ${permissions?.length || 0}\n\nPermissions:\n${permissions?.map((p: any) => `- ${p.display_name || p.name}: ${p.description || 'No description'} (Action: ${p.action || 'Unknown'})`).join('\n') || 'No permissions found'}\n\nMeta: ${meta ? `Total: ${meta.count}, Limit: ${meta.limit}, Offset: ${meta.offset}` : 'No meta info'}`
                }
              ]
            };
          } catch (error) {
            console.error('MCP: List permissions failed:', error);
            return {
              content: [
                {
                  type: "text",
                  text: `❌ List permissions failed!\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`
                }
              ]
            };
          }
        }
      );

      // List roles
      server.tool(
        "listRoles",
        "List all roles with optional filtering and pagination",
        {},
        async () => {
          try {
            console.log('MCP: Testing listRoles request (no params)');
            const response = await authenticatedAPI.get('/items/roles');
            const roles = response.data.data || response.data;
            const meta = response.data.meta;
            
            return {
              content: [
                {
                  type: "text",
                  text: `✅ List roles successful!\n\nStatus: ${response.status}\nRoles found: ${roles?.length || 0}\n\nRoles:\n${roles?.map((r: any) => `- ${r.display_name || r.name}: ${r.description || 'No description'} (Level: ${r.level || 'Unknown'})`).join('\n') || 'No roles found'}\n\nMeta: ${meta ? `Total: ${meta.count}, Limit: ${meta.limit}, Offset: ${meta.offset}` : 'No meta info'}`
                }
              ]
            };
          } catch (error) {
            console.error('MCP: List roles failed:', error);
            return {
              content: [
                {
                  type: "text",
                  text: `❌ List roles failed!\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`
                }
              ]
            };
          }
        }
      );

      // List users
      server.tool(
        "listUsers",
        "List all users with optional filtering and pagination",
        {},
        async () => {
          try {
            console.log('MCP: Testing listUsers request (no params)');
            const response = await authenticatedAPI.get('/items/users');
            const users = response.data.data || response.data;
            const meta = response.data.meta;
            
            return {
              content: [
                {
                  type: "text",
                  text: `✅ List users successful!\n\nStatus: ${response.status}\nUsers found: ${users?.length || 0}\n\nUsers:\n${users?.map((u: any) => `- ${u.display_name || u.name || u.email}: ${u.email || 'No email'} (Status: ${u.status || 'Unknown'})`).join('\n') || 'No users found'}\n\nMeta: ${meta ? `Total: ${meta.count}, Limit: ${meta.limit}, Offset: ${meta.offset}` : 'No meta info'}`
                }
              ]
            };
          } catch (error) {
            console.error('MCP: List users failed:', error);
            return {
              content: [
                {
                  type: "text",
                  text: `❌ List users failed!\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`
                }
              ]
            };
          }
        }
      );

      // List tenants
      server.tool(
        "listTenants",
        "List all tenants with optional filtering and pagination",
        {},
        async () => {
          try {
            console.log('MCP: Testing listTenants request (no params)');
            const response = await authenticatedAPI.get('/items/tenants');
            const tenants = response.data.data || response.data;
            const meta = response.data.meta;
            
            return {
              content: [
                {
                  type: "text",
                  text: `✅ List tenants successful!\n\nStatus: ${response.status}\nTenants found: ${tenants?.length || 0}\n\nTenants:\n${tenants?.map((t: any) => `- ${t.display_name || t.name}: ${t.description || 'No description'} (Domain: ${t.domain || 'Unknown'})`).join('\n') || 'No tenants found'}\n\nMeta: ${meta ? `Total: ${meta.count}, Limit: ${meta.limit}, Offset: ${meta.offset}` : 'No meta info'}`
                }
              ]
            };
          } catch (error) {
            console.error('MCP: List tenants failed:', error);
            return {
              content: [
                {
                  type: "text",
                  text: `❌ List tenants failed!\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`
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
        listFields: { 
            description: "List all fields with optional filtering and pagination" 
          },
         listPermissions: { 
           description: "List all permissions with optional filtering and pagination" 
         },
         listRoles: { 
           description: "List all roles with optional filtering and pagination" 
         },
         listUsers: { 
           description: "List all users with optional filtering and pagination" 
         },
         listTenants: { 
           description: "List all tenants with optional filtering and pagination" 
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