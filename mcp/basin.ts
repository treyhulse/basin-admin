import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";

async function main() {
  const server = new McpServer({ name: "Basin", version: "1.0.0" });

  // echo tool
  server.tool(
    "echo",
    "Echo back the input text",
    { text: { type: "string", description: "Text to echo" } },
    async ({ text }) => {
      return { content: [{ type: "text", text }] };
    }
  );

  // now tool
  server.tool("now", "Get current timestamp", {}, async () => ({
    content: [{ type: "text", text: new Date().toISOString() }]
  }));

  // read_file tool (restrict to a safe base dir)
  const BASE = path.resolve(process.cwd());
  server.tool(
    "read_file",
    "Read a file from the repository",
    { relPath: { type: "string", description: "Path relative to repo root" } },
    async ({ relPath }) => {
      const full = path.resolve(BASE, relPath);
      if (!full.startsWith(BASE)) {
        return { content: [{ type: "text", text: "Blocked: outside base dir" }] };
      }
      const data = await fs.readFile(full, "utf8");
      return { content: [{ type: "text", text: data.slice(0, 4000) }] }; // keep responses tidy
    }
  );

  // get_collection_stats tool - useful for the admin interface
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

  // expose a tiny resource
  server.resource(
    "welcome",
    "text://welcome",
    async () => ({
      contents: [{ uri: "text://welcome", text: "🏞️ Welcome to Basin Admin MCP Server!" }]
    })
  );

  await server.connect(new StdioServerTransport());
}

main().catch(e => { console.error(e); process.exit(1); });
