import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateAccessToken } from '@/lib/auth/user-jwt';
import User from '@/lib/models/userSchema';
import connect from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await connect();

    // Get refresh token from cookies
    const refreshToken = request.cookies.get('refresh_token')?.value;

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

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid refresh token',
          errors: ['Refresh token is invalid or expired']
        },
        { status: 401 }
      );
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User not found',
          errors: ['User associated with token not found']
        },
        { status: 404 }
      );
    }

    // Check if user account is active
    if (user.accountStatus !== 'active' && user.accountStatus !== 'pending_verification') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Account not accessible',
          errors: [`Account is ${user.accountStatus}`]
        },
        { status: 403 }
      );
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Set new access token cookie
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Token refreshed successfully',
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          accountStatus: user.accountStatus,
          profileStatus: user.profileStatus
        }
      },
      { status: 200 }
    );

    response.cookies.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Token refresh API error:', error);
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
