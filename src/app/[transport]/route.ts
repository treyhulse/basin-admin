import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { collectionsAPI } from "@/lib/api";

const handler = createMcpHandler(
  async (server) => {
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
          const collections = await collectionsAPI.list(params);
          return {
            content: [
              { 
                type: "text", 
                text: `Successfully retrieved ${collections.data?.length || 0} collections.`,
                data: collections
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              { 
                type: "text", 
                text: `Error listing collections: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: true
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
          const collection = await collectionsAPI.get(id);
          return {
            content: [
              { 
                type: "text", 
                text: `Successfully retrieved collection: ${collection.data?.name || 'Unknown'}`,
                data: collection
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              { 
                type: "text", 
                text: `Error retrieving collection: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: true
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
          const collection = await collectionsAPI.create({ name, description, icon, is_primary, tenant_id });
          return {
            content: [
              { 
                type: "text", 
                text: `Successfully created collection: ${collection.data?.name || 'Unknown'}`,
                data: collection
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              { 
                type: "text", 
                text: `Error creating collection: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: true
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
          const collection = await collectionsAPI.update(id, updateData);
          return {
            content: [
              { 
                type: "text", 
                text: `Successfully updated collection: ${collection.data?.name || 'Unknown'}`,
                data: collection
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              { 
                type: "text", 
                text: `Error updating collection: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: true
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
          await collectionsAPI.delete(id);
          return {
            content: [
              { 
                type: "text", 
                text: `Successfully deleted collection with ID: ${id}`,
                data: { deletedId: id }
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              { 
                type: "text", 
                text: `Error deleting collection: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: true
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
        operation: z.enum(["create", "update", "delete"]).describe("Type of bulk operation"),
        collections: z.array(z.object({
          name: z.string(),
          description: z.string(),
          icon: z.string().optional(),
          is_primary: z.boolean().optional(),
          tenant_id: z.string().optional(),
        })).describe("Array of collections for the operation"),
        ids: z.array(z.string()).optional().describe("Array of IDs for update/delete operations"),
      },
      async ({ operation, collections, ids }) => {
        try {
          let results = [];
          
          if (operation === "create") {
            for (const collection of collections) {
              const result = await collectionsAPI.create(collection);
              results.push(result);
            }
          } else if (operation === "update" && ids) {
            for (let i = 0; i < ids.length; i++) {
              const result = await collectionsAPI.update(ids[i], collections[i] || {});
              results.push(result);
            }
          } else if (operation === "delete" && ids) {
            for (const id of ids) {
              await collectionsAPI.delete(id);
              results.push({ deletedId: id });
            }
          }
          
          return {
            content: [
              { 
                type: "text", 
                text: `Successfully completed bulk ${operation} operation on ${results.length} collections`,
                data: { results, operation, count: results.length }
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              { 
                type: "text", 
                text: `Error in bulk ${operation} operation: ${error instanceof Error ? error.message : 'Unknown error'}`,
                error: true
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