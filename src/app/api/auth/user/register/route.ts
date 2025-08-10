import { NextRequest, NextResponse } from 'next/server';
import UserAuthService, { UserRegistrationData } from '@/lib/auth/user-auth-service';
import { authRateLimit } from '@/lib/auth/user-middleware';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await authRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: rateLimitResult.message },
        { status: rateLimitResult.statusCode }
      );
    }

    // Parse request body
    const body: UserRegistrationData = await request.json();

    // Validate required fields
    const requiredFields = ['fullName', 'nicNumber', 'dateOfBirth', 'mobileNumber', 'email', 'password'];
    const missingFields = requiredFields.filter(field => !body[field as keyof UserRegistrationData]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields',
          errors: missingFields.map(field => `${field} is required`)
        },
        { status: 400 }
      );
    }

    // Register user
    const result = await UserAuthService.registerUser(body);

    // Set HTTP status based on result
    const status = result.success ? 201 : 400;

    // Set cookies if registration successful
    const response = NextResponse.json(result, { status });
    
    if (result.success && result.tokens) {
      // Set secure HTTP-only cookies
      response.cookies.set('access_token', result.tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60, // 15 minutes
        path: '/'
      });

      response.cookies.set('refresh_token', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
      });
    }

    return response;

  } catch (error) {
    console.error('User registration API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        errors: ['Registration failed due to server error']
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
