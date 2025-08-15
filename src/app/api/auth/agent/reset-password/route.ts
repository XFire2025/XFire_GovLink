import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import Agent from '@/lib/models/agentSchema';

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword, confirmPassword } = await request.json();

    // Validate required fields
    if (!token || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'All fields are required',
          errors: ['Token, new password, and confirmation are required']
        },
        { status: 400 }
      );
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Passwords do not match',
          errors: ['Password confirmation does not match']
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Password must be at least 8 characters long',
          errors: ['Password too short']
        },
        { status: 400 }
      );
    }

    // Additional password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
          errors: ['Password does not meet security requirements']
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Hash the token to compare with stored version
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find agent with valid reset token
    const agent = await Agent.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() }, // Token not expired
      isActive: true
    });

    if (!agent) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid or expired reset token',
          errors: ['Reset token is invalid or has expired']
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update agent password and clear reset fields
    agent.password = hashedPassword;
    agent.passwordResetToken = undefined;
    agent.passwordResetExpires = undefined;
    agent.loginAttempts = 0; // Reset login attempts
    agent.accountLockedUntil = undefined; // Unlock account if locked

    await agent.save();

    return NextResponse.json(
      { 
        success: true, 
        message: 'Password has been reset successfully. You can now log in with your new password.',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while resetting your password',
        errors: ['Internal server error']
      },
      { status: 500 }
    );
  }
}
