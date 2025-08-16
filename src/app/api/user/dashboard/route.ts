// src/app/api/user/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { verifyAccessToken, JWTPayload } from '@/lib/auth/user-jwt';
import User from '@/lib/models/userSchema';
import Appointment from '@/lib/models/appointmentSchema';
import Submission from '@/lib/models/submissionSchema';
import Feedback from '@/lib/models/feedbackSchema';

// GET /api/user/dashboard - Get user dashboard data
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get access token from cookies
    const accessToken = request.cookies.get('access_token')?.value;
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Access token not found' },
        { status: 401 }
      );
    }

    // Verify the access token
    let decoded: JWTPayload;
    try {
      decoded = verifyAccessToken(accessToken);
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { success: false, message: 'Invalid or expired access token' },
        { status: 401 }
      );
    }

    // Get complete user data
    const userData = await User.findById(decoded.userId).select('-password');
    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Debug logging
    console.log('Dashboard API - User data:', {
      id: userData._id,
      fullName: userData.fullName,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      nicNumber: userData.nicNumber,
      nic: userData.nic
    });

    // Get current date for filtering
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get appointments count
    const [totalAppointments, activeAppointments] = await Promise.all([
      Appointment.countDocuments({ citizenId: decoded.userId }),
      Appointment.countDocuments({ 
        citizenId: decoded.userId, 
        status: { $in: ['scheduled', 'confirmed'] }
      })
    ]);

    // Get submissions/applications count
    const [totalApplications, pendingApplications] = await Promise.all([
      Submission.countDocuments({ citizenId: decoded.userId }),
      Submission.countDocuments({ 
        citizenId: decoded.userId, 
        status: { $in: ['submitted', 'under_review', 'pending_payment'] }
      })
    ]);

    // Get completed count (approved submissions + completed appointments)
    const [completedSubmissions, completedAppointments] = await Promise.all([
      Submission.countDocuments({ 
        citizenId: decoded.userId, 
        status: 'approved' 
      }),
      Appointment.countDocuments({ 
        citizenId: decoded.userId, 
        status: 'completed' 
      })
    ]);

    // Get messages count (feedback given by user)
    const messagesCount = await Feedback.countDocuments({ 
      citizenId: decoded.userId 
    });

    // Calculate recent activity (this month)
    const [recentAppointments, recentApplications] = await Promise.all([
      Appointment.countDocuments({ 
        citizenId: decoded.userId,
        createdAt: { $gte: startOfMonth }
      }),
      Submission.countDocuments({ 
        citizenId: decoded.userId,
        createdAt: { $gte: startOfMonth }
      })
    ]);

    // Prepare dashboard stats
    const dashboardStats = {
      activeBookings: activeAppointments,
      applications: pendingApplications,
      messages: messagesCount,
      completed: completedSubmissions + completedAppointments
    };

    // Prepare user profile data
    const userProfile = {
      id: userData._id,
      fullName: userData.fullName,
      firstName: userData.firstName || userData.fullName?.split(' ')[0] || userData.email?.split('@')[0],
      lastName: userData.lastName || userData.fullName?.split(' ').slice(1).join(' ') || '',
      email: userData.email,
      nicNumber: userData.nicNumber || userData.nic, // Support both field names
      mobileNumber: userData.mobileNumber,
      accountStatus: userData.accountStatus,
      verificationStatus: userData.verificationStatus,
      profileStatus: userData.profileStatus,
      isEmailVerified: userData.verificationStatus !== 'unverified',
      isProfileComplete: userData.profileStatus === 'verified',
      profileCompletionPercentage: calculateProfileCompletion(userData)
    };

    // Prepare activity summary
    const activitySummary = {
      totalAppointments,
      totalApplications,
      recentActivity: {
        thisMonth: {
          appointments: recentAppointments,
          applications: recentApplications
        }
      }
    };

    return NextResponse.json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        user: userProfile,
        stats: dashboardStats,
        activity: activitySummary
      }
    });

  } catch (error) {
    console.error('Get user dashboard data error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve dashboard data' },
      { status: 500 }
    );
  }
}

// Helper function to calculate profile completion percentage
function calculateProfileCompletion(user: Record<string, unknown>): number {
  const requiredFields = [
    'fullName',
    'email', 
    'nicNumber',
    'dateOfBirth',
    'mobileNumber'
  ];

  const optionalFields = [
    'nameInSinhala',
    'nameInTamil', 
    'gender',
    'permanentAddress',
    'emergencyContact',
    'profilePicture'
  ];

  let completedRequired = 0;
  let completedOptional = 0;

  // Check required fields (worth 70% of completion)
  requiredFields.forEach(field => {
    if (user[field] && user[field] !== '') {
      completedRequired++;
    }
  });

  // Check optional fields (worth 30% of completion)
  optionalFields.forEach(field => {
    if (user[field] && user[field] !== '') {
      completedOptional++;
    }
  });

  // Calculate percentage
  const requiredPercentage = (completedRequired / requiredFields.length) * 70;
  const optionalPercentage = (completedOptional / optionalFields.length) * 30;

  return Math.round(requiredPercentage + optionalPercentage);
}
