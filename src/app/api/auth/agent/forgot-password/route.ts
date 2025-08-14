import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import Agent from '@/lib/models/agentSchema';
import { sendAgentPasswordResetEmail } from '@/lib/services/govlinkEmailService';
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

    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email is required',
          errors: ['Email address is required']
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid email format',
          errors: ['Please enter a valid email address']
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Find agent by email
    const agent = await Agent.findOne({ 
      email: email.toLowerCase().trim() 
    });

    // Always return success to prevent email enumeration attacks
    // But only send email if agent exists and is active
    if (agent && agent.isActive) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Save reset token to agent
      agent.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      agent.passwordResetExpires = resetExpires;
      await agent.save();

      // Send password reset email
      try {
        await sendAgentPasswordResetEmail(agent.fullName, agent.email, resetToken);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        // Don't fail the request if email sending fails
        // The token is still saved and can be used
      }
    }

    // Always return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'If an account with that email exists, a password reset link has been sent.',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while processing your request',
        errors: ['Internal server error']
      },
      { status: 500 }
    );
  }
}
