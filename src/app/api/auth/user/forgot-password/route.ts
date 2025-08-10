import { NextRequest, NextResponse } from 'next/server';
import { generatePasswordResetToken } from '@/lib/auth/user-jwt';
import { sendPasswordResetEmail } from '@/lib/auth/user-email';
import { authRateLimit } from '@/lib/auth/user-middleware';
import User from '@/lib/models/userSchema';
import connect from '@/lib/db';

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

    await connect();

    // Parse request body
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email is required',
          errors: ['Email parameter is missing']
        },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Always return success for security reasons (don't reveal if email exists)
    const successResponse = NextResponse.json(
      { 
        success: true, 
        message: 'If an account with that email exists, a password reset link has been sent.'
      },
      { status: 200 }
    );

    // If user doesn't exist, still return success but don't send email
    if (!user) {
      return successResponse;
    }

    // Check if account is active
    if (user.accountStatus === 'suspended' || user.accountStatus === 'deactivated') {
      return successResponse; // Don't reveal account status
    }

    // Generate password reset token
    const resetToken = generatePasswordResetToken(user);
    
    // Store reset token and expiry in database
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, user.fullName, resetToken);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      // Don't reveal email sending failures to user for security
    }

    return successResponse;

  } catch (error) {
    console.error('Forgot password API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        errors: ['Password reset request failed due to server error']
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
