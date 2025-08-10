import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/user-jwt';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/userSchema';

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Access token not found' },
        { status: 401 }
      );
    }

    // Verify the access token
    let decoded;
    try {
      decoded = verifyAccessToken(accessToken);
    } catch {
      return NextResponse.json(
        { message: 'Invalid or expired access token' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Find user in database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate profile completion percentage
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'nic', 'mobileNumber'];
    const optionalFields = ['address', 'district', 'province', 'postalCode'];
    
    const completedRequired = requiredFields.filter(field => user[field]).length;
    const completedOptional = optionalFields.filter(field => user[field]).length;
    
    const profileCompletionPercentage = Math.round(
      ((completedRequired / requiredFields.length) * 70) + 
      ((completedOptional / optionalFields.length) * 30)
    );

    const isProfileComplete = completedRequired === requiredFields.length;

    // Return user data
    const userData = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      nic: user.nic,
      mobileNumber: user.mobileNumber,
      accountStatus: user.accountStatus,
      isEmailVerified: user.isEmailVerified,
      isProfileComplete,
      profileCompletionPercentage,
      district: user.district,
      province: user.province,
      address: user.address,
      postalCode: user.postalCode,
      preferredLanguage: user.preferredLanguage,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    };

    return NextResponse.json(
      { 
        message: 'User data retrieved successfully',
        user: userData
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get user info error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
