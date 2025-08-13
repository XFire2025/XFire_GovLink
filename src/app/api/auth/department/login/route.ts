import { NextRequest, NextResponse } from 'next/server';
import DepartmentAuthService, { DepartmentLoginData } from '@/lib/auth/department-auth-service';
import { departmentAuthRateLimit } from '@/lib/auth/department-middleware';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await departmentAuthRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: rateLimitResult.message },
        { status: rateLimitResult.statusCode }
      );
    }

    // Parse request body
    const body: DepartmentLoginData = await request.json();

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

    // Login department
    const result = await DepartmentAuthService.loginDepartment(body);

    // Set HTTP status based on result
    const status = result.success ? 200 : 401;

    // Set cookies if login successful
    const response = NextResponse.json(result, { status });
    
    if (result.success && result.tokens) {
      // Set secure HTTP-only cookies
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
    console.error('Department login API error:', error);
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