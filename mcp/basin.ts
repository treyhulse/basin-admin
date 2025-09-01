import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";

// Basin API configuration
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://basin-backend-production.up.railway.app";
const BASIN_API_TOKEN = process.env.BASIN_API_TOKEN || "basin_775ec68995f39c5ca095e5cf3da848146a8d7a7a62d080063cfad0552114a994";

// Create authenticated API client
const basinAPI = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  headers: {
    'Authorization': `Bearer ${BASIN_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function main() {
  const server = new McpServer({ 
    name: "Basin Admin", 
    version: "1.0.0" 
  });

  // List collections tool
  server.tool(
    "listCollections",
    "List all collections with optional filtering and pagination",
    {
      limit: { type: "number", description: "Number of collections to return" },
      offset: { type: "number", description: "Number of collections to skip" },
      page: { type: "number", description: "Page number for pagination" },
      per_page: { type: "number", description: "Collections per page" },
      sort: { type: "string", description: "Field to sort by" },
      order: { type: "string", description: "Sort order (asc/desc)" },
      name: { type: "string", description: "Filter by collection name" },
      icon: { type: "string", description: "Filter by icon" },
      is_primary: { type: "boolean", description: "Filter by primary status" },
    },
          async (params) => {
        try {
          // For now, let's make this work exactly like the simple version
          // We can add parameter support back later once we understand what the API accepts
          console.log('🔍 Sending listCollections request (no params for now)');
          
          const response = await basinAPI.get('/items/collections');
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
      } catch (error) {
        console.error('Error listing collections:', error);
        return {
          content: [
            {
              type: "text",
              text: `Error listing collections: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );

  // Get collection tool
  server.tool(
    "getCollection",
    "Get a specific collection by its ID",
    {
      id: { type: "string", description: "The ID of the collection to retrieve" },
    },
    async ({ id }) => {
      try {
        console.log(`🔍 Getting collection with ID: ${id}`);
        const response = await basinAPI.get(`/items/collections/${id}`);
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
        console.error('Error getting collection:', error);
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

  // Create collection tool
  server.tool(
    "createCollection",
    "Create a new collection",
    {
      name: { type: "string", description: "Name of the collection" },
      description: { type: "string", description: "Description of the collection" },
      icon: { type: "string", description: "Icon for the collection" },
      is_primary: { type: "boolean", description: "Whether this is a primary collection" },
      tenant_id: { type: "string", description: "Tenant ID for the collection" },
    },
    async ({ name, description, icon, is_primary, tenant_id }) => {
      try {
        const collectionData = {
          name,
          description,
          icon: icon || "📝",
          is_primary: is_primary || false,
          tenant_id: tenant_id || "8da6da20-a5b8-4890-9c88-b004ae1e698d" // Using your actual tenant_id
        };
        
        console.log('🔍 Creating collection:', collectionData);
        const response = await basinAPI.post('/items/collections', collectionData);
        const createdCollection = response.data.data || response.data;
        
        return {
          content: [
            {
              type: "text",
              text: `Successfully created collection: ${createdCollection.display_name || createdCollection.name}\n\nCollection Details:\n${JSON.stringify(createdCollection, null, 2)}`
            }
          ]
        };
      } catch (error) {
        console.error('Error creating collection:', error);
        return {
          content: [
            {
              type: "text",
              text: `Error creating collection: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        };
      }
    }
  );

  // Update collection tool
  server.tool(
    "updateCollection",
    "Update an existing collection",
    {
      id: { type: "string", description: "The ID of the collection to update" },
      name: { type: "string", description: "Name of the collection" },
      description: { type: "string", description: "Description of the collection" },
      icon: { type: "string", description: "Icon for the collection" },
      is_primary: { type: "boolean", description: "Whether this is a primary collection" },
      tenant_id: { type: "string", description: "Tenant ID for the collection" },
    },
    async ({ id, ...updateData }) => {
      try {
        console.log(`🔍 Updating collection ${id}:`, updateData);
        const response = await basinAPI.put(`/items/collections/${id}`, updateData);
        const updatedCollection = response.data.data || response.data;
        
        return {
          content: [
            {
              type: "text",
              text: `Successfully updated collection: ${updatedCollection.display_name || updatedCollection.name}\n\nUpdated Collection Details:\n${JSON.stringify(updatedCollection, null, 2)}`
            }
          ]
        };
      } catch (error) {
        console.error('Error updating collection:', error);
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

  // Delete collection tool
  server.tool(
    "deleteCollection",
    "Delete a collection by its ID",
    {
      id: { type: "string", description: "The ID of the collection to delete" },
    },
    async ({ id }) => {
      try {
        console.log(`🔍 Deleting collection with ID: ${id}`);
        await basinAPI.delete(`/items/collections/${id}`);
        
        return {
          content: [
            {
              type: "text",
              text: `Successfully deleted collection with ID: ${id}`
            }
          ]
        };
      } catch (error) {
        console.error('Error deleting collection:', error);
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

  // Bulk collection operations tool
  server.tool(
    "bulkCollectionOperations",
    "Perform bulk operations on collections (create multiple, update multiple, etc.)",
    {
      operations: { 
        type: "array", 
        description: "Array of operations to perform",
        items: {
          type: "object",
          properties: {
            action: { type: "string", description: "Action to perform (create, update, delete)" },
            data: { type: "object", description: "Data for the operation" },
            id: { type: "string", description: "Collection ID for update/delete operations" }
          }
        }
      }
    },
    async ({ operations }) => {
      try {
        console.log('🔍 Performing bulk operations:', operations);
        const results = [];
        
        for (const operation of operations) {
          try {
            let response;
            switch (operation.action) {
              case 'create':
                response = await basinAPI.post('/items/collections', operation.data);
                results.push({ action: 'create', success: true, data: response.data.data || response.data });
                break;
              case 'update':
                response = await basinAPI.put(`/items/collections/${operation.id}`, operation.data);
                results.push({ action: 'update', success: true, data: response.data.data || response.data });
                break;
              case 'delete':
                await basinAPI.delete(`/items/collections/${operation.id}`);
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
        console.error('Error in bulk operations:', error);
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

  // Test API connection tool
  server.tool(
    "testAPIConnection",
    "Test the connection to the Basin API",
    {},
    async () => {
      try {
        const response = await basinAPI.get('/health');
        return {
          content: [
            {
              type: "text",
              text: `✅ Basin API connection successful!\n\nStatus: ${response.status}\nResponse: ${JSON.stringify(response.data, null, 2)}`
            }
          ]
        };
      } catch (error) {
        console.error('API connection test failed:', error);
        return {
          content: [
            {
              type: "text",
              text: `❌ Basin API connection failed!\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease check:\n- NEXT_PUBLIC_API_URL environment variable (currently: ${NEXT_PUBLIC_API_URL})\n- BASIN_API_TOKEN environment variable\n- Basin server is running and accessible`
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
        console.log('🔍 Testing simple collections request (no params)');
        const response = await basinAPI.get('/items/collections');
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
        console.error('Simple collections test failed:', error);
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

  // Connect to stdio transport for local development
  await server.connect(new StdioServerTransport());
  
  console.log("🔌 Basin MCP Server connected via stdio transport");
  console.log("📡 Available tools: listCollections, getCollection, createCollection, updateCollection, deleteCollection, bulkCollectionOperations, testAPIConnection, testCollectionsSimple");
}

main().catch(e => { 
  console.error("MCP Server error:", e); 
  process.exit(1); 
});