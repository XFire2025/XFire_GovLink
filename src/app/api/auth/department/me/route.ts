import { NextRequest, NextResponse } from 'next/server';
import { departmentAuthMiddleware } from '@/lib/auth/department-middleware';
import DepartmentAuthService from '@/lib/auth/department-auth-service';

export async function GET(request: NextRequest) {
  try {
    // Authenticate department
    const authResult = await departmentAuthMiddleware(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.statusCode }
      );
    }

    // Get department profile
    const result = await DepartmentAuthService.getDepartmentProfile(authResult.department!.id);

    const status = result.success ? 200 : 404;
    return NextResponse.json(result, { status });

  } catch (error) {
    console.error('Department profile API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        errors: ['Failed to retrieve profile']
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