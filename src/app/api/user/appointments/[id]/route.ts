// app/api/user/appointments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/appointmentSchema';
import User from '@/lib/models/userSchema';
import type { IAppointment } from '@/lib/models/appointmentSchema';
import { verifyAccessToken } from '@/lib/auth/user-jwt';

// Define interface for authenticated user
interface AuthenticatedUser {
  _id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  nic?: string;
  nicNumber?: string;
  email: string;
  mobileNumber?: string;
  phoneNumber?: string;
  accountStatus: string;
}

interface PopulatedAgent {
  _id: string;
  fullName: string;
  position: string;
  officeName: string;
}

// Authentication helper function using the same method as the main appointments route
async function authenticateWithCookies(request: NextRequest): Promise<{
  success: boolean;
  user?: AuthenticatedUser;
  message: string;
  statusCode: number;
}> {
  try {
    // Get access token from cookies (same as main appointments route)
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
        firstName: user.firstName,
        lastName: user.lastName,
        nic: user.nic || user.nicNumber,
        mobileNumber: user.mobileNumber || user.phoneNumber,
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

export async function GET(
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

    console.log('📋 Fetching appointment details for user:', user._id, 'appointment:', appointmentId);

    // Fetch specific appointment that belongs to the user
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      citizenId: user._id // Ensure user can only see their own appointments
    })
      .populate('assignedAgent', 'fullName position officeName')
      .lean();

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: 'Appointment not found' },
        { status: 404 }
      );
    }

    console.log('✅ Found appointment:', appointmentId);

    // Transform appointment data
    const appointmentData = appointment as unknown as IAppointment;
    const transformedAppointment = {
      id: appointmentData._id?.toString() || appointmentId,
      bookingReference: appointmentData.bookingReference,
      serviceType: appointmentData.serviceType,
      department: appointmentData.department,
      date: (appointmentData.date as Date).toISOString().split('T')[0],
      time: appointmentData.time,
      status: appointmentData.status,
      priority: appointmentData.priority,
      notes: appointmentData.notes,
      assignedAgent: appointmentData.assignedAgent ? {
        name: (appointmentData.assignedAgent as unknown as PopulatedAgent).fullName,
        position: (appointmentData.assignedAgent as unknown as PopulatedAgent).position,
        office: (appointmentData.assignedAgent as unknown as PopulatedAgent).officeName
      } : null,
      submittedDate: (appointmentData.submittedDate as Date).toISOString().split('T')[0],
      qrCode: appointmentData.qrCode || null
    };

    return NextResponse.json({
      success: true,
      message: 'Appointment retrieved successfully',
      data: transformedAppointment
    });

  } catch (error) {
    console.error('❌ Get appointment details error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      userId: user?._id || 'not authenticated',
      appointmentId: appointmentId
    });
    
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve appointment details' },
      { status: 500 }
    );
  }
}
