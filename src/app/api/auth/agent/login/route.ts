import { NextRequest, NextResponse } from 'next/server';
import AgentAuthService, { AgentLoginData } from '@/lib/auth/agent-auth-service';
import { agentAuthRateLimit } from '@/lib/auth/agent-middleware';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await agentAuthRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: rateLimitResult.message },
        { status: rateLimitResult.statusCode }
      );
    }

    // Parse request body
    const body: AgentLoginData = await request.json();

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email and password are required',
          errors: ['Missing email or password']
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email format',
          errors: ['Please enter a valid email address']
        },
        { status: 400 }
      );
    }

    // Login agent
    const result = await AgentAuthService.loginAgent(body);

    // Set HTTP status based on result
    const status = result.success ? 200 : 401;

    // Set cookies if login successful
    const response = NextResponse.json(result, { status });
    
    if (result.success && result.tokens) {
      // Set secure HTTP-only cookies for agent
      response.cookies.set('agent_access_token', result.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60, // 15 minutes
        path: '/'
      });

      response.cookies.set('agent_refresh_token', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
      });
    }

    return response;

  } catch (error) {
    console.error('Agent login API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        errors: ['Login failed due to server error']
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
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
