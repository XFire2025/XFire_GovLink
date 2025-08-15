import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailVerificationToken } from '@/lib/auth/user-jwt';
import User from '@/lib/models/userSchema';
import connect from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    await connect();

    // Parse request body
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Verification token is required',
          errors: ['Token parameter is missing']
        },
        { status: 400 }
      );
    }

    // Verify email token
    const decoded = verifyEmailVerificationToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid or expired verification token',
          errors: ['Verification token is invalid or has expired']
        },
        { status: 400 }
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

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Email is already verified'
        },
        { status: 200 }
      );
    }

    // Update user verification status
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    user.emailVerificationToken = undefined;
    
    // Update verification status
    if (user.verificationStatus === 'unverified') {
      user.verificationStatus = 'email_verified';
    }

    await user.save();

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email verified successfully',
        user: {
          id: user._id,
          email: user.email,
          emailVerified: user.emailVerified,
          verificationStatus: user.verificationStatus
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email verification API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        errors: ['Email verification failed due to server error']
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
