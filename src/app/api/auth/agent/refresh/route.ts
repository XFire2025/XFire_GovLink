import { NextRequest, NextResponse } from 'next/server';
import AgentAuthService from '@/lib/auth/agent-auth-service';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies
    const refreshToken = request.cookies.get('agent_refresh_token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Refresh token not found',
          errors: ['No refresh token provided']
        },
        { status: 401 }
      );
    }

    // Refresh the token
    const result = await AgentAuthService.refreshToken(refreshToken);

    // Set HTTP status based on result
    const status = result.success ? 200 : 401;

    // Set new cookies if refresh successful
    const response = NextResponse.json(result, { status });
    
    if (result.success && result.tokens) {
      // Set new access token cookie
      response.cookies.set('agent_access_token', result.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60, // 15 minutes
        path: '/'
      });

      // Update refresh token cookie (optional - extend expiry)
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
    console.error('Agent token refresh API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        errors: ['Token refresh failed due to server error']
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
