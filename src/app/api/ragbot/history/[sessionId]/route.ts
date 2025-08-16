// src/app/api/ragbot/history/[sessionId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get API keys from environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const tavilyApiKey = process.env.TAVILY_API_KEY;

    if (!openaiApiKey || !tavilyApiKey) {
      return NextResponse.json(
        { error: 'API keys not configured' },
        { status: 500 }
      );
    }

    // Create RAG agent (lazy import to avoid build-time side-effects)  
    const { getSriLankanGovRAGAgent } = await import('@/lib/ragAgent');  
    const ragAgent = getSriLankanGovRAGAgent();  

    // Get chat history
    const messages = await ragAgent.getChatHistory(sessionId);

    return NextResponse.json({
      sessionId,
      messages: messages.map(msg => ({
        type: msg._getType(),
        content: msg.content,
        timestamp: new Date().toISOString(),
      })),
    });

  } catch (error) {
    console.error('Error retrieving chat history:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve chat history',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get API keys from environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const tavilyApiKey = process.env.TAVILY_API_KEY;

    if (!openaiApiKey || !tavilyApiKey) {
      return NextResponse.json(
        { error: 'API keys not configured' },
        { status: 500 }
      );
    }

    // Create RAG agent (lazy import to avoid build-time side-effects)  
    const { getSriLankanGovRAGAgent } = await import('@/lib/ragAgent');  
    const ragAgent = getSriLankanGovRAGAgent();  
    
    // Clear chat history
    await ragAgent.clearChatHistory(sessionId);

    return NextResponse.json({
      message: 'Chat history cleared successfully',
      sessionId,
    });

  } catch (error) {
    console.error('Error clearing chat history:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to clear chat history',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
