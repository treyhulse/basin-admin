import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const origin = process.env.NEXT_PUBLIC_MCP_SERVER_URL || "https://basin-admin.vercel.app";

async function main() {
  const transport = new StreamableHTTPClientTransport(new URL(`${origin}/mcp`));

  const client = new Client(
    {
      name: "example-client",
      version: "1.0.0",
    },
    {
      capabilities: {
        prompts: {},
        resources: {},
        tools: {},
      },
    }
  );

  await client.connect(transport);

  console.log("Connected", client.getServerCapabilities());

  const result = await client.listTools();
  console.log(result);
}

main();
