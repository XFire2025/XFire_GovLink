import { NextRequest, NextResponse } from 'next/server';
import { authenticateAgent } from '@/lib/auth/agent-middleware';

export async function GET(request: NextRequest) {
  try {
    // Authenticate agent
    const authResult = await authenticateAgent(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: authResult.message,
          errors: [authResult.message]
        },
        { status: authResult.statusCode }
      );
    }

    // Return agent profile
    return NextResponse.json(
      { 
        success: true, 
        message: 'Agent profile retrieved successfully',
        agent: authResult.agent
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Agent profile API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        errors: ['Failed to retrieve agent profile']
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}
