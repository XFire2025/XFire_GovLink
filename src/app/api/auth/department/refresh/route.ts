import { NextRequest, NextResponse } from 'next/server';
import DepartmentAuthService from '@/lib/auth/department-auth-service';

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies or body
    let refreshToken = request.cookies.get('department_refresh_token')?.value;
    
    if (!refreshToken) {
      const body = await request.json();
      refreshToken = body.refreshToken;
    }

    if (!refreshToken) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Refresh token is required',
          errors: ['Missing refresh token']
        },
        { status: 400 }
      );
    }

    // Refresh token
    const result = await DepartmentAuthService.refreshDepartmentToken(refreshToken);

    // Set HTTP status based on result
    const status = result.success ? 200 : 401;

    // Set new cookies if refresh successful
    const response = NextResponse.json(result, { status });
    
    if (result.success && result.tokens) {
      response.cookies.set('department_access_token', result.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/'
      });

      response.cookies.set('department_refresh_token', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
      });
    }

    return response;

  } catch (error) {
    console.error('Department token refresh API error:', error);
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