import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";

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

  // Start HTTP server for dashboard integration
  const httpServer = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    try {
      if (req.url === '/health') {
        const startTime = Date.now();
        const uptime = process.uptime();
        const uptimeFormatted = `${Math.floor(uptime / 86400)}d ${Math.floor((uptime % 86400) / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`;
        
        res.writeHead(200);
        res.end(JSON.stringify({
          status: 'healthy',
          uptime: uptimeFormatted,
          connections: 1, // Simulated connection count
          timestamp: new Date().toISOString(),
          server: 'Basin MCP Server',
          version: '1.0.0'
        }));
      } else if (req.url === '/tools') {
        const tools = [
          { name: 'echo', description: 'Echo back the input text', parameters: { text: 'string' } },
          { name: 'now', description: 'Get current timestamp', parameters: {} },
          { name: 'read_file', description: 'Read a file from the repository', parameters: { relPath: 'string' } },
          { name: 'get_collection_stats', description: 'Get statistics about data collections', parameters: {} }
        ];
        
        res.writeHead(200);
        res.end(JSON.stringify({ tools }));
      } else if (req.url === '/models') {
        const models = [
          { name: 'GPT-4', description: 'OpenAI GPT-4 model', capabilities: ['text-generation', 'reasoning'] },
          { name: 'Claude', description: 'Anthropic Claude model', capabilities: ['text-generation', 'analysis'] },
          { name: 'Gemini', description: 'Google Gemini model', capabilities: ['text-generation', 'multimodal'] }
        ];
        
        res.writeHead(200);
        res.end(JSON.stringify({ models }));
      } else if (req.url === '/resources') {
        const resources = [
          { name: 'welcome', uri: 'text://welcome', description: 'Welcome message resource' }
        ];
        
        res.writeHead(200);
        res.end(JSON.stringify({ resources }));
      } else if (req.url === '/status') {
        const startTime = Date.now();
        const uptime = process.uptime();
        const uptimeFormatted = `${Math.floor(uptime / 86400)}d ${Math.floor((uptime % 86400) / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`;
        
        res.writeHead(200);
        res.end(JSON.stringify({
          isRunning: true,
          port: 3001,
          uptime: uptimeFormatted,
          connections: 1,
          lastCheck: new Date().toISOString(),
          server: 'Basin MCP Server',
          version: '1.0.0'
        }));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
      }
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  });

  const PORT = process.env.MCP_HTTP_PORT ? parseInt(process.env.MCP_HTTP_PORT) : 3001;
  
  httpServer.listen(PORT, () => {
    console.log(`🚀 Basin MCP Server HTTP endpoint running on port ${PORT}`);
    console.log(`📊 Dashboard endpoints available:`);
    console.log(`   - Health check: http://localhost:${PORT}/health`);
    console.log(`   - Tools: http://localhost:${PORT}/tools`);
    console.log(`   - Models: http://localhost:${PORT}/models`);
    console.log(`   - Resources: http://localhost:${PORT}/resources`);
    console.log(`   - Status: http://localhost:${PORT}/status`);
  });

  // Connect to MCP transport
  await server.connect(new StdioServerTransport());
}

main().catch(e => { console.error(e); process.exit(1); });
