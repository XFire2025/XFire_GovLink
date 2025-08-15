// app/api/user/appointments/[id]/cancel/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/appointmentSchema';
import User from '@/lib/models/userSchema';
import type { IAppointment } from '@/lib/models/appointmentSchema';
import { verifyAccessToken } from '@/lib/auth/user-jwt';

// Define interface for authenticated user
interface AuthenticatedUser {
  _id: string;
  email: string;
  accountStatus: string;
}

// Authentication helper function
async function authenticateWithCookies(request: NextRequest): Promise<{
  success: boolean;
  user?: AuthenticatedUser;
  message: string;
  statusCode: number;
}> {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return {
        success: false,
        message: 'Access token not found',
        statusCode: 401
      };
    }

    // Verify the access token
    let decoded;
    try {
      decoded = verifyAccessToken(accessToken);
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        message: 'Invalid or expired access token',
        statusCode: 401
      };
    }

    // Connect to database
    await connectDB();

    // Find user in database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return {
        success: false,
        message: 'User not found',
        statusCode: 404
      };
    }

    // Check account status
    if (user.accountStatus === 'suspended') {
      return {
        success: false,
        message: 'Account is suspended',
        statusCode: 403
      };
    }

    return {
      success: true,
      user: {
        _id: user._id.toString(),
        email: user.email,
        accountStatus: user.accountStatus
      } as AuthenticatedUser,
      message: 'Authenticated successfully',
      statusCode: 200
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      message: 'Authentication failed',
      statusCode: 401
    };
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let user: AuthenticatedUser | null = null;
  let appointmentId: string = '';
  
  try {
    // Authenticate user using cookies
    const authResult = await authenticateWithCookies(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: authResult.statusCode }
      );
    }

    user = authResult.user!;
    const resolvedParams = await params;
    appointmentId = resolvedParams.id;

    if (!appointmentId) {
      return NextResponse.json(
        { success: false, message: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    console.log('🚫 Cancelling appointment for user:', user._id, 'appointment:', appointmentId);

    // Find the appointment that belongs to the user
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      citizenId: user._id // Ensure user can only cancel their own appointments
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check if appointment can be cancelled
    const appointmentData = appointment as unknown as IAppointment;
    
    if (appointmentData.status === 'cancelled') {
      return NextResponse.json(
        { success: false, message: 'Appointment is already cancelled' },
        { status: 400 }
      );
    }

    if (appointmentData.status === 'completed') {
      return NextResponse.json(
        { success: false, message: 'Cannot cancel a completed appointment' },
        { status: 400 }
      );
    }

    // Update appointment status to cancelled and invalidate QR code
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: 'cancelled',
        cancelledDate: new Date(),
        // Invalidate QR code by removing it or marking it as invalid
        $unset: {
          qrCode: 1 // Remove the QR code completely
        }
      },
      { new: true }
    );

    if (!updatedAppointment) {
      return NextResponse.json(
        { success: false, message: 'Failed to cancel appointment' },
        { status: 500 }
      );
    }

    console.log('✅ Appointment cancelled successfully:', appointmentId);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: {
        id: appointmentId,
        status: 'cancelled',
        cancelledDate: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Cancel appointment error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      userId: user?._id || 'not authenticated',
      appointmentId: appointmentId
    });
    
    return NextResponse.json(
      { success: false, message: 'Failed to cancel appointment' },
      { status: 500 }
    );
  }
}
