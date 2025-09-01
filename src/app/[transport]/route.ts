import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

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