// src/app/api/ragbot/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSriLankanGovRAGAgent } from '@/lib/ragAgent';

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get API keys from environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const tavilyApiKey = process.env.TAVILY_API_KEY;

    if (!openaiApiKey || !tavilyApiKey) {
      console.error('Missing API keys:', { 
        openaiApiKey: !!openaiApiKey, 
        tavilyApiKey: !!tavilyApiKey 
      });
      return NextResponse.json(
        { error: 'API keys not configured' },
        { status: 500 }
      );
    }

    // Create RAG agent
    const ragAgent = createSriLankanGovRAGAgent({
      openaiApiKey,
      tavilyApiKey,
    });

    // Process the query
    const result = await ragAgent.processQuery(
      message,
      sessionId || `session_${Date.now()}`
    );

    return NextResponse.json({
      response: result.response,
      searchResults: result.searchResults,
      departmentContacts: result.departmentContacts,
      sources: result.sources,
      sessionId: sessionId || `session_${Date.now()}`,
    });

  } catch (error) {
    console.error('Error in RAG bot chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'RAG Bot API is running',
    endpoints: {
      chat: 'POST /api/ragbot/chat',
      history: 'GET /api/ragbot/history/:sessionId',
      clear: 'DELETE /api/ragbot/history/:sessionId'
    }
  });
}
