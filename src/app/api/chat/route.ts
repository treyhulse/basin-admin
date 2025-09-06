import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        response: "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.",
        toolUsed: null
      });
    }

    // Use the production MCP server URL from environment variables
    const mcpServerUrl = process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'https://www.workbasin.com/mcp';

    try {
      // Use the remote MCP server approach
      const resp = await openai.responses.create({
        model: "gpt-4.1-nano",
        tools: [
          {
            type: "mcp",
            server_label: "basin-admin",
            server_description: "Basin Admin MCP server for data management operations",
            server_url: mcpServerUrl,
            require_approval: "never",
          },
        ],
        input: message,
      });

      return NextResponse.json({
        response: resp.output_text,
        toolUsed: "mcp-server"
      });

    } catch (mcpError: any) {
      console.error('MCP server error:', mcpError);
      
      // Check if it's a quota error
      if (mcpError.status === 429 || mcpError.code === 'insufficient_quota') {
        return NextResponse.json({
          response: "⚠️ OpenAI quota exceeded. Please check your billing details or try again later.\n\nIn the meantime, you can use the Tools tab to directly interact with your Basin Admin MCP server.",
          toolUsed: "quota-exceeded"
        });
      }
      
      // Fallback to regular chat completion if MCP fails
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are an AI assistant for Basin Admin, a data management platform. 
              
Available MCP tools:
- APIHealthCheck: Check API health
- listCollections: List all collections
- getCollection: Get specific collection by ID
- createCollection: Create new collection
- updateCollection: Update existing collection
- deleteCollection: Delete collection
- listFields: List all fields
- listPermissions: List all permissions
- listRoles: List all roles
- listUsers: List all users
- listTenants: List all tenants

Current context:
- API Connected: ${context.isConnected}
- Available Tools: ${context.availableTools.join(', ')}

Provide helpful responses about data management and suggest appropriate tools.`
            },
            { role: "user", content: message }
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

        return NextResponse.json({
          response: completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.",
          toolUsed: "fallback"
        });
      } catch (fallbackError: any) {
        if (fallbackError.status === 429 || fallbackError.code === 'insufficient_quota') {
          return NextResponse.json({
            response: "⚠️ OpenAI quota exceeded. Please check your billing details or try again later.\n\nIn the meantime, you can use the Tools tab to directly interact with your Basin Admin MCP server.",
            toolUsed: "quota-exceeded"
          });
        }
        throw fallbackError;
      }
    }

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      response: "Sorry, I encountered an error processing your message. Please try again.",
      toolUsed: null
    }, { status: 500 });
  }
}
