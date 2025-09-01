import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const handler = createMcpHandler(
  async (server) => {
    server.tool(
      "courseRecommender",
      "Recommend courses based on user preferences",
      {
        experienceLevel: z.enum(["beginner", "intermediate"]),
      },
      async ({ experienceLevel }) => ({
        content: [
          { 
            type: "text", 
            text: `Recommended courses for ${experienceLevel} level` 
          }
        ]
      })
    );
  },
  {
    capabilities: {
      tools: { 
        courseRecommender: { 
          description: "Recommend courses based on user preferences" 
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

export { handler as GET, handler as POST, handler as DELETE };