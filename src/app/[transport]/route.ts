import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";

const handler = createMcpHandler(
  async (server) => {
    // Echo tool
    server.tool(
      "echo",
      "Echo back the input text",
      {
        message: z.string(),
      },
      async ({ message }) => ({
        content: [{ type: "text", text: `Tool echo: ${message}` }],
      })
    );

    // Now tool - get current timestamp
    server.tool(
      "now",
      "Get current timestamp",
      {},
      async () => ({
        content: [{ type: "text", text: new Date().toISOString() }]
      })
    );

    // Read file tool - restrict to safe base dir
    const BASE = path.resolve(process.cwd());
    server.tool(
      "read_file",
      "Read a file from the repository",
      { relPath: z.string().describe("Path relative to repo root") },
      async ({ relPath }) => {
        const full = path.resolve(BASE, relPath);
        if (!full.startsWith(BASE)) {
          return { content: [{ type: "text", text: "Blocked: outside base dir" }] };
        }
        try {
          const data = await fs.readFile(full, "utf8");
          return { content: [{ type: "text", text: data.slice(0, 4000) }] }; // keep responses tidy
        } catch (error) {
          return { content: [{ type: "text", text: `Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}` }] };
        }
      }
    );

    // Get collection stats tool - useful for the admin interface
    server.tool(
      "get_collection_stats",
      "Get statistics about data collections in the Basin admin",
      {},
      async () => {
        try {
          // Read the collections directory to get collection info
          const collectionsPath = path.join(BASE, "src/app/dashboard/data");
          const collections = await fs.readdir(collectionsPath, { withFileTypes: true });
          
          const collectionStats = {
            totalCollections: collections.filter(dir => dir.isDirectory()).length,
            collections: collections
              .filter(dir => dir.isDirectory())
              .map(dir => dir.name)
              .filter(name => name !== "[collection]") // exclude Next.js dynamic route
          };

          return { 
            content: [{ 
              type: "text", 
              text: `📊 Basin Admin Collection Statistics:\n\n` +
                    `Total Collections: ${collectionStats.totalCollections}\n` +
                    `Collection Names: ${collectionStats.collections.join(", ")}\n\n` +
                    `This tool helps you understand the data structure of your Basin admin interface.`
            }] 
          };
        } catch (error) {
          return { 
            content: [{ 
              type: "text", 
              text: `❌ Error reading collection stats: ${error instanceof Error ? error.message : 'Unknown error'}`
            }] 
          };
        }
      }
    );
  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo back the input text",
        },
        now: {
          description: "Get current timestamp",
        },
        read_file: {
          description: "Read a file from the repository",
        },
        get_collection_stats: {
          description: "Get statistics about data collections in the Basin admin",
        },
      },
    },
  },
  {
    redisUrl: process.env.REDIS_REDIS_URL,
    sseEndpoint: "/sse",
    streamableHttpEndpoint: "/mcp",
    verboseLogs: true,
    maxDuration: 60,
  }
);

export { handler as GET, handler as POST, handler as DELETE };