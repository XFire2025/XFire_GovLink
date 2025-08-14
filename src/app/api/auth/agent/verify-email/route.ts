import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import Agent from '@/lib/models/agentSchema';
import { sendAgentEmailVerification } from '@/lib/services/govlinkEmailService';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

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

    await connectDB();

    // Find agent by email
    const agent = await Agent.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (!agent) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Agent not found',
          errors: ['No agent found with this email address']
        },
        { status: 404 }
      );
    }

    if (agent.isEmailVerified) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email is already verified',
          errors: ['This email address is already verified']
        },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save verification token
    agent.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    agent.emailVerificationExpires = verificationExpires;
    await agent.save();

    // Send verification email
    try {
      await sendAgentEmailVerification(agent.fullName, agent.email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send verification email',
          errors: ['Email service error']
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Verification email sent successfully',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Send verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while sending verification email',
        errors: ['Internal server error']
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Verification token is required',
          errors: ['No verification token provided']
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Hash the token to compare with stored version
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find agent with valid verification token
    const agent = await Agent.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() }, // Token not expired
    });

    if (!agent) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid or expired verification token',
          errors: ['Verification token is invalid or has expired']
        },
        { status: 400 }
      );
    }

    // Mark email as verified and clear verification fields
    agent.isEmailVerified = true;
    agent.emailVerificationToken = undefined;
    agent.emailVerificationExpires = undefined;

    await agent.save();

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email verified successfully',
        agent: {
          id: agent._id,
          fullName: agent.fullName,
          email: agent.email,
          isEmailVerified: agent.isEmailVerified
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred during email verification',
        errors: ['Internal server error']
      },
      { status: 500 }
    );
  }
}
